import {
  Component,
  DoCheck,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import * as fs from 'file-saver';
import { Workbook } from 'exceljs';
import { WorkFlowFields } from 'src/app/models/WorkFlowFields.model';
import { IncidentService } from 'src/app/services/incident.service';
import { WorkflowElementInfo } from 'src/app/models/WorkflowElementInfo.model';

@Component({
  selector: 'app-incident-file-select',
  templateUrl: './incident-file-select.component.html',
  styleUrls: ['./incident-file-select.component.css'],
})
export class IncidentFileSelectComponent implements OnInit, DoCheck {
  @ViewChild('fileInputSelect', { static: true }) fileInputSelect!: ElementRef;
  @Output() newItemEvent = new EventEmitter<Boolean>();

  public disableDownlodeButton = true;
  public loaderVisible = false;
  public showErrorCard = false;
  public isIconShow = false;
  public disabledUploadBtn = true;
  public showSelectBtn = true;
  public selectedWorkFlowId?: number;
  changefileSelectBackground = false;
  public showFileSuccessMessage = false;
  IsFileHasValidData = false;
  public workFlowList: Array<WorkFlowFields> = [];
  public loaderForDropDown = true;
  public disableDropDown = true;
  public pageSize = 1;
  public workFlowListForFilter: Array<WorkFlowFields> = [];
  public isNotIncidentObjectAvailable?: boolean;
  public controlNgDoCheckForWorkFlowId?: number;

  public workflowElementId: number = 0;
  public pageSizeForWorkflowElementInfo: number = 1;

  public excelSheetColumnNames: Array<string> = [];
  public mandatoryColumnExcel: Array<string> = [];
  public workflowElementInfo: Array<WorkflowElementInfo> = [];

  showFileIcon = false;
  showFileInputCloseBtn = false;
  fileToUpload: File | null = null;

  incidentSubscriptionKey: string = '';
  authToken: string = '';

  constructor(private incidentService: IncidentService) {}
  ngDoCheck(): void {
    //for get workflowElementId using WorkflowId
    if (
      this.selectedWorkFlowId &&
      this.selectedWorkFlowId !== this.controlNgDoCheckForWorkFlowId
    ) {
      //for development
      this.isNotIncidentObjectAvailable = undefined;
      this.loaderVisible = true;
      this.disableDownlodeButton = true;
      this.excelSheetColumnNames = [];
      this.workflowElementInfo = [];
      console.log(this.selectedWorkFlowId);
      this.controlNgDoCheckForWorkFlowId = this.selectedWorkFlowId;
      this.GetWorkFlowElements(this.selectedWorkFlowId);
    }
  }

  ngOnInit(): void {
    this.authToken = JSON.parse(localStorage.getItem('auth-token')!);
    this.incidentSubscriptionKey = JSON.parse(
      localStorage.getItem('incident-subscription-key')!
    );
    this.GetWorkFlowList();
    console.log(this.returnExcelCoulmnForNumericValue(28));
  }

  //GetWork flow list
  GetWorkFlowList() {
    this.incidentService
      .getWorkFlowList(
        this.incidentSubscriptionKey,
        this.authToken,
        this.pageSize
      )
      .subscribe({
        next: (res: any) => (this.pageSize = res.totalRowCount),

        error: (error) => console.log(error),

        complete: () => {
          this.incidentService
            .getWorkFlowList(
              this.incidentSubscriptionKey,
              this.authToken,
              this.pageSize
            )
            .subscribe({
              next: (res: any) => {
                res.data.forEach((x: WorkFlowFields) => {
                  this.workFlowList.push({
                    workflowId: x.workflowId,
                    workflowName: x.workflowName,
                  });
                });
              },

              error: (error) => {
                console.log(error);
              },

              complete: () => {
                this.loaderForDropDown = false;
                this.disableDropDown = false;

                //dropdownFilter
                this.workFlowListForFilter = this.workFlowList.slice();
              },
            });
        },
      });
  }

  //to get object(IncidentObjct) useing selectedWorkFlowId
  GetWorkFlowElements(workflowId: number) {
    this.incidentService
      .getWorkFlowElements(
        this.incidentSubscriptionKey,
        this.authToken,
        workflowId
      )
      .subscribe({
        next: (res: any) => {
          res.data.forEach((x: any) => {
            if (x.name === 'IncidentObject' && x.isStandardObject === true) {
              this.workflowElementId = x.workflowElementId;

              //for development
              this.isNotIncidentObjectAvailable = false;
            }
          });
        },

        error: (error) => console.log(error),

        complete: () => {
          if (this.isNotIncidentObjectAvailable != false) {
            //for development
            this.isNotIncidentObjectAvailable = true;
          } else {
            this.GetWorkflowElementDetails(
              this.workflowElementId,
              this.pageSizeForWorkflowElementInfo
            );
          }
        },
      });
  }

  //using workflowElementId get workflowElementInfo

  GetWorkflowElementDetails(workflowElementId: number, pageSize: number) {
    this.incidentService
      .getWorkFlowElementsFieldInfo(
        this.incidentSubscriptionKey,
        this.authToken,
        workflowElementId,
        pageSize
      )
      .subscribe({
        next: (res: any) => {
          pageSize = res.totalRowCount;
        },
        error: (err: any) => {
          console.log(err);
        },
        complete: () => {
          this.incidentService
            .getWorkFlowElementsFieldInfo(
              this.incidentSubscriptionKey,
              this.authToken,
              workflowElementId,
              pageSize
            )
            .subscribe({
              next: (res: any) => {
                res.data.forEach((x: WorkflowElementInfo) => {
                  if (x.isVisibleInDetail) {
                    this.workflowElementInfo.push({
                      fieldName: x.fieldName,
                      propertyDisplayText: x.propertyDisplayText,
                      isVisibleInDetail: x.isVisibleInDetail,
                      isRequired: x.isRequired,
                    });
                    this.excelSheetColumnNames.push(x.propertyDisplayText);
                  }
                });
              },
              error: (err: any) => {
                console.log(err);
              },
              complete: () => {
                this.loaderVisible = false;
                this.disableDownlodeButton = false;
                console.log(this.excelSheetColumnNames);
                console.log(this.workflowElementInfo);
              },
            });
        },
      });
  }

  //dropdown Filter
  handleFilter(value: string) {
    this.workFlowListForFilter = this.workFlowList.filter(
      (s) => s.workflowName.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }

  //el sheet downlode
  // /excelData: any, hierarchies: [], staffList: []
  exportExcel() {
    let workflowElementInfoIndex: number = 0;
    let hierarchies: [] = [];
    let staffList: [] = [];
    //Title, Header & Data
    const header = this.excelSheetColumnNames;

    //Create a workbook with a worksheet
    let workbook = new Workbook();

    let worksheet = workbook.addWorksheet('Hierarchy Node Data');

    //Adding Header Row
    let headerRow = worksheet.addRow(header);
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'C0C0C0' },
        bgColor: { argb: '' },
      };
      cell.font = {
        bold: true,
        color: { argb: '#000000' },
        size: 11,
      };
    });

    //set Mandatory fields
    this.workflowElementInfo.forEach((x: WorkflowElementInfo) => {
      workflowElementInfoIndex++;
      if (x.isRequired == true) {
        this.mandatoryColumnExcel.push(
          this.returnExcelCoulmnForNumericValue(workflowElementInfoIndex)
        );
      }
    });

    console.log(this.mandatoryColumnExcel);
    var columns = this.mandatoryColumnExcel;
    var mandatoryColumns = this.mandatoryColumnExcel;

    columns.forEach((col) => {
      let cell = worksheet.getCell(col + '1');
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'ffc7ce' },
      };
      cell.font = { bold: true, color: { argb: '9c0006' } };
    });

    for (let i = 2; i < 5000; i++) {
      mandatoryColumns.forEach((col) => {
        worksheet.getCell(col + i).dataValidation = {
          type: 'custom',
          allowBlank: false,
          showErrorMessage: true,
          formulae: [`=NOT(ISBLANK(${col + i}))`],
        };
      });
      worksheet.getCell('C' + i).dataValidation = {
        type: 'list',
        allowBlank: false,
        showErrorMessage: true,
        formulae: [`=DataTables!$A$2:$A${hierarchies.length + (i - 1)}`], //'"One,Two,Three,Four"'
      };

      worksheet.getCell('D' + i).dataValidation = {
        type: 'list',
        allowBlank: false,
        showErrorMessage: true,
        formulae: [`=DataTables!$D$2:$D${staffList.length + (i - 1)}`], //'"One,Two,Three,Four"'
      };

      worksheet.getCell('B' + i).dataValidation = {
        type: 'custom',
        allowBlank: true,
        showErrorMessage: true,
        error: 'Please enter alphanumeric data',
        errorTitle: 'Invalid Description',
        formulae: [
          `=ISNUMBER(SUMPRODUCT(SEARCH(MID(B${i},ROW(INDIRECT("1:"&LEN(B${i}))),1)," _-0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ")))`,
        ],
      };

      worksheet.getCell('A' + i).dataValidation = {
        type: 'custom',
        allowBlank: true,
        showErrorMessage: true,
        error: 'Please enter unique code',
        errorTitle: 'Duplicate Code',
        formulae: [`=COUNTIF($A$2:$A${i}, $A${i})=1`],
      };
      //worksheet.getCell('A' + i).numFmt = '@';
    }
    worksheet.columns.forEach((column) => {
      column.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
      column.width = 20;
    });

    //Generate & Save Excel File
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      fs.saveAs(blob, 'Incident_Upload' + '.xlsx');
    });
  }

  //This function is use to set mandortoryfields , if we give numeric value it retuns column name ex - (27 - 'AA' , 28 - 'AB')
  returnExcelCoulmnForNumericValue(index: number): string {
    let result = '';
    while (index > 0) {
      const remainder = (index - 1) % 26;
      result = String.fromCharCode(65 + remainder) + result;
      index = Math.floor((index - 1) / 26);
    }
    return result;
  }

  // endofCreateExelSheet

  //Downlode xl file
  GetIncidentDetails() {
    this.loaderVisible = true;
    let IncidentCodes: any = [];

    let headerList = [
      'Hierarchy Code',
      'Description',
      'Parent Node',
      'Responsible Person',
    ];
  }

  changeNextButtonBehavior(value: Boolean) {
    this.newItemEvent.emit(value);
  }

  clearSelectedFile() {
    this.fileInputSelect.nativeElement.value = 'Please Select';
    this.showFileIcon = false;
    this.showErrorCard = false;
    this.isIconShow = false;
    this.disabledUploadBtn = true;
    this.IsFileHasValidData = false;
    this.showSelectBtn = true;
    this.showFileSuccessMessage = false;
    this.changefileSelectBackground = false;
    this.fileToUpload = null;
    this.changeNextButtonBehavior(true);
  }

  onFileChange(e: any) {
    console.log('more Content to write');
  }
  onClickFileInputButton() {
    console.log('more Content to write');
  }
}
