import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { StepperComponent } from '@progress/kendo-angular-layout';
import { StaffService } from 'src/app/services/staff.service';
import { DataListComponent } from '../step-validate-data/data-list.component';
import { FinalStepComponent } from '../step-submit-data/final-step.component';

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

  @Output() closeModal = new EventEmitter<boolean>();

  public disableStep2 = true;
  public disableStep3 = true;
  public disableStep4 = true;
  hasApiErrors = false;
  
  
  InvalidKeysErrorMessage!:string

  ngOnInit(): void {
  }

  constructor(private staffService: StaffService) { }
  ngOnDestroy(): void {
  }

  public loaderVisible = false;
  public nextBtnLoaderVisible = false;
  public currentStep = 0;
  public nextbtnDisabled = false

  step2Disable(val:boolean){
    
    this.disableStep2 = val
  }

  changeNextButtonBehavior(val: any) {
    this.nextbtnDisabled = val;
  }

  public steps = [
    {
      class: "step1",
      label: "API Setup",
      iconClass: "myicon1"
    },
    {
      class: "step2",
      label: "File Upload",
      iconClass: "myicon2",
      disabled: this.disableStep2
    },
    {
      class:"step3",
      label: "Validate",
      iconClass: "myicon3",
      disabled : this.disableStep3
    },
    {
      class:"step4",
      label: "Submit",
      iconClass: "myicon4",
      disabled : this.disableStep4
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
        console.log(this.currentGroup.value.subscriptionKey)
            localStorage.setItem('subscriptionKey', JSON.stringify(this.currentGroup.value.subscriptionKey))
            localStorage.setItem('auth-token', JSON.stringify(this.currentGroup.value.authToken))
        
        this.staffService.GetUserList(this.currentGroup.value.subscriptionKey, this.currentGroup.value.authToken)
          .subscribe((res) => {
            this.showApiDetailsError = false;
            this.currentStep += 1;
            this.steps[this.currentStep].disabled = false;
            this.loaderVisible = false;
            this.disableStep2 = false
            return;
          },
            (error: HttpErrorResponse) => {
              this.showApiDetailsError = true;
              this.InvalidKeysErrorMessage = (error.error.message)?? error.error  
              this.loaderVisible = false;
              this.currentStep += 1;
              this.steps[this.currentStep].disabled = false;
            });
            
      }
      else {
        this.currentGroup.markAllAsTouched();
        this.stepper.validateSteps()
        this.loaderVisible = false;
      }
    }
    else if(this.currentStep === 2){
      this.dataListComp.sendDataToSubmit()
      console.log(this.dataListComp.errorDataList)
      this.currentStep += 1;
      this.steps[this.currentStep].disabled = false;
      this.loaderVisible = false;
      return
    }
    else{
      this.currentStep += 1;
      this.steps[this.currentStep].disabled = false;
      this.loaderVisible = false;
      return
    }
    this.focusStep();
  }

  public prev(): void {
    this.currentStep -= 1;
    this.focusStep();
  }

  public submit(): void {
    
    this.loaderVisible = true;
    this.finalStepComp.uploadStaffData(this.form.value.staffDetails);
  }

  changeLoaderBehavior(val:boolean){
    this.loaderVisible = val;
  }
  changeNextBtnLoaderBehavior(val:any){
    this.nextBtnLoaderVisible = val;
  }

  closeWindowAterSubmitSucess(val:boolean){
      if(val){
        this.closeModal.emit(true)
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

  SubmitBtnDisable(val:any){
    this.hasApiErrors = val
}
}
