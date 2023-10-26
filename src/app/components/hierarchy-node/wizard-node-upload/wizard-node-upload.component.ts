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
import { environment } from 'src/environments/environment';
import { ModalResponseMessageComponent } from '../../blocks/modal-response-message/modal-response-message.component';
import { AuthenticationService } from 'src/app/services/authentication.service';

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

  @ViewChild('errorModal', { static: false })
  errorModal!: ModalResponseMessageComponent;

  @Output() closeModal = new EventEmitter<boolean>();

  public disableStep3 = true;
  public disableStep4 = true;
  errorResponseBody = '';
  errorResponseTitle = '';
  IsError = false;

  hasApiErrors = false;

  InvalidKeysErrorMessage!: string;
  orgHierarchyId: string = '';

  constructor(
    private authService: AuthenticationService,
    private hierarchyService: HierarchyService
  ) {}
  ngOnDestroy(): void {}

  public loaderVisible = false;
  public currentStep = 0;
  public nextbtnDisabled = false;

  changeNextButtonBehavior(val: any) {
    this.nextbtnDisabled = val;
  }

  SubmitBtnDisable(val: any) {
    this.hasApiErrors = val;
  }

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
      this.loaderVisible = true;
      this.dataListComp.sendDataToSubmit();
      this.loaderVisible = false;
      this.currentStep += 1;
      this.steps[this.currentStep].disabled = false;

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
}
