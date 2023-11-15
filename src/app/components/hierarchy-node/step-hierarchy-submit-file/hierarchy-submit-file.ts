import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { HierarchyNode } from 'src/app/models/HierarchyNode.model';
import { HierarchySharedService } from 'src/app/services/hierarchy-upload-shared.service';
import { HierarchyService } from 'src/app/services/hierarchy.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ExcelService } from 'src/app/services/excel.service';

@Component({
  selector: 'app-hierarchy-submit-file',
  templateUrl: './hierarchy-submit-file.html',
  styleUrls: ['./hierarchy-submit-file.css'],
})
export class HierarchySubmitFileComponent implements OnInit {
  public isUploadSuccess = false;
  responseMessage!: string;
  responseTitle!: string;
  public APIErrorList: any[] = [];

  openConfirmationMessage = false;
  IsWindowOpen = false;
  confirmationDialogMsg = '';
  HierarchySubscriptionKey: string = '';
  AuthToken: string = '';

  @Input() orgHierarchyId: string = '';
  @Input() uploadResultDetails: any;

  @Input()
  public dataSubmit!: FormGroup;

  @Output() loaderAtSubmitEvent = new EventEmitter<boolean>();
  @Output() SubmittedSuccess = new EventEmitter<boolean>();

  constructor(
    private excelService: ExcelService,
    private authService: AuthenticationService,
    private hierarchyService: HierarchyService
  ) {}

  ngOnInit(): void {
    console.log('this.APIErrorList.length->', this.APIErrorList.length);

    if (this.uploadResultDetails == 'Success') {
      this.isUploadSuccess = true;
    } else {
      this.isUploadSuccess = false;
      this.APIErrorList = this.uploadResultDetails;
    }
    this.AuthToken = localStorage.getItem('auth-token')!;
    this.HierarchySubscriptionKey =
      this.authService.authenticationDetails.SubscriptionKey;

    this.hierarchyService
      .GetHierarchy(this.HierarchySubscriptionKey, this.AuthToken)
      .subscribe((d: any) => {
        let hierarchies: [] = d.data;
        let orgHierarchy: any = hierarchies.find(
          (obj: any) => obj.name === 'ORG Hierarchy'
        );
        this.orgHierarchyId = orgHierarchy.hierarchyId;
      });
  }

  ngOnDestroy() {}

  closeWindow(status: boolean) {
    this.SubmittedSuccess.emit(status);
  }

  exportErrors() {
    this.excelService.exportAsExcelFile(this.APIErrorList, 'api-error-report');
  }
}
