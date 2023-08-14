import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { StaffBulk } from 'src/app/models/StaffBulk.model';

@Component({
  selector: 'app-upload-details-table',
  templateUrl: './upload-details-table.component.html',
  styleUrls: ['./upload-details-table.component.css'],
})
export class UploadDetailsTableComponent implements OnInit {
  @Output() mainModalOpen = new EventEmitter<string>();
  @Output() newItemEvent = new EventEmitter<string>();

  public initiatePasswordModal = false;
  public modalActive: boolean = false;
  constructor() {}

  ngOnInit(): void {}
  public closeCommonModal(e: any) {
    console.log('password modal close');
    this.modalActive = false;
  }
  public openMainModelFromSelct(data: any) {
    this.mainModalOpen.emit(data);
  }

  openPasswordModal() {
    console.log('open password modal');
    this.initiatePasswordModal = true;
    this.modalActive = true;
  }
  initiateModal(e: any) {
    this.initiatePasswordModal = false;
  }
}
