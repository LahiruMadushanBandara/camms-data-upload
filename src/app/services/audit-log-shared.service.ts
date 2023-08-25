import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuditLogSharedService {
  constructor() {}

  uploadAuditLog = new EventEmitter<any>();

  triggerAuditLogUploadEvent(fileType: string) {
    this.uploadAuditLog.emit(fileType);
    console.log('hi-shared');
  }

  private _uploadedfilename: string = '';
  public get uploadedfilename(): string {
    return this._uploadedfilename;
  }
  public set uploadedfilename(value: string) {
    this._uploadedfilename = value;
  }
}
