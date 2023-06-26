import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(private http: HttpClient) {}

  getCammsToken(OrganizationName: string, UserName: string, Password: string) {
    var getCammsTokenHeaders = new HttpHeaders()
      .append('OrganizationName', OrganizationName)
      .append('UserName', UserName)
      .append('Password', Password);
    var getCammsTokenOptions = {
      headers: getCammsTokenHeaders,
    };
    return this.http.get(environment.getCammsToken, getCammsTokenOptions);
  }

  checkStaffKeyValidity(staffSubscriptionKey: string, authToken: string) {
    var getCheckStaffKeyValidity = new HttpHeaders()
      .append('Authorization', `Bearer ${staffSubscriptionKey}`)
      .append('Ocp-Apim-Subscription-Key', staffSubscriptionKey)
      .append('Token', authToken);
    return this.http.get(environment.checkStaffKeyValidity, {
      headers: getCheckStaffKeyValidity,
      params: new HttpParams(),
    });
  }

  checkIncidentKeyValidity(incidentSubscriptionKey: string, token: string) {
    let getWorkFlowElementHeaders = new HttpHeaders()
      .append('Authorization', `Bearer ${incidentSubscriptionKey}`)
      .append('Ocp-Apim-Subscription-Key', incidentSubscriptionKey)
      .append('Token', token);

    let params = new HttpParams().append('PageSize', 1);
    let IncidentReqOptions = {
      headers: getWorkFlowElementHeaders,
      params: params,
    };

    return this.http.get(environment.getWorkFlowList, IncidentReqOptions);
  }

  checkHierarchyKeyValidity(hierarchyubscriptionKey: string, token: string) {
    let GetHierarchyReqHeaders = new HttpHeaders()
      .append('Authorization', `Bearer ${hierarchyubscriptionKey}`)
      .append('Ocp-Apim-Subscription-Key', hierarchyubscriptionKey)
      .append('Token', token)
      .append('IncludeInactive', 'false');

    let HerarchyRequestOptions = {
      headers: GetHierarchyReqHeaders,
      params: new HttpParams(),
    };
    return this.http.get(environment.HierarchyUrl, HerarchyRequestOptions);
  }
}
