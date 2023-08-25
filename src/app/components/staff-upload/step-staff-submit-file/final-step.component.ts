import { HttpErrorResponse } from '@angular/common/http';
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
import { ApiAuth } from 'src/app/models/apiauth.model';
import { StaffBulk } from 'src/app/models/StaffBulk.model';
import { SharedService } from 'src/app/services/shared.service';
import { StaffService } from 'src/app/services/staff.service';
import { ModalResponseMessageComponent } from '../../blocks/modal-response-message/modal-response-message.component';
import { environment } from 'src/environments/environment';
import { AuditLogSharedService } from 'src/app/services/audit-log-shared.service';

@Component({
  selector: 'app-final-step',
  templateUrl: './final-step.component.html',
  styleUrls: ['./final-step.component.css'],
})
export class FinalStepComponent implements OnInit {
  staffDataListToSubmit!: StaffBulk[];
  dataToSubmitSubscription!: Subscription;

  showErrorMsg = false;
  showSuccessMsg = false;
  responseMessage!: string;
  responseTitle!: string;
  APIErrorList: any[] = [];
  confirmationDialogMsg = '';

  @Input()
  public dataSubmit!: FormGroup;

  @Output() loaderAtSubmitEvent = new EventEmitter<boolean>();
  @Output() SubmittedSuccess = new EventEmitter<boolean>();
  @Output() hasApiErrors = new EventEmitter<boolean>();
  @ViewChild('modal', { static: false })
  modal!: ModalResponseMessageComponent;

  constructor(
    private auditLogShared: AuditLogSharedService,
    private data: SharedService,
    private staffService: StaffService
  ) {}

  ngOnInit(): void {
    this.dataToSubmitSubscription =
      this.data.currentStaffListToSubmit.subscribe(
        (d) => (this.staffDataListToSubmit = d)
      );
  }

  ngOnDestroy() {
    this.dataToSubmitSubscription.unsubscribe();
  }

  closeWindow(status: boolean) {
    this.SubmittedSuccess.emit(status);
  }

  uploadStaffData(formData: any) {
    let data = new ApiAuth();

    data.StaffSubscriptionKey = environment.supscriptionKey;
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
            this.modal.open();
          } else if (res.errordata.length > 0) {
            res.errordata.forEach((e: any) => {
              let a = {
                data: e.id,
                message: e.message,
              };
              this.APIErrorList.push(a);
            });
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
        },
      });
  }
}
