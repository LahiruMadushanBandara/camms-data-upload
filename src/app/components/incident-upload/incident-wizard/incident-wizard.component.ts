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
  public disableStep1 = true;
  public disableStep2 = true;
  public disableStep3 = true;
  public disableStep4 = true;

  showApiDetailsError = false;
  InvalidKeysErrorMessage!: string;

  ngOnInit(): void {}
  public loaderVisible = false;
  public currentStep = 0;
  public nextbtnDisabled = false;

  hasApiErrors = false;

  constructor() {}

  changeNextButtonBehavior(val: any) {
    this.nextbtnDisabled = val;
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
    console.log('big Implementation');
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
