import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { auditLog } from '../models/auditLog.model';
import { UrlService } from './url.service';

@Injectable({
  providedIn: 'root',
})
export class AuditLogService {
  private url = 'UploadLog';
  constructor(private http: HttpClient, private URLservice: UrlService) {}

  getAuditLogList() {
    var getAuditLogListHeaders = new HttpHeaders();
    var getAuditLogListOptions = {
      headers: getAuditLogListHeaders,
      params: new HttpParams(),
    };
    return this.http.get(
      `${this.URLservice.baseForAuditLogAPI}${environment.auditLogTestApiBaseUrl}`,
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
      `${this.URLservice.baseForAuditLogAPI}${environment.auditLogTestApiBaseUrl}`,
      newAuditLog,
      setAuditLogReqOptions
    );
  }

  deleteAuditLog(id: any) {
    return this.http.delete(
      `${this.URLservice.baseForAuditLogAPI}${environment.auditLogTestApiBaseUrl}/${id}`
    );
  }
}
