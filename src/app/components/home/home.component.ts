import { Component, Input, OnInit } from '@angular/core';
import { SharedService } from '../../services/shared.service';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  @Input() public homeDetails!: FormGroup;
  @Input() public opened: boolean = false;
  @Input() public nodeUploadWindowOpened: boolean = false;

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




