import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { StepperComponent } from '@progress/kendo-angular-layout';
import { HierarchyService } from 'src/app/services/hierarchy.service';
import { HierarchySubmitFileComponent } from '../step-hierarchy-submit-file/hierarchy-submit-file';
import { HierarchyValidateDataComponent } from '../step-hierarchy-validate-data/hierarchy-validate-data';

@Component({
  selector: 'app-wizard-node-upload',
  templateUrl: './wizard-node-upload.component.html',
  styleUrls: ['./wizard-node-upload.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class WizardNodeUploadComponent {
  @ViewChild('stepper', { static: true })
  public stepper!: StepperComponent;

  @ViewChild(HierarchyValidateDataComponent)
  dataListComp!: HierarchyValidateDataComponent;

  @ViewChild(HierarchySubmitFileComponent)
  finalStepComp!: HierarchySubmitFileComponent;

  @Output() closeModal = new EventEmitter<boolean>();

  public disableStep1 = true;
  public disableStep2 = true;
  public disableStep3 = true;
  public disableStep4 = true;

  hasApiErrors = false;

  InvalidKeysErrorMessage!: string;

  ngOnInit(): void {}

  constructor(
    private hierarchyService: HierarchyService,
    private formBuilder: FormBuilder
  ) {}
  ngOnDestroy(): void {}

  public loaderVisible = false;
  public currentStep = 0;
  public nextbtnDisabled = false;

  step2Disable(val: boolean) {
    this.disableStep2 = val;
  }

  changeNextButtonBehavior(val: any) {
    this.nextbtnDisabled = val;
  }

  SubmitBtnDisable(val: any) {
    this.hasApiErrors = val;
  }

  public steps = [
    {
      class: 'step1',
      label: 'API Setup',
      iconClass: 'myicon1',
    },
    {
      class: 'step2',
      label: 'File Upload',
      iconClass: 'myicon2',
      disabled: this.disableStep2,
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
      disabled: this.disableStep4,
    },
  ];

  public form = new FormGroup({
    staffDetails: new FormGroup({
      authToken: new FormControl('', Validators.required),
      hierarchySubscriptionKey: new FormControl('', [Validators.required]),
      staffSubscriptionKey: new FormControl('', [Validators.required]),
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
    this.disableStep2 = false;
    this.loaderVisible = true;
    if (this.currentStep === 0) {
      if (this.currentGroup.valid) {
        localStorage.setItem(
          'hierarchy-subscription-key',
          JSON.stringify(this.currentGroup.value.hierarchySubscriptionKey)
        );
        localStorage.setItem(
          'staff-subscription-key',
          JSON.stringify(this.currentGroup.value.staffSubscriptionKey)
        );
        localStorage.setItem(
          'auth-token',
          JSON.stringify(this.currentGroup.value.authToken)
        );

        this.hierarchyService
          .GetHierarchyNodes(
            this.currentGroup.value.hierarchySubscriptionKey,
            this.currentGroup.value.authToken
          )
          .subscribe(
            (res: any) => {
              this.showApiDetailsError = false;
              this.currentStep += 1;
              this.steps[this.currentStep].disabled = false;
              this.loaderVisible = false;
              this.disableStep2 = false;
              return;
            },

            (error: HttpErrorResponse) => {
              this.showApiDetailsError = true;
              this.InvalidKeysErrorMessage = error.error.message ?? error.error;
              this.loaderVisible = false;
              this.currentStep += 1;
              this.steps[this.currentStep].disabled = false;
            }
          );
      } else {
        this.currentGroup.markAllAsTouched();
        this.stepper.validateSteps();
        this.loaderVisible = false;
      }
    } else if (this.currentStep === 2) {
      this.dataListComp.sendDataToSubmit();
      this.currentStep += 1;
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
    this.finalStepComp.uploadHierarchyData(this.form.value.staffDetails);
  }

  changeLoaderBehavior(val: boolean) {
    this.loaderVisible = val;
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
}
