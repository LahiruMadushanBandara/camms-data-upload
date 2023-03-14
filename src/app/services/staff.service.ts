import { HttpClient, HttpHeaders, HttpParams  } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Guid } from 'guid-typescript';
import { StaffBulk } from '../models/StaffBulk.model';
import { ApiAuth } from '../models/apiauth.model';

@Injectable({
  providedIn: 'root'
})
export class StaffService {

  FlexOrgStaff = "https://demo.cammsconnect.com.au/flexstaff/V1/staff"
  FlexHierarchyAddStaffBulkUrl = "https://demo.cammsconnect.com.au/flexstaff/V1/staff/bulkpost"
  getUserUrls = "https://demo.cammsconnect.com.au/flexstaff/V1/user";
  

  constructor(private http:HttpClient) { }

  GetUserList(subscriptionKey:string, authToken:string){
    console.log(authToken)
    console.log(subscriptionKey)

    var getUserListHeaders = new HttpHeaders()
          .append('Authorization', `Bearer ${subscriptionKey}`)
          .append('Ocp-Apim-Subscription-Key',subscriptionKey)
          .append('Token',authToken);
    var getUserListOptions = { headers: getUserListHeaders,  params:new HttpParams};
    return this.http.get( this.getUserUrls, getUserListOptions);
  }

  GetStaffDetails(token:string, subscriptionKey:string){
    console.log(token)
    console.log(subscriptionKey)
    let GetStaffHeaders = new HttpHeaders().append(
      'Authorization', `Bearer ${subscriptionKey}`).append(
      'Ocp-Apim-Subscription-Key',subscriptionKey).append(
      'Token',token);

      let StaffReqOptions = { headers: GetStaffHeaders,  params:new HttpParams};

    return this.http.get( this.FlexOrgStaff, StaffReqOptions)
  }

  GetEmployees(subscriptionKey:string, authToken:string){
    console.log(authToken)
    console.log(subscriptionKey)
    var getEmpHeaders = new HttpHeaders()
          .append('Authorization', `Bearer ${subscriptionKey}`)
          .append('Ocp-Apim-Subscription-Key', subscriptionKey)
          .append('Token',authToken);
    return this.http.get(this.FlexOrgStaff, { headers: getEmpHeaders,  params:new HttpParams})
  }

  AddFlexStaffBulk(data:ApiAuth, staffData:StaffBulk[], IsLastChunk:boolean, TotalStaffCount:number, StaffCountInChunk:number, CurrentChunkIndex:number,Configuration:string) {
    console.log(data.AuthToken)
    console.log(data.StaffSubscriptionKey)
    var AddFlexSHierarchyStaffBulk = new HttpHeaders()
          .append('Content-Type', 'application/json')
          .append('Ocp-Apim-Subscription-Key', data.StaffSubscriptionKey)
          .append('Token',data.AuthToken)
          .append('Batchid', Guid.create().toString())
          .append('IsLastChunk', IsLastChunk.toString())
          .append('TotalStaffCount', TotalStaffCount.toString())
          .append('StaffCountInChunk', StaffCountInChunk.toString())
          .append('CurrentChunkIndex', CurrentChunkIndex.toString())
          .append('Configuration', Configuration);

    var AddStaffBulkReqOptions = { headers: AddFlexSHierarchyStaffBulk,  params:new HttpParams};
    return this.http.post(this.FlexHierarchyAddStaffBulkUrl, staffData, AddStaffBulkReqOptions);
  }
}
