import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ModalResponseMessageComponent } from 'src/app/components/blocks/modal-response-message/modal-response-message.component';
import { WorkFlowFields } from 'src/app/models/WorkFlowFields.model';
import { WorkflowElementInfo } from 'src/app/models/WorkflowElementInfo.model';
import { IncidentService } from 'src/app/services/incident.service';
@Injectable({
  providedIn: 'root',
})
export class workFlowClass implements OnInit {
  private showApiDetailsError = false;
  private apiErrorMsg: string = '';
  private pageSize = 1;
  private incidentSubscriptionKey: string = '';
  private authToken: string = '';
  private pageSizeForWorkflowElementInfo: number = 1;
  public workflowElementId: number = 0;
  public loaderForDropDown = true;
  public disableDropDown = true;
  public loaderVisible = true;
  public disableDownlodeButton = true;
  public workFlowList: Array<WorkFlowFields> = [];
  public workflowElementInfo: Array<WorkflowElementInfo> = [];

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

  ngOnInit(): void {
    console.log('on init');
    this.authToken = localStorage.getItem('auth-token')!;
    this.incidentSubscriptionKey = localStorage.getItem(
      'incident-subscription-key'
    )!;
    // this.GetWorkFlowList();
    console.log(this.authToken);
  }
  public showData() {
    console.log('test class');
  }

  //GetWork flow list
  public GetWorkFlowList(
    workFlowListForFilter: Array<WorkFlowFields>,
    loaderForDropDown: boolean,
    disableDropDown: boolean
  ) {
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
                loaderForDropDown = false;
                disableDropDown = false;
                //dropdownFilter
                workFlowListForFilter = this.workFlowList.slice();
                return workFlowListForFilter;
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
}
