import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { StepperComponent } from '@progress/kendo-angular-layout';
import { TreeViewModule } from '@progress/kendo-angular-treeview';
import { StaffService } from 'src/app/services/staff.service';
import { DataListComponent } from '../data-list/data-list.component';
import { FinalStepComponent } from '../final-step/final-step.component';

@Component({
  selector: 'app-wizard',
  templateUrl: './wizard.component.html',
  styleUrls: ['./wizard.component.css'],
  encapsulation: ViewEncapsulation.None
  //styleUrls: ["./app.styles.css"]
})
export class WizardComponent implements OnInit,OnDestroy {

  @ViewChild("stepper", { static: true })
  public stepper!: StepperComponent;

  @ViewChild(DataListComponent)
  dataListComp!: DataListComponent;

  @ViewChild(FinalStepComponent)
  finalStepComp!: FinalStepComponent;

  public disableStep2 = true;
  public disableStep3 = true;
  private disableStep4 = true;
  
  errorMessage!:string

  ngOnInit(): void {
    // var x = document.getElementById("step2");
    // (<HTMLElement>x).setAttribute("disabled", "disabled")
    
  }

  constructor(private staffService: StaffService) { }
  ngOnDestroy(): void {
  }

  
  public loaderVisible = false;
  public currentStep = 0;
  public nextbtnDisabled = false

  step2Disable(val:boolean){
    alert(val)
    this.disableStep2 = val
  }

  private isStepValid = (index: number): boolean => {
    return this.getGroupAt(index).valid || this.currentGroup.untouched;
  };

  private shouldValidate = (index: number): boolean => {
    return this.getGroupAt(index).touched && this.currentStep >= index;
  };

  changeNextButtonBehavior(val: any) {
    this.nextbtnDisabled = val;
  }

  public steps = [
    {
      class: "step1",
      label: "API Setup",
      iconClass: "myicon1",
      
      
    },
    {
      class: "step2",
      label: "File Upload",
      iconClass: "myicon1",
      disabled: false
    },
    {
      label: "Review",
      iconClass: "k-icon k-i-file-txt",
      disabled : false
    },
    {
      label: "Finish",
      iconClass: "k-icon k-i-file-txt",
      disabled : false
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
    }),
    dataSubmit: new FormGroup({
      recordList: new FormControl(),
    })
  });

  public get currentGroup(): FormGroup {
    return this.getGroupAt(this.currentStep);
  }

  showApiDetailsError = false;
  errorResponse!:string;
  public next(): void {
    this.disableStep2 = false
    this.loaderVisible = true;
    if (this.currentStep === 0) {
      if (this.currentGroup.valid) {
        
        this.staffService.GetUserList(this.currentGroup.value.subscriptionKey, this.currentGroup.value.authToken)
          .subscribe((res) => {
            this.showApiDetailsError = false;
            this.currentStep += 1;
            this.loaderVisible = false;
            this.disableStep2 = false
            return;
          },
            (error: HttpErrorResponse) => {
              this.showApiDetailsError = true;
              console.log(error.error.message)
              this.errorMessage =  error.error.message
              this.loaderVisible = false;
              this.currentStep += 1;
              this.disableStep2 = false
            });
            
      }
      else {
        this.currentGroup.markAllAsTouched();
        this.stepper.validateSteps()
        this.loaderVisible = false;
      }
    }
    else if(this.currentStep === 2){
      //console.log(this.form) 
      this.dataListComp.sendDataToSubmit()
      console.log(this.dataListComp.errorDataList)
      this.currentStep += 1;
      this.loaderVisible = false;
      return
    }
    else{
      this.currentStep += 1;
      console.log("else called - current step - "+ this.currentStep)
      this.loaderVisible = false;
      return
    }
  }

  public prev(): void {
    this.currentStep -= 1;
  }

  public submit(): void {
    // this.sumbitted = true;

    // if (!this.form.valid) {
    //   this.form.markAllAsTouched();
    //   this.stepper.validateSteps();
    // }
    // console.log("Submitted data", this.form.value);
    
    this.loaderVisible = true;
    this.finalStepComp.uploadStaffData(this.form.value.staffDetails);
  }

  changeLoaderBehavior(val:boolean){
    this.loaderVisible = val;
  }

  private getGroupAt(index: number): FormGroup {
    const groups = Object.keys(this.form.controls).map((groupName) =>
      this.form.get(groupName)
    ) as FormGroup[];

    return groups[index];
  }
}
