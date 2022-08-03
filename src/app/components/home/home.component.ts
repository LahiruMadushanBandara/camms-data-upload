import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { threadId } from 'worker_threads';
import { StaffService } from "../../services/staff.service";
import { StaffComponent } from '../../components/staff/staff.component';
import {NgbModal, ModalDismissReasons,NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '../../components/modal/modal.component';
import {ModalConfig} from "../../modal/modal.config";
import { SharedService } from '../../services/shared.service';
import { Subscription } from 'rxjs';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  @Input()
  public homeDetails!: FormGroup;
  ngOnInit(): void {
    
  }

  title = 'camms-data-uploader';
  opened = false
  
  @ViewChild('modal')
  private modal!: ModalComponent;
  @ViewChild('hierarchyNodeModal')
  private hierarchyNodeModal!: ModalComponent;

  public modalConfig: ModalConfig = {
    modalTitle: "Data Upload Wizard",
    onDismiss: () => {
      return true
    },
    dismissButtonLabel: "Dismiss",
    onClose: () => {
      return true
    },
    closeButtonLabel: "Close"
  }
  

  constructor(private sharedService:SharedService){}
  
  
  async openModal() {
    this.sharedService.onFirstComponentButtonClick()
  }
  async openHierarchyModal() {
    await this.hierarchyNodeModal.open(true)
  }

}



