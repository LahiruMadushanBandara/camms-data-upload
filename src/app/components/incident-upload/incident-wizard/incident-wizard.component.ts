import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { StepperComponent } from '@progress/kendo-angular-layout';
import { HierarchyService } from 'src/app/services/hierarchy.service';
import { IncidentService } from 'src/app/services/incident.service';
import { HierarchySubmitFileComponent } from '../../hierarchy-node/step-hierarchy-submit-file/hierarchy-submit-file';
import { HierarchyValidateDataComponent } from '../../hierarchy-node/step-hierarchy-validate-data/hierarchy-validate-data';

@Component({
  selector: 'app-incident-wizard',
  templateUrl: './incident-wizard.component.html',
  styleUrls: ['./incident-wizard.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class IncidentWizardComponent implements OnInit {
  @ViewChild('stepper', { static: true })
  public stepper!: StepperComponent;

  @ViewChild(HierarchyValidateDataComponent)
  dataListComp!: HierarchyValidateDataComponent;

  @ViewChild(HierarchySubmitFileComponent)
  finalStepComp!: HierarchySubmitFileComponent;

  @Output() closeModal = new EventEmitter<boolean>();
  // public disableStep1 = true;
  // public disableStep2 = true;
  public disableStep3 = true;
  public disableStep4 = true;

  showApiDetailsError = false;
  InvalidKeysErrorMessage!: string;

  ngOnInit(): void {}
  public loaderVisible = false;
  public currentStep = 0;
  public nextbtnDisabled = false;

  hasApiErrors = false;

  constructor(private incidentService: IncidentService) {}

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
      disabled: this.disableStep4,
    },
  ];

  public form = new FormGroup({
    incidentDetails: new FormGroup({
      authToken: new FormControl('', Validators.required),
      incidentSubscriptionKey: new FormControl('', [Validators.required]),
    }),
    dataSubmit: new FormGroup({
      recordList: new FormControl(),
    }),
  });

  public get currentGroup(): FormGroup {
    return this.getGroupAt(this.currentStep);
  }

  private getGroupAt(index: number): FormGroup {
    const groups = Object.keys(this.form.controls).map((groupName) =>
      this.form.get(groupName)
    ) as FormGroup[];

    return groups[index];
  }

  public focusStep() {
    setTimeout(() => {
      let element = document.querySelector(
        '.k-step-current .k-step-link'
      ) as HTMLElement;
      element.focus();
    });
  }

  public next(): void {
    this.loaderVisible = true;
    if (this.currentStep === 0) {
      this.currentStep += 1;
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
          'incident-subscription-key',
          JSON.stringify(this.currentGroup.value.incidentSubscriptionKey)
        );
        localStorage.setItem(
          'auth-token',
          JSON.stringify(this.currentGroup.value.authToken)
        );
        this.incidentService
          .getIncidentList(
            this.currentGroup.value.incidentSubscriptionKey,
            this.currentGroup.value.authToken
          )
          .subscribe(
            (res: any) => {
              this.showApiDetailsError = false;
              this.currentStep += 1;
              this.steps[this.currentStep].disabled = false;
              this.loaderVisible = false;
              console.log('Api res');
              return;
            },
            (error: HttpErrorResponse) => {
              this.showApiDetailsError = true;
              this.InvalidKeysErrorMessage = error.error.message ?? error.error;
              this.loaderVisible = false;
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
}
