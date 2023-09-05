import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-account-details',
  templateUrl: './account-details.component.html',
})
export class AccountDetailsComponent implements AfterViewInit {
  public uploadSaveUrl = 'saveUrl'; // should represent an actual API endpoint
  public uploadRemoveUrl = 'removeUrl'; // should represent an actual API endpoint

  @Input() public displayIncidentField = false;
  @Input() public displayStaffField = false;
  @Input() public displayHierarchyField = false;

  @Input() public accountDetails!: FormGroup;
  @Input() public showApiDetailsError = false;
  @Input() public msg!: string;

  public ngAfterViewInit(): void {}
}
