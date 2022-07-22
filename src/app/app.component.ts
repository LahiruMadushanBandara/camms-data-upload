import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ModalComponent } from './modal/modal.component';
import { ModalConfig } from './modal/modal.config';
import { StaffComponent } from './staff/staff.component';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent{
  title = 'camms-data-uploader';
  
  ngOnInit() {}

  @ViewChild('modal')
  private modal!: ModalComponent;

  constructor(private dialogRef:MatDialog){}
 
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

  openDialog(){
    this.dialogRef.open(StaffComponent)
  }

  async openModal() {
    return await this.modal.open()
  }
}
