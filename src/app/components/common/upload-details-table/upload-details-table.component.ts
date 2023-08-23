import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { StaffBulk } from 'src/app/models/StaffBulk.model';
import { auditLog } from 'src/app/models/auditLog.model';
import { AuditLogService } from 'src/app/services/audit-log.service';
import { environment } from 'src/environments/environment';

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
  public allAuditLogs: auditLog[];
  constructor(private auditLogService: AuditLogService) {}

  ngOnInit(): void {
    this.auditLogService
      .getAuditLogList()
      .subscribe((result: auditLog[]) => (this.allAuditLogs = result));
  }
  public closeCommonModal(e: any) {
    console.log('password modal close');
    this.modalActive = false;
  }
  public openMainModelFromSelct(data: any) {
    this.mainModalOpen.emit(data);
  }

  public async openPasswordModal() {
    await this.setAuditlog(this.dummyLog);
    await this.getAllAuditlogs();
    console.log('audit log lenth', this.allAuditLogs.length);
    var len = this.allAuditLogs.length;
    console.log(this.allAuditLogs[len - 1].id);
    await this.deleteAuditLog(this.allAuditLogs[len - 1].id);

    this.initiatePasswordModal = true;
    this.modalActive = true;
  }
  initiateModal(e: any) {
    this.initiatePasswordModal = false;
  }

  public async getAllAuditlogs() {
    return new Promise<auditLog[]>((resolve, reject) => {
      this.auditLogService.getAuditLogList().subscribe({
        next: (res: auditLog[]) => {
          resolve(res);
          this.allAuditLogs = res;
        },
        error: (error: HttpErrorResponse) => {
          reject(error);
        },
        complete: () => {
          console.log('allAuditLogs->', this.allAuditLogs);
        },
      });
    });
  }

  public dummyLog: auditLog = {
    UploadedBy: 'dataFromAngular',
    UploadedDate: new Date(2023 - 11 - 12),
    FileName: 'angular.staff.Excel',
    FileType: 'Staff',
    StaffData: 'dummy Data',
  };

  public async setAuditlog(newAuditLog: auditLog) {
    return new Promise<auditLog[]>((resolve, reject) => {
      this.auditLogService.setAuditLog(newAuditLog).subscribe({
        next: (res: auditLog[]) => {
          resolve(res);
          console.log('response from post->', res);
        },
        error: (error: HttpErrorResponse) => console.log(error),
      });
    });
  }

  public async deleteAuditLog(id: number) {
    return new Promise<auditLog[]>((resolve, reject) => {
      this.auditLogService.deleteAuditLog(id).subscribe({
        next: (res: auditLog[]) => {
          resolve(res);
          console.log('after delete from post->', res);
        },
        error: (error: HttpErrorResponse) => console.log(error),
      });
    });
  }
}
