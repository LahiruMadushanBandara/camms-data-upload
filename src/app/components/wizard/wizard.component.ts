import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { StepperComponent } from '@progress/kendo-angular-layout';

@Component({
  selector: 'app-wizard',
  templateUrl: './wizard.component.html',
  styleUrls: ['./wizard.component.css'],
  encapsulation: ViewEncapsulation.None,
  //styleUrls: ["./app.styles.css"]
})
export class WizardComponent {
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
      label: "Account Details",
      isValid: this.isStepValid,
      validate: this.shouldValidate,
    },
    {
      label: "Personal Details",
      isValid: this.isStepValid,
      validate: this.shouldValidate,
    },
    {
      label: "Payment Details",
      isValid: this.isStepValid,
      validate: this.shouldValidate,
    },
  ];

  public form = new FormGroup({
    staffDetails: new FormGroup({
      userName: new FormControl("", Validators.required),
      email: new FormControl("", [Validators.required, Validators.email]),
      password: new FormControl("", Validators.required),
      avatar: new FormControl(null),
    }),
    hierarchyDetails: new FormGroup({
      fullName: new FormControl("", [Validators.required]),
      country: new FormControl("", [Validators.required]),
      gender: new FormControl(null, [Validators.required]),
      about: new FormControl(""),
    }),
    homeDetails: new FormGroup({
      paymentType: new FormControl(null, Validators.required),
      cardNumber: new FormControl("", Validators.required),
      cvc: new FormControl("", [
        Validators.required,
        Validators.maxLength(3),
        Validators.minLength(3),
      ]),
      expirationDate: new FormControl("", Validators.required),
      cardHolder: new FormControl("", Validators.required),
    }),
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
