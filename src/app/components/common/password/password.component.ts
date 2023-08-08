import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticationDetails } from 'src/app/models/AuthenticationDetails.model';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { IncidentUploadSharedService } from 'src/app/services/incident-upload-shared.service';
import { AuthenticationClass } from 'src/app/utils/Classes/AuthenticationClass';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.css'],
})
export class PasswordComponent implements OnInit {
  @Input() active: boolean = false;
  @Output() closeCommonModal = new EventEmitter<boolean>();
  @Output() mainModalOpen = new EventEmitter<string>();

  public modalActive = false;
  public width = 200;
  public height = 300;

  public saveButtonloaderVisible = false;
  public saveButtonText = 'Save';

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
    console.log('auth details->', authentication.authenticationDetails);
    console.log('auth token->', this.getAuthToken);
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
  public openSelect() {
    this.closeCommonModal.emit(false);
    this.modalActive = true;
    this.active = false;
    console.log(this.getAuthToken());
  }

  private async getAuthToken() {
    this.authentication
      .getCammsToken({
        OrganizationName: 'cammspartnerdemo_avonet',
        Password: '5c@lab!lit47',
        SubscriptionKey: '5d28e5587ee04fdf8aef191dec5b9076',
        UserName: 'Sysadmin',
      })
      .subscribe({
        next: (res: any) => {
          console.log(res);
        },
        error: (error: HttpErrorResponse) => {
          console.log(error);
        },
        complete: () => {},
      });
  }

  public closeSelectModal(e: any) {
    this.modalActive = false;
  }
  public mainModalOpenFromSelect(data: any) {
    console.log('commen-data->', data);
    this.mainModalOpen.emit(data);
  }
}
