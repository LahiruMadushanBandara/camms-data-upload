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
import { images } from './images';
import { employees } from './employees';
import { SVGIcon, filePdfIcon, fileExcelIcon } from '@progress/kendo-svg-icons';
import { process } from '@progress/kendo-data-query';
import { AuditLogSharedService } from 'src/app/services/audit-log-shared.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
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
  public gridData: unknown[] = employees;
  public gridView: unknown[];
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
      this.auditDataAvailable = this.checkAuditDataAvailability(this.gridView);
      console.log('grid data available onInit->', this.auditDataAvailable);
    });

    this.auditLogShared.uploadAuditLog.subscribe((fileType: string) => {
      this.uploadAuditLog(fileType);
    });
  }

  ////////////////////////////////////////////

  public photoURL(dataItem: { img_id: string; gender: string }): string {
    const code: string = dataItem.img_id + dataItem.gender;
    const image: { [Key: string]: string } = images;

    return image[code];
  }

  public flagURL(dataItem: { country: string }): string {
    const code: string = dataItem.country;
    const image: { [Key: string]: string } = images;

    return image[code];
  }
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

  public dummyLog: auditLog = {
    UploadedBy: 'dataFromAngular',
    UploadedDate: new Date(2023 - 11 - 12),
    FileName: 'angular.staff.Excel',
    FileType: 'Staff',
    StaffData: 'dummy Data',
  };

  public async uploadAuditLog(fileType: string) {
    let newAuditLog: auditLog = {
      UploadedBy: this.authService.authenticationDetails.UserName,
      UploadedDate: new Date(),
      FileName: this.auditLogShared.uploadedfilename,
      FileType: fileType,
      StaffData: 'Data',
    };
    await this.setAuditlog(newAuditLog).then((res: auditLog[]) => {
      this.gridView = res;
      this.auditLogShared.uploadedfilename = '';
      this.auditDataAvailable = true;
      console.log('grid data available setAuditLog->', this.auditDataAvailable);
    });
  }

  public async setAuditlog(newAuditLog: auditLog) {
    return new Promise<auditLog[]>((resolve, reject) => {
      this.auditLogService.setAuditLog(newAuditLog).subscribe({
        next: (res: auditLog[]) => {
          resolve(res);
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

  public tableDeleteButtonClick(dataItem: any) {
    this.gridView = this.gridView.filter((item) => item !== dataItem);
    this.auditDataAvailable = this.checkAuditDataAvailability(this.gridView);
    this.deleteAuditLog(dataItem.id);
    console.log('grid data available delete->', this.auditDataAvailable);
  }

  private checkAuditDataAvailability(gridData: any[]): boolean {
    if (gridData.length == 0) {
      return false;
    } else {
      return true;
    }
  }
}
