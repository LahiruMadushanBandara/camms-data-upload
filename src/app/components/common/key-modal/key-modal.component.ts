import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SelectEvent } from '@progress/kendo-angular-layout';
import { HierarchyService } from 'src/app/services/hierarchy.service';
import { IncidentUploadSharedService } from 'src/app/services/incident-upload-shared.service';
import { IncidentService } from 'src/app/services/incident.service';
import { StaffService } from 'src/app/services/staff.service';
import { AuthenticationClass } from 'src/app/utils/Classes/AuthenticationClass';

@Component({
  selector: 'app-key-modal',
  templateUrl: './key-modal.component.html',
  styleUrls: ['./key-modal.component.css'],
})
export class KeyModalComponent implements OnInit {
  @Input() active: boolean = false;
  @Output() closeKeyModel = new EventEmitter<boolean>();

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
    this.availableHierarchyKey = localStorage.getItem(
      'hierarchy-subscription-key'
    )!;

    let keys = this.incidentData.getKeyValues();
    this.availableAuthToken = keys.authToken;

    this.availableIncidentKey = keys.incidentKey;
    this.availableStaffkey = keys.staffKey;
  }

  public editForm: FormGroup = new FormGroup({
    AuthToken: new FormControl('', Validators.required),
    StaffSubscriptionKey: new FormControl('', Validators.required),
    HierarchySubscriptionKey: new FormControl('', Validators.required),
  });

  public incidentKeyForm: FormGroup = new FormGroup({
    AuthTokenIncident: new FormControl('', Validators.required),
    StaffSubscriptionKeyIncident: new FormControl('', Validators.required),
    incidentSubscriptionKeyIncident: new FormControl('', Validators.required),
  });

  public openForm() {
    this.active = true;
    this.IsSavedKeys = false;
    this.IsSavedIncidentKeys = false;
  }

  //saff and hirachy form save function
  public onSave(e: any) {
    localStorage.setItem(
      'hierarchy-subscription-key',
      this.editForm.value.HierarchySubscriptionKey
    );

    localStorage.setItem(
      'staff-subscription-key',
      this.editForm.value.StaffSubscriptionKey
    );

    localStorage.setItem('auth-token', this.editForm.value.AuthToken);

    this.IsSavedKeys = true;
  }

  // //incident form save function
  public onSaveIncidentKeys(e: any) {
    localStorage.setItem(
      'staff-subscription-key',
      this.incidentKeyForm.value.StaffSubscriptionKeyIncident
    );

    localStorage.setItem(
      'incident-subscription-key',
      this.incidentKeyForm.value.incidentSubscriptionKeyIncident
    );

    localStorage.setItem(
      'auth-token',
      this.incidentKeyForm.value.AuthTokenIncident
    );
    this.incidentData.setKeyValues(
      this.incidentKeyForm.value.AuthTokenIncident,
      this.incidentKeyForm.value.incidentSubscriptionKeyIncident,
      this.incidentKeyForm.value.StaffSubscriptionKeyIncident
    );

    this.IsSavedIncidentKeys = true;
  }

  // use Autentication class
  // public async onSaveIncidentKeys2() {
  //   let val = await this.authentication.incidentSupscriptionKeyCheck(
  //     this.incidentKeyForm.value.AuthTokenIncident,
  //     this.incidentKeyForm.value.incidentSubscriptionKeyIncident
  //   );
  //   console.log('onSaveIncidentKeys2()');
  //   console.log('val->', val);
  // }

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
