import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SelectEvent } from '@progress/kendo-angular-layout';
import { emit } from 'process';
import { HierarchyService } from 'src/app/services/hierarchy.service';
import { IncidentUploadSharedService } from 'src/app/services/incident-upload-shared.service';
import { IncidentService } from 'src/app/services/incident.service';
import { StaffService } from 'src/app/services/staff.service';
import { AuthenticationClass } from 'src/app/utils/Classes/AuthenticationClass';

@Component({
  selector: 'app-login-model',
  templateUrl: './login-model.component.html',
  styleUrls: ['./login-model.component.css'],
})
export class LoginModelComponent implements OnInit {
  @Input() active: boolean = true;
  @Output() closeKeyModel = new EventEmitter<boolean>();
  @Output() detectLoginSucsess = new EventEmitter<boolean>();

  HierarchySubscriptionKey: string = '';
  StaffSubscriptionKey: string = '';
  AuthToken: string = '';

  incidentSubscriptionKeyIncident: string = '';
  AuthTokenIncident: string = '';
  StaffSubscriptionKeyIncident: string = '';

  availableAuthToken: string = '';
  availableIncidentKey: string = '';
  availableHierarchyKey: string = '';
  availableStaffkey: string = '';

  IsSavedKeys: boolean = false;
  IsSavedIncidentKeys: boolean = false;

  public authentication!: AuthenticationClass;

  constructor(private incidentData: IncidentUploadSharedService) {
    // this.authentication = new AuthenticationClass();
  }

  ngOnInit(): void {
    // this.availableHierarchyKey = localStorage.getItem(
    //   'hierarchy-subscription-key'
    // )!;
    // let keys = this.incidentData.getKeyValues();
    // this.availableAuthToken = keys.authToken;
    // this.availableIncidentKey = keys.incidentKey;
    // this.availableStaffkey = keys.staffKey;
  }

  public editForm: FormGroup = new FormGroup({
    OrganizationName: new FormControl('', Validators.required),
    UserName: new FormControl('', Validators.required),
    Password: new FormControl('', Validators.required),
  });

  public openForm() {
    this.active = true;
    this.IsSavedKeys = false;
    this.IsSavedIncidentKeys = false;
  }

  //saff and hirachy form save function
  public onSave(e: any) {
    console.log(
      `OrganizationName is: ${
        this.editForm.value.OrganizationName
      } ${'\n'}User name is: ${
        this.editForm.value.UserName
      } ${'\n'}Password is : ${this.editForm.value.Password}`
    );
    this.IsSavedKeys = true;
    this.detectLoginSucsess.emit(true);
    this.closeForm();
  }

  public closeForm(): void {
    this.active = false;
    this.closeKeyModel.emit(false);
    this.IsSavedKeys = false;
    this.IsSavedIncidentKeys = false;
  }

  public onTabSelect(e: SelectEvent): void {
    console.log(e);
  }
}
