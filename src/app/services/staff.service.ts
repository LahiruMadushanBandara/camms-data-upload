import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Guid } from 'guid-typescript';
import { StaffBulk } from '../models/StaffBulk.model';
import { ApiAuth } from '../models/apiauth.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class StaffService {
  constructor(private http: HttpClient) {}

  GetUserList(subscriptionKey: string, authToken: string) {
    var getUserListHeaders = new HttpHeaders()
      .append('Authorization', `Bearer ${subscriptionKey}`)
      .append('Ocp-Apim-Subscription-Key', subscriptionKey)
      .append('Token', authToken);
    var getUserListOptions = {
      headers: getUserListHeaders,
      params: new HttpParams(),
    };
    return this.http.get(environment.getUserUrls, getUserListOptions);
  }

  GetStaffDetails(token: string, subscriptionKey: string) {
    let GetStaffHeaders = new HttpHeaders()
      .append('Authorization', `Bearer ${subscriptionKey}`)
      .append('Ocp-Apim-Subscription-Key', subscriptionKey)
      .append('Token', token);

    let StaffReqOptions = {
      headers: GetStaffHeaders,
      params: new HttpParams(),
    };

    return this.http.get(environment.FlexOrgStaff, StaffReqOptions);
  }

  GetEmployees(subscriptionKey: string, authToken: string) {
    var getEmpHeaders = new HttpHeaders()
      .append('Authorization', `Bearer ${subscriptionKey}`)
      .append('Ocp-Apim-Subscription-Key', subscriptionKey)
      .append('Token', authToken);
    return this.http.get(environment.FlexOrgStaff, {
      headers: getEmpHeaders,
      params: new HttpParams(),
    });
  }

  AddFlexStaffBulk(
    data: ApiAuth,
    staffData: StaffBulk[],
    IsLastChunk: boolean,
    TotalStaffCount: number,
    StaffCountInChunk: number,
    CurrentChunkIndex: number,
    Configuration: string
  ) {
    var AddFlexSHierarchyStaffBulk = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Ocp-Apim-Subscription-Key', data.StaffSubscriptionKey)
      .append('Token', data.AuthToken)
      .append('Batchid', Guid.create().toString())
      .append('IsLastChunk', IsLastChunk.toString())
      .append('TotalStaffCount', TotalStaffCount.toString())
      .append('StaffCountInChunk', StaffCountInChunk.toString())
      .append('CurrentChunkIndex', CurrentChunkIndex.toString())
      .append('Configuration', Configuration);

    var AddStaffBulkReqOptions = {
      headers: AddFlexSHierarchyStaffBulk,
      params: new HttpParams(),
    };
    return this.http.post(
      environment.FlexHierarchyAddStaffBulkUrl,
      staffData,
      AddStaffBulkReqOptions
    );
  }
}
