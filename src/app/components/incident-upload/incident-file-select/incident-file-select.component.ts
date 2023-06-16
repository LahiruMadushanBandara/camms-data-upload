import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  DoCheck,
  ElementRef,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import * as fs from 'file-saver';
import { Workbook, Worksheet } from 'exceljs';
import { WorkFlowFields } from 'src/app/models/WorkFlowFields.model';
import { IncidentService } from 'src/app/services/incident.service';
import { WorkflowElementInfo } from 'src/app/models/WorkflowElementInfo.model';
import { HttpErrorResponse } from '@angular/common/http';
import { WorkflowElementDataTypeInfo } from 'src/app/models/WorkFlowElementDataTypeInfo.model';
import { fieldsValidationClass } from 'src/app/components/incident-upload/incident-file-select/utils/fieldsValidatingClass/fieldsValidationClass';
import { Observable, Subscription } from 'rxjs';
import { removeSymbolsAndSpaces } from 'src/app/utils/functions/removeSymbolsAndSpaces';
import { returnExcelCoulmnForNumericValue } from 'src/app/utils/functions/returnExcelCoulmnForNumericValue';
import { listMapping } from 'src/app/models/listMapping.model';
import { IncidentUploadSharedService } from 'src/app/services/incident-upload-shared.service';
import { IncidentTypeInfo } from 'src/app/models/IncidentTypeInfo.model';
import { IncidentTypeFields } from 'src/app/models/IncidentTypeFields.model';
import { ModalResponseMessageComponent } from '../../blocks/modal-response-message/modal-response-message.component';

@Component({
  selector: 'app-incident-file-select',
  templateUrl: './incident-file-select.component.html',
  styleUrls: ['./incident-file-select.component.css'],
})
export class IncidentFileSelectComponent implements OnInit, DoCheck, OnDestroy {
  @Output() newItemEvent = new EventEmitter<Boolean>();
  @ViewChild('errorModal', { static: false })
  errorModal!: ModalResponseMessageComponent;

  //subscribe
  private getWorkFlowListPageSizeSub!: Subscription;
  private getWorkFlowListSub!: Subscription;

  // private getWorkFlowSub: Observable<[]> = [];

  public disableDownlodeButton = true;
  public loaderVisible = false;

  public selectedWorkFlowId?: number;
  public selectedWorkFlowName: string = '';

  public selectedTypeId?: number;
  public selectedTypeName: string = '';
  public controlNgDoCheckSelectedTypeId?: number;
  public incidentTypeWithWorkFlow: Array<IncidentTypeInfo> = [];
  public incidentTypeWithWorkFlowForFilters: Array<IncidentTypeInfo> = [];

  public workFlowList: Array<WorkFlowFields> = [];
  public loaderForDropDown = true;
  public disableDropDown = true;
  private loaderAndDropDownVisibleIndex = 0;
  public pageSize = 1;
  public workFlowListForFilter: Array<WorkFlowFields> = [];
  public isNotIncidentObjectAvailable?: boolean;
  public controlNgDoCheckForWorkFlowId?: number;
  public controlNgDoCheckselectedWorkFlowName?: string;

  public workflowElementId: number = 0;
  public workFlowElementSelectedObjectName: string = '';
  public pageSizeForWorkflowElementInfo: number = 1;
  public listMappings: Array<listMapping> = [];

  public excelSheetColumnNames: Array<string> = [];
  public mandatoryColumnExcel: Array<string> = [];
  public workflowElementInfo: Array<WorkflowElementInfo> = [];
  public workflowElementInfoFinal: Array<WorkflowElementInfo> = [];
  public workflowElementDataTypeInfo: Array<WorkflowElementDataTypeInfo> = [];

  public worksheetName: string = '';
  public worksheet!: Worksheet;
  public workbook!: Workbook;
  incidentSubscriptionKey: string = '';
  authToken: string = '';

  showApiDetailsError = false;
  apiErrorMsg: string = '';
  fildValidation: any;
  public IsError!: boolean;
  public errorResponseTitle!: string;
  public errorResponseBody!: string;

  constructor(
    private incidentService: IncidentService,
    private incidentData: IncidentUploadSharedService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}
  ngOnDestroy(): void {}

  ngDoCheck(): void {
    //for get workflowElementId using WorkflowId
    if (
      this.selectedWorkFlowName &&
      this.selectedWorkFlowName !== this.controlNgDoCheckselectedWorkFlowName
    ) {
      this.workFlowListForFilter.forEach((x) => {
        if (x.workflowName == this.selectedWorkFlowName) {
          this.selectedWorkFlowId = x.workflowId;
          console.log(
            'workFLow Belongs To Incident Type->',
            this.selectedWorkFlowName
          );
        }
      });
      //get selected workflowname for file name
      this.workFlowListForFilter.forEach((x: WorkFlowFields) => {
        if (x.workflowId == this.selectedWorkFlowId) {
          this.selectedWorkFlowName = x.workflowName;
        }
      });

      this.loaderVisible = true;
      this.disableDownlodeButton = true;
      this.excelSheetColumnNames = [];
      this.workflowElementInfo = [];
      this.workflowElementDataTypeInfo = [];

      this.controlNgDoCheckselectedWorkFlowName = this.selectedWorkFlowName;
      if (this.selectedWorkFlowId != undefined) {
        this.GetWorkFlowElements(this.selectedWorkFlowId);
      }
    }
  }

  ngOnInit(): void {
    let keyValues = this.incidentData.getKeyValues();
    this.authToken = keyValues.authToken;
    this.incidentSubscriptionKey = keyValues.incidentKey;
    this.GetWorkFlowList();
    this.GetIncidentTypes();
  }

  //getIncidentTypes
  private GetIncidentTypes() {
    this.incidentService
      .getIncidentTypes(this.incidentSubscriptionKey, this.authToken)
      .subscribe({
        next: (res: any) => {
          res.forEach((x: IncidentTypeFields) => {
            this.incidentTypeWithWorkFlow.push({
              typeId: x.typeId,
              typeName: x.typeName,
              workflowName: x.workflowName,
            });
          });
          console.log(
            'incidentTypeWithWorkFlow->',
            this.incidentTypeWithWorkFlow
          );
        },
        error: (error: HttpErrorResponse) => {
          console.log(error);
        },
        complete: () => {
          this.incidentTypeWithWorkFlowForFilters =
            this.incidentTypeWithWorkFlow.slice();
          this.loaderAndDropDownVisibleIndex++;
          if (this.loaderAndDropDownVisibleIndex == 2) {
            this.loaderForDropDown = false;
            this.disableDropDown = false;
          }
        },
      });
  }

  //GetWork flow list
  private GetWorkFlowList() {
    this.getWorkFlowListPageSizeSub = this.incidentService
      .getWorkFlowList(
        this.incidentSubscriptionKey,
        this.authToken,
        this.pageSize
      )
      .subscribe({
        next: (res: any) => (this.pageSize = res.totalRowCount),

        error: (error: HttpErrorResponse) => {
          //ViewModel If Keys are not valid
          this.IsError = true;
          this.errorResponseTitle = 'Error';
          this.errorResponseBody = 'Please check authentication keys provided';
          this.errorModal.open();
        },

        complete: () => {
          this.getWorkFlowListSub = this.incidentService
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
                console.log('workFlowList');
                console.log(this.workFlowList);
                //dropdownFilter
                this.workFlowListForFilter = this.workFlowList.slice();
                this.loaderAndDropDownVisibleIndex++;
                if (this.loaderAndDropDownVisibleIndex == 2) {
                  this.loaderForDropDown = false;
                  this.disableDropDown = false;
                }
              },
            });
        },
      });
    console.log(typeof this.incidentService);
  }

  //to get object(IncidentObjct) or name of object and id using selectedWorkFlowId
  private GetWorkFlowElements(workflowId: number) {
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
          this.workFlowElementSelectedObjectName = res.data[0].name;
        },

        error: (error) => console.log(error),

        complete: () => {
          this.GetWorkflowElementDetails(
            this.workflowElementId,
            this.pageSizeForWorkflowElementInfo
          );
          this.incidentData.setSelectedObject(
            this.workFlowElementSelectedObjectName
          );
        },
      });
  }

  //using workflowElementId get workflowElementInfo
  private GetWorkflowElementDetails(
    workflowElementId: number,
    pageSize: number
  ) {
    if (workflowElementId != undefined) {
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
                next: async (res: any) => {
                  res.data.forEach((x: WorkflowElementInfo) => {
                    if (x.isVisibleInDetail) {
                      this.workflowElementInfo.push({
                        fieldName: x.fieldName,
                        propertyDisplayText: x.propertyDisplayText,
                        isVisibleInDetail: x.isVisibleInDetail,
                        isRequired: x.isRequired,
                        dataTypeName: x.dataTypeName,
                      });
                    }
                  });
                  this.fildValidation = new fieldsValidationClass(
                    this.incidentData,
                    this.incidentService
                  );
                  this.workbook = await this.createExcel();
                  this.loaderVisible = false;
                  this.disableDownlodeButton = false;
                },
                error: (err: any) => {
                  console.log(err);
                },
                complete: () => {},
              });
          },
        });
    } else {
      alert('work Flowm Element Not Found');
    }
  }

  //dropdown Filter
  handleFilter(value: string) {
    this.incidentTypeWithWorkFlowForFilters =
      this.incidentTypeWithWorkFlow.filter(
        (s) => s.typeName.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
  }

  public async createExcel(): Promise<Workbook> {
    return new Promise((resolve, rejects) => {
      let workflowElementInfoIndex: number = 0;
      let workflowElementInfoIndexForType = 0;
      const header = this.excelSheetColumnNames;

      //Create a workbook with a worksheet
      let workbook = new Workbook();
      let worksheetName = removeSymbolsAndSpaces(this.selectedWorkFlowName);
      let worksheet = workbook.addWorksheet(`${worksheetName}`);
      let worksheetTemp = workbook.addWorksheet('TempData');

      this.workflowElementInfoFinal = this.fildValidation.getFinalArray(
        this.workflowElementInfo
      );
      this.workflowElementInfoFinal.forEach((x: WorkflowElementInfo) => {
        this.excelSheetColumnNames.push(x.propertyDisplayText);
      });
      console.log('info Final');
      console.log(this.workflowElementInfoFinal);
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
      this.workflowElementInfoFinal.forEach((x: WorkflowElementInfo) => {
        workflowElementInfoIndex++;
        if (x.isRequired == true) {
          this.mandatoryColumnExcel.push(
            returnExcelCoulmnForNumericValue(workflowElementInfoIndex)
          );
        }
      });
      console.log(this.workflowElementInfo);

      // var columns = this.mandatoryColumnExcel;
      var mandatoryColumns = this.mandatoryColumnExcel;

      mandatoryColumns.forEach((col) => {
        let cell = worksheet.getCell(col + '1');
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'ffc7ce' },
        };
        cell.font = { bold: true, color: { argb: '9c0006' } };
      });
      //full sheet style
      worksheet.columns.forEach((column) => {
        column.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
        column.width = 20;
      });
      this.fildValidation
        .fieldsValidationFunction(
          this.workflowElementInfoFinal,
          worksheet,
          worksheetTemp
        )
        .then((res: any) => {
          worksheet = res;
          console.log('worksheet->', worksheet);
          resolve(workbook);
        });
    });
  }

  //Excel sheet download
  exportExcel() {
    //Generate & Save Excel File
    this.workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      fs.saveAs(
        blob,
        `${this.selectedWorkFlowName}_workflow_Incident_Upload_sheet` + '.xlsx'
      );
    });
  }

  // endofCreateExelSheet
  handleNextButton(value: any) {
    this.newItemEvent.emit(value);
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
}
