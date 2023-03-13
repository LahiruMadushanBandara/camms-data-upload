import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-incident-wizard',
  templateUrl: './incident-wizard.component.html',
  styleUrls: ['./incident-wizard.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class IncidentWizardComponent implements OnInit {
  @Output() closeModal = new EventEmitter<boolean>();
  public disableStep1 = true;
  public disableStep2 = true;
  public disableStep3 = true;
  public disableStep4 = true;

  showApiDetailsError = false;
  InvalidKeysErrorMessage!: string;

  constructor() {}

  ngOnInit(): void {}
  public loaderVisible = false;
  public currentStep = 0;
  public nextbtnDisabled = false;

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
      subscriptionKey: new FormControl('', [Validators.required]),
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
}
