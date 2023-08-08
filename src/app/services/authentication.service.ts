import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthenticationDetails } from '../models/AuthenticationDetails.model';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private _authenticationDetails: AuthenticationDetails = {
    OrganizationName: '',
    UserName: '',
    SubscriptionKey: '',
  };

  public get authenticationDetails(): AuthenticationDetails {
    return this._authenticationDetails;
  }
  public set authenticationDetails(value: AuthenticationDetails) {
    this._authenticationDetails = value;
  }

  constructor(private http: HttpClient) {}

  getCammsToken(authDetails: AuthenticationDetails) {
    var getCammsTokenHeaders = new HttpHeaders()
      .append('OrganizationName', authDetails.OrganizationName)
      .append('UserName', authDetails.UserName)
      .append('Ocp-Apim-Subscription-Key', authDetails.SubscriptionKey)
      .append(
        'Password',
        authDetails.Password != null ? authDetails.Password : ''
      );

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
