import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { SharedService } from '../../services/shared.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalResponseMessageComponent } from '../blocks/modal-response-message/modal-response-message.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  @Input() public homeDetails!: FormGroup;
  @Input() public staffWizardOpened: boolean = false;
  @Input() public nodeUploadWindowOpened: boolean = false;
  @Input() public incidentUploadOpened: boolean = false;

  HierarchySubscriptionKey: string = '';
  StaffSubscriptionKey: string = '';
  AuthToken: string = '';
  incidentSubscriptionKey: string = '';
  responseBodyMsg: string = '';
  responseTitle: string = '';
  isErrorResponse: boolean = false;
  IsSavedKeys: boolean = false;

  @ViewChild('modalMessage', { static: false })
  modalMessage!: ModalResponseMessageComponent;

  public active = false;
  public editForm: FormGroup = new FormGroup({
    AuthToken: new FormControl('', Validators.required),
    StaffSubscriptionKey: new FormControl(''),
    HierarchySubscriptionKey: new FormControl(''),
    incidentSubscriptionKey: new FormControl(''),
  });

  StaffUploadTitle = 'Staff Data Upload Wizard';
  NodeUploadWizardTitle = 'Organisation Hierarchy Upload Wizard';
  IncidentUploadWizardTitle = 'Incident Upload Wizard';

  ngOnInit(): void {
    this.AuthToken = localStorage.getItem('auth-token')!;
    this.StaffSubscriptionKey = localStorage.getItem('staff-subscription-key')!;
    this.HierarchySubscriptionKey = localStorage.getItem(
      'hierarchy-subscription-key'
    )!;
    this.incidentSubscriptionKey = localStorage.getItem(
      'incident-subscription-key'
    )!;
  }

  title = 'camms-data-uploader';
  nodeUploadOpened = false;

  constructor() {}

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
    this.ValidateKeys()
      ? (this.incidentUploadOpened = true)
      : (this.incidentUploadOpened = false);
  }

  ValidateKeys() {
    if (
      this.AuthToken === '' ||
      this.HierarchySubscriptionKey === '' ||
      this.StaffSubscriptionKey === '' ||
      this.incidentSubscriptionKey === ''
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

  validateIncidentKeys() {
    if (this.AuthToken === '' || this.incidentSubscriptionKey === '') {
      this.responseTitle = 'Authentication error';
      this.responseBodyMsg = 'Please provide keys from settings area';
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

  public closeForm(): void {
    this.active = false;
  }

  public openForm() {
    this.active = true;
    this.IsSavedKeys = false;
    if (this.AuthToken !== '') {
      this.editForm.value.AuthToken = this.AuthToken;
    }
    if (this.HierarchySubscriptionKey !== '') {
      this.editForm.value.HierarchySubscriptionKey =
        this.HierarchySubscriptionKey;
    }
    if (this.StaffSubscriptionKey !== '') {
      this.editForm.value.StaffSubscriptionKey = this.StaffSubscriptionKey;
    }
    if (this.incidentSubscriptionKey !== '') {
      this.editForm.value.incidentSubscriptionKey =
        this.incidentSubscriptionKey;
    }
  }

  public onSave(e: any) {
    localStorage.setItem(
      'hierarchy-subscription-key',
      this.editForm.value.HierarchySubscriptionKey
    );
    localStorage.setItem(
      'staff-subscription-key',
      this.editForm.value.StaffSubscriptionKey
    );
    localStorage.setItem(
      'incident-subscription-key',
      this.editForm.value.incidentSubscriptionKey
    );
    localStorage.setItem('auth-token', this.editForm.value.AuthToken);
    this.IsSavedKeys = true;
  }
}
