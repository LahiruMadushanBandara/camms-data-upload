import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class IncidentService {
  constructor(private http: HttpClient) {}

  private getIncidentListUrl =
    'https://demo.cammsconnect.com.au/incident/V2/Incident';
  private getWorkFlowElements =
    'https://demo.cammsconnect.com.au/incident/V2/IncidentWorkflow';

  getIncidentList(subscriptionKey: string, authToken: string) {
    console.log(authToken);
    console.log(subscriptionKey);

    var getIncidentListHeaders = new HttpHeaders()
      .append('Authorization', `Bearer ${subscriptionKey}`)
      .append('Ocp-Apim-Subscription-Key', subscriptionKey)
      .append('Token', authToken);
    var getIncidentListOptions = {
      headers: getIncidentListHeaders,
      params: new HttpParams(),
    };
    return this.http.get(this.getIncidentListUrl, getIncidentListOptions);
  }

  // Get Incident Workflow,  api call for get workFlow list
  getWorkFlowList(subscriptionKey: string, token: string, pageSize: number) {
    console.log(token);
    console.log(subscriptionKey);
    let getWorkFlowElementHeaders = new HttpHeaders()
      .append('Authorization', `Bearer ${subscriptionKey}`)
      .append('Ocp-Apim-Subscription-Key', subscriptionKey)
      .append('Token', token);

    let params = new HttpParams().append('PageSize', pageSize);
    let StaffReqOptions = {
      headers: getWorkFlowElementHeaders,
      params: params,
    };

    return this.http.get(this.getWorkFlowElements, StaffReqOptions);
  }
}
