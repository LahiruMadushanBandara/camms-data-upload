import { Component, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { threadId } from 'worker_threads';
import { StaffService } from "./services/staff.service";
import { StaffComponent } from './staff/staff.component';
import {NgbModal, ModalDismissReasons,NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from './modal/modal.component';
import {ModalConfig} from "./modal/modal.config";



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'camms-data-uploader';
  
  @ViewChild('modal')
  private modal!: ModalComponent;

  

  public modalConfig: ModalConfig = {
    modalTitle: "Title",
    onDismiss: () => {
      return true
    },
    dismissButtonLabel: "Dismiss",
    onClose: () => {
      return true
    },
    closeButtonLabel: "Close"
  }

  constructor(private dialogRef:MatDialog, private modalService: NgbModal){}

  openDialog(){
    this.dialogRef.open(StaffComponent) 
  }
  
  async openModal() {
    return await this.modal.open()
  }
}

