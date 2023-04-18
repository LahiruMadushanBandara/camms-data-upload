import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { SharedService } from '../../services/shared.service';
import { FormGroup } from '@angular/forms';
import { ModalResponseMessageComponent } from '../blocks/modal-response-message/modal-response-message.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  @Input() public homeDetails!: FormGroup;
  @Input() public opened: boolean = false;
  @Input() public nodeUploadWindowOpened: boolean = false;

  @ViewChild('modalMessage', { static: false })
  modalMessage!: ModalResponseMessageComponent;

  StaffUploadTitle = 'Staff Data Upload Wizard'
  NodeUploadWizardTitle = 'Organisation Hierarchy Upload Wizard'
  
  ngOnInit(): void {
  }

  title = 'camms-data-uploader';
  nodeUploadOpened = false
  
  constructor(){}
  

 close = (status:boolean) =>
 {
  this.opened = status
  this.nodeUploadWindowOpened = status
 }

 closeModal = (status:boolean) => {
  this.opened = !status
  this.nodeUploadWindowOpened = !status
 }

}




