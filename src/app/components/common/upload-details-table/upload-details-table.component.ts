import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { DataBindingDirective } from '@progress/kendo-angular-grid';
import { StaffBulk } from 'src/app/models/StaffBulk.model';
import { auditLog } from 'src/app/models/auditLog.model';
import { AuditLogService } from 'src/app/services/audit-log.service';
import { environment } from 'src/environments/environment';
////////////////

import { AuditLogSharedService } from 'src/app/services/audit-log-shared.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { auditLogGridData } from 'src/app/models/auditLogGridData.model';
//////////////////

@Component({
  selector: 'app-upload-details-table',
  templateUrl: './upload-details-table.component.html',
  styleUrls: ['./upload-details-table.component.css'],
})
export class UploadDetailsTableComponent implements OnInit {
  @Output() mainModalOpen = new EventEmitter<string>();
  @Output() newItemEvent = new EventEmitter<string>();
  ////////////////////////////////////
  @ViewChild(DataBindingDirective) dataBinding: DataBindingDirective;

  public gridView: any[];
  public dataAvailable = false;
  public mySelection: string[] = [];
  public auditDataAvailable: boolean = false;
  /////////////////////////////////////
  public initiatePasswordModal = false;
  public modalActive: boolean = false;
  public allAuditLogs: auditLog[];
  constructor(
    private authService: AuthenticationService,
    private auditLogShared: AuditLogSharedService,
    private auditLogService: AuditLogService
  ) {}

  async ngOnInit(): Promise<void> {
    await this.getAllAuditlogs().then((x) => {
      this.gridView = this.allAuditLogs;

      this.gridView.forEach(
        (x) =>
          (x.uploadedDate = new Date(x.uploadedDate)
            .toISOString()
            .split('T')[0])
      );
      console.log('this.gridView->', this.gridView);
      this.auditDataAvailable = this.checkAuditDataAvailability(this.gridView);
    });

    this.auditLogShared.uploadAuditLog.subscribe((fileType: string) => {
      this.uploadAuditLog(fileType);
    });
  }

  ////////////////////////////////////////////

  ///////////////////////////////////////////
  public closeCommonModal(e: any) {
    this.modalActive = false;
  }
  public openMainModelFromSelct(data: any) {
    this.mainModalOpen.emit(data);
  }

  public async openPasswordModal() {
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
        complete: () => {},
      });
    });
  }

  public async uploadAuditLog(fileType: string) {
    let newAuditLog: auditLog = {
      uploadedBy: this.authService.authenticationDetails.UserName,
      uploadedDate: new Date(),
      fileName: this.auditLogShared.uploadedfilename,
      fileType: fileType,
      staffData: 'Data',
    };
    await this.setAuditlog(newAuditLog).then((res: auditLog[]) => {
      this.gridView = res;
      this.auditLogShared.uploadedfilename = '';
      this.auditDataAvailable = true;
    });
  }

  public async setAuditlog(newAuditLog: auditLog) {
    return new Promise<auditLog[]>((resolve, reject) => {
      this.auditLogService.setAuditLog(newAuditLog).subscribe({
        next: (res: auditLog[]) => {
          resolve(res);
        },
        error: (error: HttpErrorResponse) => {},
      });
    });
  }

  public async deleteAuditLog(id: number) {
    return new Promise<auditLog[]>((resolve, reject) => {
      this.auditLogService.deleteAuditLog(id).subscribe({
        next: (res: auditLog[]) => {
          resolve(res);
        },
        error: (error: HttpErrorResponse) => {},
      });
    });
  }

  public tableDeleteButtonClick(dataItem: any) {
    this.gridView = this.gridView.filter((item) => item !== dataItem);
    this.auditDataAvailable = this.checkAuditDataAvailability(this.gridView);
    this.deleteAuditLog(dataItem.id);
  }

  private checkAuditDataAvailability(gridData: any[]): boolean {
    console.log('gridData->', gridData);
    if (gridData.length == 0) {
      return false;
    } else {
      return true;
    }
  }
}
