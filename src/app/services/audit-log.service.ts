import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { auditLog } from '../models/auditLog.model';

@Injectable({
  providedIn: 'root',
})
export class AuditLogService {
  private url = 'UploadLog';
  constructor(private http: HttpClient) {}

  // public getAuditLogList(): Observable<auditLog[]> {
  //   return this.http.get<auditLog[]>(environment.auditLogTestApiBaseUrl);
  // }

  // public setAuditLog(newAuditLog: auditLog): Observable<auditLog[]> {
  //   this.http.post<auditLog[]>(environment.auditLogTestApiBaseUrl);
  // }

  // public getAuditLogList(): Observable<auditLog[]> {
  //   return this.http.get<auditLog[]>(environment.auditLogTestApiBaseUrl);
  // }

  getAuditLogList() {
    var getAuditLogListHeaders = new HttpHeaders();
    var getAuditLogListOptions = {
      headers: getAuditLogListHeaders,
      params: new HttpParams(),
    };
    return this.http.get(
      environment.auditLogTestApiBaseUrl,
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
      environment.auditLogTestApiBaseUrl,
      newAuditLog,
      setAuditLogReqOptions
    );
  }

  deleteAuditLog(id: any) {
    return this.http.delete(`${environment.auditLogTestApiBaseUrl}/${id}`);
  }
}
