import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthenticationDetails } from '../models/AuthenticationDetails.model';
import { UrlService } from './url.service';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(private http: HttpClient, private URLservice: UrlService) {}
  private _authenticationDetails: AuthenticationDetails = {
    OrganizationName: '',
    UserName: '',
    APIUserName: '',
    userId: 0,
    SubscriptionKey: '',
  };

  public get authenticationDetails(): AuthenticationDetails {
    return this._authenticationDetails;
  }
  public set authenticationDetails(value: AuthenticationDetails) {
    this._authenticationDetails = value;
  }

  getCammsToken(authDetails: AuthenticationDetails) {
    var getCammsTokenHeaders = new HttpHeaders()
      .append('Authorization', `Bearer ${authDetails.SubscriptionKey}`)
      .append('OrganizationName', authDetails.OrganizationName)
      .append('UserName', authDetails.APIUserName)
      .append('Ocp-Apim-Subscription-Key', authDetails.SubscriptionKey)
      .append(
        'Password',
        authDetails.Password != null ? authDetails.Password : ''
      );

    var getCammsTokenOptions = {
      headers: getCammsTokenHeaders,
    };
    return this.http.get(
      `${this.URLservice.baseCammsAPI}${environment.getCammsToken}`,
      getCammsTokenOptions
    );
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

    return this.http.get(
      `${this.URLservice.baseCammsAPI}${environment.getWorkFlowList}`,
      IncidentReqOptions
    );
  }
}
