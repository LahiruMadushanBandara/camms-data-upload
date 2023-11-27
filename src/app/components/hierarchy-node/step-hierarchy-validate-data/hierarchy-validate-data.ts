import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { HierarchyNode } from 'src/app/models/HierarchyNode.model';
import { ApiAuth } from 'src/app/models/apiauth.model';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ExcelService } from 'src/app/services/excel.service';
import { HierarchySharedService } from 'src/app/services/hierarchy-upload-shared.service';
import { HierarchyService } from 'src/app/services/hierarchy.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AuditLogSharedService } from 'src/app/services/audit-log-shared.service';

@Component({
  selector: 'app-hierarchy-validate-data',
  templateUrl: './hierarchy-validate-data.html',
  styleUrls: ['./hierarchy-validate-data.css'],
})
export class HierarchyValidateDataComponent implements OnInit {
  @Output() newItemEvent = new EventEmitter<Boolean>();
  @Output() nextButtonEventEmit = new EventEmitter<Boolean>();
  NextButtonDisabled!: Boolean;
  @Output() SubmittedSuccess = new EventEmitter<boolean>();
  @Output() hasValidateErrors = new EventEmitter<boolean>();
  @Output() hasApiErrors = new EventEmitter<boolean>();
  @Output() moveToFinalStep = new EventEmitter<any>();

  @Input()
  public dataReview!: FormGroup;

  @Input() orgHierarchyId: string = '';

  @Output() loaderAtValidateEvent = new EventEmitter<boolean>();

  hierarchyNodeList!: HierarchyNode[];
  hierarchyNodeListToSubmit!: HierarchyNode[];
  errorDataList!: any[];
  subscription!: Subscription;
  dataToSubmitSubscription!: Subscription;
  errorRowCount = 0;
  errorMessage: string[] = [];

  HierarchySubscriptionKey: string = '';
  AuthToken: string = '';
  responseTitle!: string;
  responseMessage!: string;
  showSuccessMsg = false;
  confirmationDialogMsg = '';
  APIErrorList: any[] = [];
  showErrorMsg = false;

  public gridData: HierarchyNode[] = this.hierarchyNodeList;

  constructor(
    private hierarchySharedService: HierarchySharedService,
    private excelService: ExcelService,
    private authService: AuthenticationService,
    private hierarchyService: HierarchyService,
    private auditLogShared: AuditLogSharedService
  ) {}

  ngOnInit(): void {
    this.AuthToken = localStorage.getItem('auth-token')!;
    this.HierarchySubscriptionKey =
      this.authService.authenticationDetails.SubscriptionKey;

    this.subscription =
      this.hierarchySharedService.currentHierarchyList.subscribe(
        (d) => (this.hierarchyNodeList = d)
      );

    this.subscription =
      this.hierarchySharedService.currentHierarchyErrorList.subscribe(
        (d) => (this.errorDataList = d)
      );

    this.hierarchySharedService.sendDataListToSubmit(this.hierarchyNodeList);
    this.dataToSubmitSubscription =
      this.hierarchySharedService.currentHierarchyListToSubmit.subscribe(
        (d) => (this.hierarchyNodeListToSubmit = d)
      );

    this.gridData = this.hierarchyNodeList;
    if (this.errorDataList.length > 0) {
      this.hasValidateErrors.emit(true);
      this.createErrorMessage(this.errorDataList);
    } else {
      this.hierarchySharedService.sendDataListToSubmit(this.hierarchyNodeList);
      this.dataToSubmitSubscription =
        this.hierarchySharedService.currentHierarchyListToSubmit.subscribe(
          (d) => (this.hierarchyNodeListToSubmit = d)
        );
    }

    this.errorRowCount = this.errorDataList
      .map((v) => v.RowNo)
      .filter((v, i, vIds) => vIds.indexOf(v) === i)
      .filter(function (el) {
        return el != '';
      }).length;
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    if (this.errorDataList.length < 0) {
    this.dataToSubmitSubscription.unsubscribe();
    }
    this.hasValidateErrors.emit(false);
  }
  sendDataToSubmit(): void {
    this.hierarchySharedService.sendDataListToSubmit(this.hierarchyNodeList);
  }
  exportErrors() {
    this.excelService.exportAsExcelFile(this.errorDataList, 'error-report');
  }
  changeNextButtonBehavior(value: Boolean) {
    this.newItemEvent.emit(value);
  }

  closeWindow(status: boolean) {
    this.SubmittedSuccess.emit(status);
  }

  //move submit to ,  submit step to validate step
  uploadHierarchyData(formData: any) {
    let data = new ApiAuth();

    data.AuthToken = this.AuthToken;
    data.HierarchySubscriptionKey = this.HierarchySubscriptionKey;

    let hierarchyNodeCount = this.hierarchyNodeListToSubmit.length;
    this.hierarchyService
      .CreateHierarchyNode(
        data,
        this.hierarchyNodeListToSubmit,
        true,
        hierarchyNodeCount,
        hierarchyNodeCount,
        1,
        this.orgHierarchyId
      )
      .subscribe({
        next: (res: any) => {
          {
            this.responseTitle = res.Status;
            this.loaderAtValidateEvent.emit(false);
            if (res.errordata.length === 0) {
              this.responseMessage = 'Success';
              this.showSuccessMsg = true;
            } else if (res.errordata.length > 0) {
              res.errordata.forEach((e: any) => {
                let a = {
                  data: e.id,
                  message: e.message,
                };
                this.APIErrorList.push(a);
              });
              this.moveToFinalStep.emit(this.APIErrorList);
            }
          }
        },
        error: (error: HttpErrorResponse) => {
          this.loaderAtValidateEvent.emit(false);
          this.hasApiErrors.emit(true);
        },
        complete: () => {
          this.auditLogShared.triggerAuditLogUploadEvent('hierarchy');
          this.moveToFinalStep.emit('Success');
        },
      });
  }

  private createErrorMessage(errorDataList: any[]) {
    errorDataList.forEach((err, indexOf) => {
      if (
        err.ErrorMessage != '' &&
        err.ExpectedType != '' &&
        err.Column == '' &&
        err.RowNo == '' &&
        err.ValueEntered == ''
      ) {
        this.errorMessage.push(
          `${err.ErrorMessage}, Expected Data  "${err.ExpectedType}"`
        );
      } else if (
        err.ErrorMessage != '' &&
        err.ExpectedType != '' &&
        err.Column != '' &&
        err.RowNo != '' &&
        (err.ValueEntered == '' || err.ValueEntered == null)
      ) {
        this.errorMessage.push(
          `${err.ErrorMessage} at row "${err.RowNo}" Column "${err.Column}" Expected Data Type "${err.ExpectedType}"`
        );
      } else {
        this.errorMessage.push(
          `${err.ErrorMessage} "${err.ValueEntered}" at row "${err.RowNo}" Column "${err.Column}" Expected Data Type "${err.ExpectedType}"`
        );
      }
    });
  }
}
