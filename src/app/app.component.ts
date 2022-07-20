import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { threadId } from 'worker_threads';
import { StaffService } from "./services/staff.service";
import { StaffComponent } from './staff/staff.component';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'camms-data-uploader';

  constructor(private dialogRef:MatDialog){}

  openDialog(){
    this.dialogRef.open(StaffComponent)
  }
}
