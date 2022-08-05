import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { StepperComponent } from '@progress/kendo-angular-layout';
import { TreeViewModule } from '@progress/kendo-angular-treeview';

@Component({
  selector: 'app-wizard',
  templateUrl: './wizard.component.html',
  styleUrls: ['./wizard.component.css'],
  encapsulation: ViewEncapsulation.None,
  //styleUrls: ["./app.styles.css"]
})
export class WizardComponent implements OnInit {

  ngOnInit(): void {
    this.nextbtnDisabled = false
  }

  @ViewChild("stepper", { static: true })
  public stepper!: StepperComponent;

  public currentStep = 0;
  private sumbitted = false;
  public nextbtnDisabled = false

  private isStepValid = (index: number): boolean => {
    return this.getGroupAt(index).valid || this.currentGroup.untouched;
  };

  private shouldValidate = (index: number): boolean => {
    return this.getGroupAt(index).touched && this.currentStep >= index;
  };

  changeNextButtonBehavior(val:any){
      this.nextbtnDisabled = val;
  }

  public steps = [
    {
      class:"step1",
      label: "API Setup",
      isValid: this.isStepValid,
      validate: this.shouldValidate,
      iconClass:"k-icon k-i-file-bac"
    },
    {
      class:"step2",
      label: "File Upload",
      isValid: this.isStepValid,
      iconClass:"k-icon k-i-report-header-section"
    },
    {
      label: "Review",
      isValid: this.isStepValid,
      iconClass:"k-icon k-i-file-txt"
    },
    {
      label: "Finish",
      isValid: this.isStepValid,
      iconClass:"k-icon k-i-file-txt"
    },
  ];

  public form = new FormGroup({
    staffDetails: new FormGroup({
      authToken: new FormControl("", Validators.required),
      subscriptionKey: new FormControl("", [Validators.required])
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
    console.log(this.currentGroup.value.authToken)
    if (this.currentStep === 0){
      if(this.currentGroup.valid) {
      this.currentStep += 1;
      return;
      }else{
        this.currentGroup.markAllAsTouched();
        this.stepper.validateSteps()
      }
    }
    else{
      this.currentStep += 1;
      return
    }
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
