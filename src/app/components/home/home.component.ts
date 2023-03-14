import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { SharedService } from '../../services/shared.service';
import { FormGroup } from '@angular/forms';
import { ModalResponseMessageComponent } from '../blocks/modal-response-message/modal-response-message.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  @Input() public homeDetails!: FormGroup;
  @Input() public opened: boolean = false;
  @Input() public nodeUploadWindowOpened: boolean = false;
  @Input() public incidentUpload: boolean = false;

  StaffUploadTitle = 'Staff Data Upload Wizard';
  NodeUploadWizardTitle = 'Organisation Hierarchy Upload Wizard';
  IncidentUploadWizardTitle = 'Incident Upload Wizard';

  ngOnInit(): void {}

  @ViewChild('modalMessage', { static: false })
  modalMessage!: ModalResponseMessageComponent;

  title = 'camms-data-uploader';
  nodeUploadOpened = false;

  constructor() {}

  close = (status: boolean) => {
    this.opened = status;
    this.nodeUploadWindowOpened = status;
    this.incidentUpload = status;
    console.log(status);
  };

  closeModal = (status: boolean) => {
    this.opened = !status;
    this.nodeUploadWindowOpened = !status;
    this.incidentUpload = !status;
  };

  openResponseModal() {
    this.modalMessage.open();
  }
}
