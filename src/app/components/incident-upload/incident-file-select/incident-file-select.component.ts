import {
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
import { Workbook } from 'exceljs';
import { WorkFlowFields } from 'src/app/models/WorkFlowFields.model';
import { IncidentService } from 'src/app/services/incident.service';
import { WorkflowElementInfo } from 'src/app/models/WorkflowElementInfo.model';
import { HttpErrorResponse } from '@angular/common/http';
import { ModalResponseMessageComponent } from '../../blocks/modal-response-message/modal-response-message.component';
import { WorkflowElementDataTypeInfo } from 'src/app/models/WorkFlowElementDataTypeInfo.model';
import { fieldsValidationClass } from 'src/app/components/incident-upload/incident-file-select/utils/fieldsValidatingClass/fieldsValidationClass';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-incident-file-select',
  templateUrl: './incident-file-select.component.html',
  styleUrls: ['./incident-file-select.component.css'],
})
export class IncidentFileSelectComponent implements OnInit, DoCheck, OnDestroy {
  @ViewChild('modalMessage', { static: false })

  //subscribe
  private getWorkFlowListPageSizeSub!: Subscription;
  private getWorkFlowListSub!: Subscription;

  // private getWorkFlowSub: Observable<[]> = [];
  modalMessage!: ModalResponseMessageComponent;
  public disableDownlodeButton = true;
  public loaderVisible = false;

  public selectedWorkFlowId?: number;

  public selectedWorkFlowName?: string;

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
  public workflowElementInfoFinal: Array<WorkflowElementInfo> = [];
  public workflowElementDataTypeInfo: Array<WorkflowElementDataTypeInfo> = [];

  incidentSubscriptionKey: string = '';
  authToken: string = '';

  showApiDetailsError = false;
  apiErrorMsg: string = '';

  constructor(private incidentService: IncidentService) {}
  ngOnDestroy(): void {}
  ngDoCheck(): void {
    //for get workflowElementId using WorkflowId
    if (
      this.selectedWorkFlowId &&
      this.selectedWorkFlowId !== this.controlNgDoCheckForWorkFlowId
    ) {
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
          console.log(error);
          this.apiErrorMsg = 'Error. Please check authentication keys provided';
          this.showApiDetailsError = true;
          this.modalMessage.open();
        },

        complete: () => {
          // this.getWorkFlowListPageSizeSub.unsubscribe();
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
                this.loaderForDropDown = false;
                this.disableDropDown = false;

                console.log('workFlowList');
                console.log(this.workFlowList);
                //dropdownFilter
                this.workFlowListForFilter = this.workFlowList.slice();
              },
            });
        },
      });
    console.log(typeof this.incidentService);
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

  //Excel sheet download
  exportExcel() {
    let workflowElementInfoIndex: number = 0;
    let workflowElementInfoIndexForType = 0;
    const header = this.excelSheetColumnNames;

    //Create a workbook with a worksheet
    let workbook = new Workbook();

    let worksheet = workbook.addWorksheet('IncidentData');
    let worksheetTemp = workbook.addWorksheet('TempData');
    const fildValidation = new fieldsValidationClass();
    this.workflowElementInfoFinal = fildValidation.getFinalArray(
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
          this.returnExcelCoulmnForNumericValue(workflowElementInfoIndex)
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

    worksheet = fildValidation.fieldsValidationFunction(
      this.workflowElementInfoFinal,
      worksheet,
      worksheetTemp
    );

    //Generate & Save Excel File
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      fs.saveAs(
        blob,
        `${this.selectedWorkFlowName}_workflow_Incident_Upload_sheet` + '.xlsx'
      );
    });
  }

  //This function is use to set mandortory fields , if we give numeric value it retuns column name ex - (1- 'A' , 27 - 'AA' , 28 - 'AB')
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

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
}
