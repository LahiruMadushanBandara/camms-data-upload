import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { StepperComponent } from '@progress/kendo-angular-layout';
import { StaffService } from 'src/app/services/staff.service';
import { DataListComponent } from '../step-staff-validate-data/data-list.component';
import { FinalStepComponent } from '../step-staff-submit-file/final-step.component';
import { HierarchyService } from 'src/app/services/hierarchy.service';
import { ModalResponseMessageComponent } from '../../blocks/modal-response-message/modal-response-message.component';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-wizard',
  templateUrl: './wizard.component.html',
  styleUrls: ['./wizard.component.css'],
  encapsulation: ViewEncapsulation.None,
  //styleUrls: ["./app.styles.css"]
})
export class WizardComponent implements OnInit, OnDestroy {
  @ViewChild('stepper', { static: true })
  public stepper!: StepperComponent;

  @ViewChild(DataListComponent)
  dataListComp!: DataListComponent;

  @ViewChild(FinalStepComponent)
  finalStepComp!: FinalStepComponent;

  @ViewChild('errorModal', { static: false })
  errorModal!: ModalResponseMessageComponent;

  @Output() closeModal = new EventEmitter<boolean>();
  orgHierarchyId: string = '';

  public disableStep3 = true;
  public disableStep4 = true;
  hasApiErrors = false;
  InvalidKeysErrorMessage!: string;
  public loaderVisible = false;
  public nextBtnLoaderVisible = false;
  public currentStep = 0;
  public nextbtnDisabled = false;
  errorResponseBody = '';
  errorResponseTitle = '';
  IsError = false;

  public hasValidateErrors = false;
  public hasErrors = false;
  public uploadResultFromValidateStep = '';
  constructor(
    private authService: AuthenticationService,
    private hierarchyService: HierarchyService
  ) {}
  ngOnDestroy(): void {}

  ngOnInit(): void {
    var AuthToken = localStorage.getItem('auth-token')!;
    var HierarchySubscriptionKey =
      this.authService.authenticationDetails.SubscriptionKey;

    this.hierarchyService
      .GetHierarchy(HierarchySubscriptionKey, AuthToken)
      .subscribe(
        (d: any) => {
          let hierarchies: [] = d.data;
          let orgHierarchy: any = hierarchies.find(
            (obj: any) => obj.name === 'ORG Hierarchy'
          );
          this.orgHierarchyId = orgHierarchy.hierarchyId;
        },
        (error: HttpErrorResponse) => {
          this.IsError = true;
          this.errorResponseTitle = 'Error';
          this.errorResponseBody = 'Please check authentication keys provided';
          this.errorModal.open();
        }
      );
  }

  changeNextButtonBehavior(val: any) {
    this.nextbtnDisabled = val;
  }

  public steps = [
    {
      class: 'step2',
      label: 'File Upload',
      iconClass: 'myicon2',
      disabled: false,
    },
    {
      class: 'step3',
      label: 'Validate',
      iconClass: 'myicon3',
      disabled: this.disableStep3,
    },
    {
      class: 'step4',
      label: 'Submit',
      iconClass: 'myicon4',
      disabled: false,
    },
  ];

  public form = new FormGroup({
    staffUploadData: new FormGroup({
      file: new FormControl('', [Validators.required]),
    }),
    dataReview: new FormGroup({
      recordList: new FormControl(null, Validators.required),
    }),
    dataSubmit: new FormGroup({
      recordList: new FormControl(),
    }),
  });

  public get currentGroup(): FormGroup {
    return this.getGroupAt(this.currentStep);
  }

  showApiDetailsError = false;
  errorResponse!: string;
  public next(): void {
    this.loaderVisible = true;
    if (this.currentStep === 0) {
      this.currentStep += 1;
      this.steps[this.currentStep].disabled = false;
      this.loaderVisible = false;
      this.disableStep3 = false;
    } else if (this.currentStep === 1) {
      this.currentStep += 1;
      // this.dataListComp.sendDataToSubmit();
      this.steps[this.currentStep].disabled = false;
      this.loaderVisible = false;
      return;
    } else {
      this.currentStep += 1;
      this.steps[this.currentStep].disabled = false;
      this.loaderVisible = false;
      return;
    }
    this.focusStep();
  }

  public prev(): void {
    this.currentStep -= 1;
    this.focusStep();
  }

  public submit(): void {
    this.loaderVisible = true;
    this.dataListComp.uploadStaffData(this.form.value.staffDetails);
  }

  changeLoaderBehavior(val: boolean) {
    this.loaderVisible = val;
  }
  changeNextBtnLoaderBehavior(val: any) {
    this.nextBtnLoaderVisible = val;
  }

  closeWindow(val: boolean) {
    this.closeModal.emit(true);
  }

  closeWindowAterSubmitSucess(val: boolean) {
    if (val) {
      this.closeModal.emit(true);
    }
  }

  public focusStep() {
    setTimeout(() => {
      let element = document.querySelector(
        '.k-step-current .k-step-link'
      ) as HTMLElement;
      element.focus();
    });
  }

  private getGroupAt(index: number): FormGroup {
    const groups = Object.keys(this.form.controls).map((groupName) =>
      this.form.get(groupName)
    ) as FormGroup[];

    return groups[index];
  }

  public moveToFinalStep(val: any) {
    this.uploadResultFromValidateStep = val;
    console.log('moveToFinalStepStatus->', val);
    this.currentStep = 2;
  }
  public HasApiErrors(val: any) {
    this.hasApiErrors = val;
    this.hasErrors = val;
  }

  public HasValidateErrors(val: any) {
    this.hasValidateErrors = val;
    this.hasErrors = val;
  }
}
