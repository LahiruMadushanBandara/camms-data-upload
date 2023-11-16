import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { auditLog } from '../models/auditLog.model';
import { EnvService } from './env.service';

@Injectable({
  providedIn: 'root',
})
export class AuditLogService {
  private url = 'UploadLog';
  constructor(private http: HttpClient, private env: EnvService) {}

  getAuditLogList() {
    var getAuditLogListHeaders = new HttpHeaders();
    var getAuditLogListOptions = {
      headers: getAuditLogListHeaders,
      params: new HttpParams(),
    };
    return this.http.get(
      `${this.env.baseForAuditLogAPI}${environment.auditLogTestApiBaseUrl}`,
      getAuditLogListOptions
    );
  }

  setAuditLog(newAuditLog: auditLog) {
    var setAuditLogHeaders = new HttpHeaders();

    var setAuditLogReqOptions = {
      headers: setAuditLogHeaders,
      params: new HttpParams(),
    };
    return this.http.post(
      `${this.env.baseForAuditLogAPI}${environment.auditLogTestApiBaseUrl}`,
      newAuditLog,
      setAuditLogReqOptions
    );
  }

  deleteAuditLog(id: any) {
    return this.http.delete(
      `${this.env.baseForAuditLogAPI}${environment.auditLogTestApiBaseUrl}/${id}`
    );
  }
}
