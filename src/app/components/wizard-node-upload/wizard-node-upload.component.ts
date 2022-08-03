import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { StepperComponent } from '@progress/kendo-angular-layout';

@Component({
  selector: 'app-wizard-node-upload',
  templateUrl: './wizard-node-upload.component.html',
  styleUrls: ['./wizard-node-upload.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class WizardNodeUploadComponent {
  @ViewChild("stepper", { static: true })
  public stepper!: StepperComponent;

  public currentStep = 0;

  private sumbitted = false;

  private isStepValid = (index: number): boolean => {
    return this.getGroupAt(index).valid;
  };

  private shouldValidate = (): boolean => {
    return this.sumbitted === true;
  };

  public steps = [
    {
      label: "API Setup",
      isValid: this.isStepValid,
      validate: this.shouldValidate,
    },
    {
      label: "File Upload",
      isValid: this.isStepValid,
      validate: this.shouldValidate,
    },
    {
      label: "Review",
      isValid: this.isStepValid,
      validate: this.shouldValidate,
    },
  ];

  public form = new FormGroup({
    staffDetails: new FormGroup({
      authToken: new FormControl("", Validators.required),
      subscriptionKey: new FormControl("", [Validators.required]),
      hierarchyId: new FormControl("", Validators.required)
    }),
    staffUploadData: new FormGroup({
      file: new FormControl("", [Validators.required])
    }),
    dataReview: new FormGroup({
      recordList: new FormControl(null, Validators.required),
    })
  });

  public get currentGroup(): FormGroup {
    return this.getGroupAt(this.currentStep);
  }

  public next(): void {
    this.currentStep += 1;
  }

  public prev(): void {
    this.currentStep -= 1;
  }

  public submit(): void {
    this.sumbitted = true;

    if (!this.form.valid) {
      this.form.markAllAsTouched();
      this.stepper.validateSteps();
    }

    console.log("Submitted data", this.form.value);
  }

  private getGroupAt(index: number): FormGroup {
    const groups = Object.keys(this.form.controls).map((groupName) =>
      this.form.get(groupName)
    ) as FormGroup[];

    return groups[index];
  }
}
