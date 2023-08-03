import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { IncidentUploadSharedService } from 'src/app/services/incident-upload-shared.service';
import { AuthenticationClass } from 'src/app/utils/Classes/AuthenticationClass';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.css'],
})
export class SelectComponent implements OnInit {
  @Input() active: boolean = false;
  @Output() closeCommonModal = new EventEmitter<boolean>();

  public form: FormGroup;
  public data: { [Key: string]: string } = {
    confirmation: '',
  };
  public width = 200;
  public height = 300;

  public model = {
    gender: null,
  };
  public selectedUploader: string = '';
  incidentSubscriptionKeyIncident: string = '';
  AuthTokenIncident: string = '';
  StaffSubscriptionKeyIncident: string = '';

  availableAuthToken: string = '';
  availableIncidentKey: string = '';
  availableHierarchyKey: string = '';
  availableStaffkey: string = '';

  IsSavedKeys: boolean = false;
  IsSavedIncidentKeys: boolean = false;

  public errors: string[] = [];

  constructor(
    private incidentData: IncidentUploadSharedService,
    private authentication: AuthenticationService
  ) {
    this.form = new FormGroup({
      confirmation: new FormControl(this.data['confirmation'], [
        Validators.required,
      ]),
    });
  }

  ngOnInit(): void {
    let keys = this.incidentData.getKeyValues();
    this.availableAuthToken = keys.authToken;

    this.availableIncidentKey = keys.incidentKey;
  }

  public incidentKeyForm: FormGroup = new FormGroup({
    AuthTokenIncident: new FormControl(''),
  });

  public openForm() {
    this.active = true;
    this.IsSavedKeys = false;
    this.IsSavedIncidentKeys = false;
  }

  //incident form save function
  public async onSaveIncidentKeys(e: any) {
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
      this.incidentKeyForm.value.incidentSubscriptionKeyIncident
    );

    this.IsSavedIncidentKeys = true;
    this.onSaveIncidentKeysCheckValidity();
  }

  // use Autentication class
  public async onSaveIncidentKeysCheckValidity() {
    var authenticationClass = new AuthenticationClass(this.authentication);

    try {
      let val = await authenticationClass.incidentSupscriptionKeyCheck(
        this.incidentKeyForm.value.AuthTokenIncident,
        this.incidentKeyForm.value.incidentSubscriptionKeyIncident
      );
      console.log('incident res->', val);
      this.IsSavedIncidentKeys = true;
    } catch (error) {
      console.log('inciden error->', error);
      localStorage.setItem('incident-subscription-key', '');
    }
  }

  public closeForm(): void {
    this.active = false;
    this.closeCommonModal.emit(false);
    this.IsSavedKeys = false;
    this.IsSavedIncidentKeys = false;
  }

  public submitForm(): void {
    console.log(this.form.value);
    this.form.markAllAsTouched();
  }
}
