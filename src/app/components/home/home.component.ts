import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { SharedService } from '../../services/shared.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalResponseMessageComponent } from '../blocks/modal-response-message/modal-response-message.component';
import { clearLine } from 'readline';
import { IncidentUploadSharedService } from 'src/app/services/incident-upload-shared.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
  //   @Input() public homeDetails!: FormGroup;
  //   @Input() public staffWizardOpened: boolean = false;
  //   @Input() public nodeUploadWindowOpened: boolean = false;
  //   @Input() public incidentUploadOpened: boolean = false;

  //   HierarchySubscriptionKey: string = '';
  //   StaffSubscriptionKey: string = '';
  //   AuthToken: string = '';

  //   responseBodyMsg: string = '';
  //   responseTitle: string = '';
  //   isErrorResponse: boolean = false;
  //   AuthTokenIncident: string = '';
  //   incidentSubscriptionKeyIncident: string = '';
  //   StaffSubscriptionKeyIncident: string = '';

  //   key1: string = '';

  //   @ViewChild('modalMessage', { static: false })
  //   modalMessage!: ModalResponseMessageComponent;

  //   public active = false;

  //   StaffUploadTitle = 'Staff Data Upload Wizard';
  //   NodeUploadWizardTitle = 'Organisation Hierarchy Upload Wizard';
  //   IncidentUploadWizardTitle = 'Incident Upload Wizard';

  //   ngOnInit(): void {
  //     this.AuthToken = localStorage.getItem('auth-token')!;
  //     this.StaffSubscriptionKey = environment.supscriptionKey;
  //     this.HierarchySubscriptionKey = environment.supscriptionKey;

  //     this.AuthTokenIncident = localStorage.getItem('auth-token')!;
  //     this.incidentSubscriptionKeyIncident = localStorage.getItem(
  //       'incident-subscription-key'
  //     )!;
  //     this.StaffSubscriptionKeyIncident = environment.supscriptionKey;

  //     this.incidentData.setKeyValues(
  //       this.AuthTokenIncident,
  //       this.incidentSubscriptionKeyIncident
  //     );
  //   }

  //   title = 'camms-data-uploader';
  //   nodeUploadOpened = false;

  //   constructor(private incidentData: IncidentUploadSharedService) {}

  //   openStaffWizard() {
  //     this.ValidateKeys()
  //       ? (this.staffWizardOpened = true)
  //       : (this.staffWizardOpened = false);
  //   }

  //   openHierarchyWizard() {
  //     this.ValidateKeys()
  //       ? (this.nodeUploadWindowOpened = true)
  //       : (this.nodeUploadWindowOpened = false);
  //   }

  //   openIncidentWizard() {
  //     this.ValidateIncidentKeys()
  //       ? (this.incidentUploadOpened = true)
  //       : (this.incidentUploadOpened = false);
  //   }

  //   ValidateKeys() {
  //     if (
  //       this.AuthToken === null ||
  //       this.HierarchySubscriptionKey === null ||
  //       this.StaffSubscriptionKey === null
  //     ) {
  //       console.log('validate keys');
  //       this.responseTitle = 'Authentication error';
  //       this.responseBodyMsg = 'Please provide keys from settings area';
  //       this.isErrorResponse = true;
  //       this.modalMessage.open();
  //       return false;
  //     } else {
  //       return true;
  //     }
  //   }

  //   ValidateIncidentKeys() {
  //     if (
  //       this.AuthTokenIncident === null ||
  //       this.incidentSubscriptionKeyIncident === null ||
  //       this.StaffSubscriptionKeyIncident === null
  //     ) {
  //       this.responseTitle = 'Authentication error';
  //       this.responseBodyMsg = 'Please provide keys from settings area';
  //       this.isErrorResponse = true;
  //       this.modalMessage.open();
  //       return false;
  //     } else {
  //       return true;
  //     }
  //   }

  //   close = (status: boolean) => {
  //     this.staffWizardOpened = status;
  //     this.nodeUploadWindowOpened = status;
  //     this.incidentUploadOpened = status;
  //   };

  //   closeModal = (status: boolean) => {
  //     this.staffWizardOpened = !status;
  //     this.nodeUploadWindowOpened = !status;
  //     this.incidentUploadOpened = !status;
  //   };

  //   activeKeyModal() {
  //     this.active = true;
  //   }

  //   resetKeysModal(value: boolean) {
  //     this.active = value;
  //   }

  //   //detect close loginging temp
  //   // detectLoginSuccess(isLoginSucsessFromChild: boolean) {
  //   //   this.isLoginSucsess = isLoginSucsessFromChild;
  //   // }
}
