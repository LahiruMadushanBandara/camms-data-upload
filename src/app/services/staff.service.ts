import { HttpClient, HttpHeaders, HttpParams  } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Staff } from '../models/staff.model';

@Injectable({
  providedIn: 'root'
})
export class StaffService {

  token = 'NPG[SLASH]or9qZwWo3UZpuXecuiavYsA2nMnz2fPCCtudqipDai1gnjcS[PLUS]g86oQSTAPXihCSu[PLUS]lqjS2KvoyQrb7F4UH3hlomyDI7ESFZdO1Wz[SLASH]qEnxDUEuVFfsRlPVCqeGq63'


  businessUnitHeaders = new HttpHeaders().append('Content-Type', 'application/json').append(
    'Authorization', `Bearer f275c7024a584dd5b58c728ca08d6c4c`).append(
    'Ocp-Apim-Subscription-Key','f275c7024a584dd5b58c728ca08d6c4c').append(
    'Token',this.token);

  HierarchyNodeHeaders = new HttpHeaders().append('Content-Type', 'application/json').append(
    'Authorization', `Bearer f275c7024a584dd5b58c728ca08d6c4c`).append(
    'Ocp-Apim-Subscription-Key','f275c7024a584dd5b58c728ca08d6c4c').append(
    'Token',this.token).append('HierarchyId','9d063188-87f8-4931-bcc7-31dcf516202f');

GetStaffHeaders = new HttpHeaders().append(
'Authorization', `Bearer 25e3a30e46d74b748b1e1c5335bb4076`).append(
'Ocp-Apim-Subscription-Key','25e3a30e46d74b748b1e1c5335bb4076').append(
'AuthenticationToken',this.token);

AddStaffHeaders = new HttpHeaders().append(
'Authorization', `Bearer 25e3a30e46d74b748b1e1c5335bb4076`).append(
'Ocp-Apim-Subscription-Key','25e3a30e46d74b748b1e1c5335bb4076').append(
'AuthenticationToken',this.token);
    

  params = new HttpParams().append("Token", this.token).append("PageNo",1).append("PageSize",10);
  TokenParams = new HttpParams().append("Token", this.token)

  requestOptions = { headers: this.businessUnitHeaders, params: this.params };
  HerarchyRequestOptions = { headers: this.HierarchyNodeHeaders, params: this.TokenParams };
  StaffReqOptions = { headers: this.GetStaffHeaders,  params:new HttpParams};
  AddStaffReqOptions = { headers: this.AddStaffHeaders,  params:new HttpParams};

  

  GetDirectoratesUrl = "https://demo.cammsconnect.com.au/customhierarchy/api/V1/getdirectoratedetails";
  GetBusinessUnitsUrl = "https://demo.cammsconnect.com.au/customhierarchy/api/V1/getbusinessunit";
  HierarchyNodeDetailsUrl = "https://demo.cammsconnect.com.au/customhierarchy/hierarchynode";
  GetStaffDetailsUrl = "https://demo.cammsconnect.com.au/staff/api/Staff";
  AddStaffUrl = "https://demo.cammsconnect.com.au/staff/api/Staff";

  constructor(private http:HttpClient) { }

  GetBusinessUnits(){
    return this.http.get( this.GetBusinessUnitsUrl, this.requestOptions)
  }

  GetDirectorates(){
    return this.http.get( this.GetDirectoratesUrl, this.requestOptions)
  }

  GetHierarchyNodes(){
    return this.http.get( this.HierarchyNodeDetailsUrl, this.HerarchyRequestOptions)
  }

  GetStaffDetails(){
    return this.http.get( this.GetStaffDetailsUrl, this.StaffReqOptions)
  }

  AddStaff(staffData:Staff) {
    console.log('frm service')
    return this.http.post(this.AddStaffUrl, staffData, this.AddStaffReqOptions);
  }
}
