import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
// import { SharedService } from '../../services/shared.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { clearLine } from 'readline';
import { IncidentUploadSharedService } from 'src/app/services/incident-upload-shared.service';
import { environment } from 'src/environments/environment';
import { ModalResponseMessageComponent } from './components/blocks/modal-response-message/modal-response-message.component';
import { AuthenticationDetails } from './models/AuthenticationDetails.model';
import { AuthenticationService } from './services/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  @Input() public homeDetails!: FormGroup;
  @Input() public staffWizardOpened: boolean = false;
  @Input() public nodeUploadWindowOpened: boolean = false;
  @Input() public incidentUploadOpened: boolean = false;

  HierarchySubscriptionKey: string = '';
  StaffSubscriptionKey: string = '';
  AuthToken: string = '';

  AuthenticationData: AuthenticationDetails;
  responseBodyMsg: string = '';
  responseTitle: string = '';
  isErrorResponse: boolean = false;
  AuthTokenIncident: string = '';
  incidentSubscriptionKeyIncident: string = '';
  StaffSubscriptionKeyIncident: string = '';

  @ViewChild('modalMessage', { static: false })
  modalMessage!: ModalResponseMessageComponent;

  public active = false;

  StaffUploadTitle = 'Staff Data Upload Wizard';
  NodeUploadWizardTitle = 'Organisation Hierarchy Upload Wizard';
  IncidentUploadWizardTitle = 'Incident Upload Wizard';

  constructor(
    private incidentData: IncidentUploadSharedService,
    private authService: AuthenticationService,
    private eleRef: ElementRef
  ) {}

  ngOnInit(): void {
    // let userName = this.eleRef.nativeElement.getAttribute('userName');
    let userName = 'pasindu';

    let userId = this.eleRef.nativeElement.getAttribute('userId');
    let staffName = this.eleRef.nativeElement.getAttribute('staffName');
    // let databaseName = this.eleRef.nativeElement.getAttribute('databaseName');
    // let subscriptionKey =
    //   this.eleRef.nativeElement.getAttribute('subscriptionKey');

    let databaseName = 'cammspartnerdemo_avonet';
    let subscriptionKey = '5d28e5587ee04fdf8aef191dec5b9076';

    this.AuthToken = localStorage.getItem('auth-token')!;

    this.StaffSubscriptionKey =
      this.authService.authenticationDetails.SubscriptionKey;
    this.HierarchySubscriptionKey =
      this.authService.authenticationDetails.SubscriptionKey;

    this.AuthenticationData = {
      UserName: userName,
      OrganizationName: databaseName,
      APIUserName: environment.APIUserName,
      userId: userId,
      SubscriptionKey: subscriptionKey,
    };
    this.authService.authenticationDetails = this.AuthenticationData;
    //this part shoud update becase caugt auth-token still wont work for incident upload
    this.AuthTokenIncident = localStorage.getItem('auth-token')!;
    this.incidentSubscriptionKeyIncident = localStorage.getItem(
      'incident-subscription-key'
    )!;
    this.StaffSubscriptionKeyIncident =
      this.authService.authenticationDetails.SubscriptionKey;

    this.incidentData.setKeyValues(
      this.AuthTokenIncident,
      this.incidentSubscriptionKeyIncident
    );
  }

  title = 'camms-data-uploader';
  nodeUploadOpened = false;

  openStaffWizard() {
    this.ValidateKeys()
      ? (this.staffWizardOpened = true)
      : (this.staffWizardOpened = false);
  }

  openHierarchyWizard() {
    this.ValidateKeys()
      ? (this.nodeUploadWindowOpened = true)
      : (this.nodeUploadWindowOpened = false);
  }

  openIncidentWizard() {
    this.ValidateIncidentKeys()
      ? (this.incidentUploadOpened = true)
      : (this.incidentUploadOpened = false);
  }

  ValidateKeys() {
    if (
      this.AuthToken === null ||
      this.HierarchySubscriptionKey === null ||
      this.StaffSubscriptionKey === null
    ) {
      this.responseTitle = 'Authentication error';
      this.responseBodyMsg = 'Please provide keys from settings area';
      this.isErrorResponse = true;
      this.modalMessage.open();
      return false;
    } else {
      return true;
    }
  }

  ValidateIncidentKeys() {
    if (
      this.AuthTokenIncident === null ||
      this.incidentSubscriptionKeyIncident === null ||
      this.StaffSubscriptionKeyIncident === null
    ) {
      this.responseTitle = 'Authentication error';
      this.responseBodyMsg = 'Auth Token Expired';
      this.isErrorResponse = true;
      this.modalMessage.open();
      return false;
    } else {
      return true;
    }
  }

  close = (status: boolean) => {
    this.staffWizardOpened = status;
    this.nodeUploadWindowOpened = status;
    this.incidentUploadOpened = status;
  };

  closeModal = (status: boolean) => {
    this.staffWizardOpened = !status;
    this.nodeUploadWindowOpened = !status;
    this.incidentUploadOpened = !status;
  };

  activeKeyModal() {
    this.active = true;
  }

  resetKeysModal(value: boolean) {
    this.active = value;
  }
  public openMainModal(data: any) {
    switch (data.confirmation) {
      case 'Staff':
        this.openStaffWizard();
        break;
      case 'HierarchyNode':
        this.openHierarchyWizard();
        break;
      case 'Incident':
        this.openIncidentWizard();
        break;
    }
  }
}
