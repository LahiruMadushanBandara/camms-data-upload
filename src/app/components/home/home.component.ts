import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { SharedService } from '../../services/shared.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalResponseMessageComponent } from '../blocks/modal-response-message/modal-response-message.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  @Input() public homeDetails!: FormGroup;
  @Input() public staffWizardOpened: boolean = false;
  @Input() public nodeUploadWindowOpened: boolean = false;

  HierarchySubscriptionKey:string = "";
  StaffSubscriptionKey:string = "";
  AuthToken:string = "";
  responseBodyMsg:string = "";
  responseTitle:string = "";
  isErrorResponse:boolean = false
  IsSavedKeys:boolean = false;

  @ViewChild('modalMessage', { static: false })
  modalMessage!: ModalResponseMessageComponent;

  public active = false;
  public editForm: FormGroup = new FormGroup({
    AuthToken: new FormControl("", Validators.required),
    StaffSubscriptionKey: new FormControl("", Validators.required),
    HierarchySubscriptionKey: new FormControl("", Validators.required),

  });

  StaffUploadTitle = 'Staff Data Upload Wizard'
  NodeUploadWizardTitle = 'Organisation Hierarchy Upload Wizard'

  ngOnInit(): void {
   
    this.AuthToken = localStorage.getItem('auth-token')!;
    this.StaffSubscriptionKey = localStorage.getItem('staff-subscription-key')!;
    this.HierarchySubscriptionKey = localStorage.getItem('hierarchy-subscription-key')!;
  }

  title = 'camms-data-uploader';
  nodeUploadOpened = false

  constructor() { }

  openStaffWizard() {
    this.ValidateKeys() ? this.staffWizardOpened = true : this.staffWizardOpened = false;
  }

  openHierarchyWizard() {
    this.ValidateKeys() ?  this.nodeUploadWindowOpened = true : this.nodeUploadWindowOpened = false;
  }

  ValidateKeys() {
    if (this.AuthToken === "" || this.HierarchySubscriptionKey === "" || this.StaffSubscriptionKey === "") {
      this.responseTitle = "Authentication error";
      this.responseBodyMsg = "Please provide keys from settings area";
      this.isErrorResponse = true;
      this.modalMessage.open();
      return false;
    }
    else {
      return true;
    }
  }

  close = (status: boolean) => {
    this.staffWizardOpened = status
    this.nodeUploadWindowOpened = status
  }

  closeModal = (status: boolean) => {
    this.staffWizardOpened = !status
    this.nodeUploadWindowOpened = !status
  }

  public closeForm(): void {
    this.active = false;
  }

  public openForm() {
    this.active = true;
    this.IsSavedKeys = false;
    if (this.AuthToken !== "") {
      this.editForm.value.AuthToken = this.AuthToken;
    }
    if (this.HierarchySubscriptionKey !== "") {
      this.editForm.value.HierarchySubscriptionKey = this.HierarchySubscriptionKey;
    }
    if (this.StaffSubscriptionKey !== "") {
      this.editForm.value.StaffSubscriptionKey = this.StaffSubscriptionKey;
    }
  }

  public onSave(e: any) {
    localStorage.setItem('hierarchy-subscription-key', this.editForm.value.HierarchySubscriptionKey);
    localStorage.setItem('staff-subscription-key', this.editForm.value.StaffSubscriptionKey);
    localStorage.setItem('auth-token', this.editForm.value.AuthToken);
    this.IsSavedKeys = true;
  }
}




