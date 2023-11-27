import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { StaffBulk } from 'src/app/models/StaffBulk.model';
import { ApiAuth } from 'src/app/models/apiauth.model';
import { AuditLogSharedService } from 'src/app/services/audit-log-shared.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ExcelService } from 'src/app/services/excel.service';
import { SharedService } from 'src/app/services/shared.service';
import { StaffService } from 'src/app/services/staff.service';

@Component({
  selector: 'app-data-list',
  templateUrl: './data-list.component.html',
  styleUrls: ['./data-list.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class DataListComponent implements OnInit, OnDestroy {
  @Output() newItemEvent = new EventEmitter<Boolean>();
  NextButtonDisabled!: Boolean;
  @Output() hasValidateErrors = new EventEmitter<boolean>();
  @Output() showNextBtnLoader = new EventEmitter<Boolean>();
  @Output() loaderAtSubmitEvent = new EventEmitter<boolean>();
  @Output() hasApiErrors = new EventEmitter<boolean>();
  @Output() moveToFinalStep = new EventEmitter<any>();
  @Input()
  public dataReview!: FormGroup;

  showErrorMsg = false;
  APIErrorList: any[] = [];
  staffDataList!: StaffBulk[];
  staffDataListToSubmit!: StaffBulk[];
  errorDataList!: any[];
  subscription!: Subscription;
  dataToSubmitSubscription!: Subscription;
  errorRowCount = 0;
  errorMessage: string[] = [];

  responseTitle!: string;
  responseMessage!: string;
  showSuccessMsg = false;
  confirmationDialogMsg = '';
  public gridData: StaffBulk[] = this.staffDataList;

  constructor(
    private data: SharedService,
    private excelService: ExcelService,
    private authService: AuthenticationService,
    private auditLogShared: AuditLogSharedService,
    private staffService: StaffService
  ) {}

  changeNextButtonBehavior(value: Boolean) {
    this.newItemEvent.emit(value);
  }

  ngOnInit(): void {
    this.subscription = this.data.currentList.subscribe(
      (d) => (this.staffDataList = d)
    );
    this.subscription = this.data.currentErrorList.subscribe(
      (d) => (this.errorDataList = d)
    );

    this.gridData = this.staffDataList;

    this.errorRowCount = this.errorDataList
      .map((v) => v.RowNo)
      .filter((v, i, vIds) => vIds.indexOf(v) === i)
      .filter(function (el) {
        return el != '';
      }).length;
    if (this.errorDataList.length > 0) {
      
      this.changeNextButtonBehavior(true);
      this.hasValidateErrors.emit(true);
      this.createErrorMessage(this.errorDataList);
    } else {
      this.data.sendDataListToSubmit(this.staffDataList);
      this.dataToSubmitSubscription =
        this.data.currentStaffListToSubmit.subscribe(
          (d) => (this.staffDataListToSubmit = d)
        );      
    }
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    if (this.errorDataList.length <= 0){
      this.dataToSubmitSubscription.unsubscribe();
    }
    this.hasValidateErrors.emit(false);
  }

  exportErrors() {
    this.excelService.exportAsExcelFile(this.errorDataList, 'error-report');
  }

  uploadStaffData(formData: any) {
    let data = new ApiAuth();

    data.StaffSubscriptionKey =
      this.authService.authenticationDetails.SubscriptionKey;
    data.AuthToken = localStorage.getItem('auth-token')!;
    this.staffService
      .AddFlexStaffBulk(
        data,
        this.staffDataListToSubmit,
        true,
        this.staffDataListToSubmit.length,
        this.staffDataListToSubmit.length,
        1,
        'true'
      )
      .subscribe({
        next: (res: any) => {
          this.responseTitle = res.Status;
          this.loaderAtSubmitEvent.emit(false);
          if (res.code === 200) {
            this.responseMessage = 'Success';
            this.showSuccessMsg = true;
            this.confirmationDialogMsg = 'Data Uploaded Successfully!';
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
        },

        error: (error: HttpErrorResponse) => {
          this.showErrorMsg = true;
          this.responseMessage = error.message;
          this.responseTitle = '';
          this.hasApiErrors.emit(true);
        },
        complete: () => {
          this.auditLogShared.triggerAuditLogUploadEvent('staff');
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
