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

  public mySelection: string[] = [];
  public pdfSVG: SVGIcon = filePdfIcon;
  public excelSVG: SVGIcon = fileExcelIcon;
  /////////////////////////////////////
  public initiatePasswordModal = false;
  public modalActive: boolean = false;
  public allAuditLogs: auditLog[];
  constructor(private auditLogService: AuditLogService) {}

  async ngOnInit(): Promise<void> {
    await this.getAllAuditlogs().then((x) => {
      console.log('hi');
      this.gridView = this.allAuditLogs;
    });
    console.log('on init->', this.allAuditLogs);
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
    console.log('password modal close');
    this.modalActive = false;
  }
  public openMainModelFromSelct(data: any) {
    this.mainModalOpen.emit(data);
  }

  public async openPasswordModal() {
    // await this.setAuditlog(this.dummyLog);
    // await this.getAllAuditlogs();
    // var len = this.allAuditLogs.length;
    // console.log(this.allAuditLogs[len - 1].id);
    // await this.deleteAuditLog(this.allAuditLogs[len - 1].id);

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

  public tableDeleteButtonClick(dataItem: any) {
    console.log('delete button click->', dataItem.id);
    this.gridView = this.gridView.filter((item) => item !== dataItem);
    console.log('befor->', this.gridView);
    this.deleteAuditLog(dataItem.id);
  }
}
