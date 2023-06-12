import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ModalResponseMessageComponent } from 'src/app/components/blocks/modal-response-message/modal-response-message.component';
import { WorkFlowFields } from 'src/app/models/WorkFlowFields.model';
import { WorkflowElementInfo } from 'src/app/models/WorkflowElementInfo.model';
import { IncidentService } from 'src/app/services/incident.service';

export class workFlowClass {
  private showApiDetailsError = false;
  private apiErrorMsg: string = '';
  private pageSize = 1;
  private incidentSubscriptionKey: string = '';
  private authToken: string = '';
  private pageSizeForWorkflowElementInfo: number = 1;
  public workflowElementId: number = 0;

  public loaderVisible = true;
  public disableDownlodeButton = true;
  private _workFlowList: Array<WorkFlowFields> = [];
  public get workFlowList(): Array<WorkFlowFields> {
    return this._workFlowList;
  }

  private _workflowElementInfo: Array<WorkflowElementInfo> = [];
  public get workflowElementInfo(): Array<WorkflowElementInfo> {
    return this._workflowElementInfo;
  }
  public set workflowElementInfo(value: Array<WorkflowElementInfo>) {
    this._workflowElementInfo = value;
  }
  private _workFlowListForFilter: Array<WorkFlowFields> = [];
  private _loaderForDropDown: boolean = true;
  private _disableDropDown: boolean = true;

  public get disableDropDown(): boolean {
    return this._disableDropDown;
  }

  public get workFlowListForFilter(): Array<WorkFlowFields> {
    return this._workFlowListForFilter;
  }
  public get loaderForDropDown(): boolean {
    return this._loaderForDropDown;
  }
  // subcription
  private getWorkFlowListPageSizeSub!: Subscription;
  private getWorkFlowListSub!: Subscription;

  private modalMessage!: ModalResponseMessageComponent;

  constructor(private incidentService: IncidentService) {
    this.authToken = localStorage.getItem('auth-token')!;
    this.incidentSubscriptionKey = localStorage.getItem(
      'incident-subscription-key'
    )!;
  }

  public showData() {
    console.log('test class');
  }

  //GetWork flow list
  public async GetWorkFlowList() {
    console.log('getWork Flow call');
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
                // this.loaderForDropDown = false;
                // this.disableDropDown = false;
                // //dropdownFilter
                // this.workFlowListForFilter = this.workFlowList.slice();
                console.log('complete');
              },
            });
        },
      });
  }

  //to get object(IncidentObjct) useing selectedWorkFlowId
  public GetWorkFlowElements(workflowId: number) {
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
  private GetWorkflowElementDetails(
    workflowElementId: number,
    pageSize: number
  ) {
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
                    this._workflowElementInfo.push({
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
}
