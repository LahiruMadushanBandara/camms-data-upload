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
import { HttpErrorResponse } from '@angular/common/http';
import { ModalResponseMessageComponent } from '../../blocks/modal-response-message/modal-response-message.component';
import { WorkflowElementDataTypeInfo } from 'src/app/models/WorkFlowElementDataTypeInfo.model';

@Component({
  selector: 'app-incident-file-select',
  templateUrl: './incident-file-select.component.html',
  styleUrls: ['./incident-file-select.component.css'],
})
export class IncidentFileSelectComponent implements OnInit, DoCheck {
  @ViewChild('fileInputSelect', { static: true }) fileInputSelect!: ElementRef;
  @Output() newItemEvent = new EventEmitter<Boolean>();
  @ViewChild('modalMessage', { static: false })
  modalMessage!: ModalResponseMessageComponent;

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
  public workflowElementDataTypeInfo: Array<WorkflowElementDataTypeInfo> = [];

  showFileIcon = false;
  showFileInputCloseBtn = false;
  fileToUpload: File | null = null;

  incidentSubscriptionKey: string = '';
  authToken: string = '';

  //upload file
  public showClearButton: boolean = false;
  showApiDetailsError = false;
  apiErrorMsg: string = '';

  constructor(private incidentService: IncidentService) {}
  ngDoCheck(): void {
    //for get workflowElementId using WorkflowId
    if (
      this.selectedWorkFlowId &&
      this.selectedWorkFlowId !== this.controlNgDoCheckForWorkFlowId
    ) {
      this.loaderVisible = true;
      this.disableDownlodeButton = true;
      this.excelSheetColumnNames = [];
      this.workflowElementInfo = [];
      this.workflowElementDataTypeInfo = [];

      this.controlNgDoCheckForWorkFlowId = this.selectedWorkFlowId;
      this.GetWorkFlowElements(this.selectedWorkFlowId);
    }
  }

  ngOnInit(): void {
    this.authToken = localStorage.getItem('auth-token')!;
    this.incidentSubscriptionKey = localStorage.getItem(
      'incident-subscription-key'
    )!;

    this.GetWorkFlowList();
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

        error: (error: HttpErrorResponse) => {
          //ViewModel If Keys are not valid
          console.log(error);
          this.apiErrorMsg = 'Error. Please check authentication keys provided';
          this.showApiDetailsError = true;
          this.modalMessage.open();
        },

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

              error: (error: HttpErrorResponse) => {
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
        workflowId,
        1
      )
      .subscribe({
        next: (res: any) => {
          this.workflowElementId = res.data[0].workflowElementId;
        },

        error: (error) => console.log(error),

        complete: () => {
          this.GetWorkflowElementDetails(
            this.workflowElementId,
            this.pageSizeForWorkflowElementInfo
          );
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
                      dataTypeName: x.dataTypeName,
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

  //Excel sheet downlode

  exportExcel() {
    let workflowElementInfoIndex: number = 0;
    let workflowElementInfoIndexForType = 0;
    // let hierarchies: [] = [];
    // let staffList: [] = [];
    //Title, Header & Data
    const header = this.excelSheetColumnNames;

    //Create a workbook with a worksheet
    let workbook = new Workbook();

    let worksheet = workbook.addWorksheet('Incident Data');
    let worksheetTemp = workbook.addWorksheet('Temp Data');

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

    //create array with data type and index and name
    this.workflowElementInfo.forEach((x: WorkflowElementInfo) => {
      workflowElementInfoIndexForType++;
      this.workflowElementDataTypeInfo.push({
        index: workflowElementInfoIndexForType,
        propertyDisplayText: x.propertyDisplayText,
        dataTypeBelongsToUIndex: x.dataTypeName,
      });
    });
    console.log(this.workflowElementDataTypeInfo);

    // console.log(this.mandatoryColumnExcel);
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

      // worksheet.getCell('C' + i).dataValidation = {
      //   type: 'list',
      //   allowBlank: false,
      //   showErrorMessage: true,
      //   formulae: [`=DataTables!$A$2:$A${hierarchies.length + (i - 1)}`], //'"One,Two,Three,Four"'
      // };

      // worksheet.getCell('D' + i).dataValidation = {
      //   type: 'list',
      //   allowBlank: false,
      //   showErrorMessage: true,
      //   formulae: [`=DataTables!$D$2:$D${staffList.length + (i - 1)}`], //'"One,Two,Three,Four"'
      // };

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

  //upload
  onFileChange(e: any) {
    const workbook = new Workbook();
    this.fileInputSelect.nativeElement.value = e.target.files[0].name;
    this.fileToUpload = e.target.files.item(0);

    this.showFileInputCloseBtn = true;
    this.fileToUpload?.arrayBuffer()?.then((data) => {
      workbook.xlsx.load(data).then((x) => {
        let worksheet = workbook.getWorksheet(1);

        const HeaderRow = worksheet.getRow(1);
        let rowCount = 0;
        worksheet.eachRow({ includeEmpty: false }, function (row, rowNumber) {
          rowCount = rowNumber;
        });

        if (
          HeaderRow.getCell(3).value === null ||
          rowCount <= 1 ||
          worksheet.name !== 'Hierarchy Node Data' ||
          HeaderRow.getCell(1).value !== 'Hierarchy Code'
        ) {
          this.IsFileHasValidData = false;
          this.showErrorCard = true;
          this.changefileSelectBackground = false;
        } else {
          this.IsFileHasValidData = true;
          this.showErrorCard = false;
          this.showSelectBtn = false;
          this.changefileSelectBackground = true;
        }

        this.showFileIcon = true;

        if (this.IsFileHasValidData) {
          this.disabledUploadBtn = false;
        } else {
          this.disabledUploadBtn = true;
        }
      });
      this.showClearButton = true;
    });
  }
  onClickFileInputButton() {
    console.log('more Content to write');
  }
}
