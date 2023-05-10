import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class IncidentService {
  constructor(private http: HttpClient) {}

  // private getIncidentListUrl =
  //   'https://demo.cammsconnect.com.au/incident/V2/Incident';
  // private getWorkFlowElements =
  //   'https://demo.cammsconnect.com.au/incident/V2/IncidentWorkflow';

  getIncidentList(subscriptionKey: string, authToken: string) {
    var getIncidentListHeaders = new HttpHeaders()
      .append('Authorization', `Bearer ${subscriptionKey}`)
      .append('Ocp-Apim-Subscription-Key', subscriptionKey)
      .append('Token', authToken);
    var getIncidentListOptions = {
      headers: getIncidentListHeaders,
      params: new HttpParams(),
    };
    return this.http.get(
      environment.getIncidentListUrl,
      getIncidentListOptions
    );
  }

  // Get Incident Workflow,  api call for get workFlow list
  getWorkFlowList(subscriptionKey: string, token: string, pageSize: number) {
    let getWorkFlowElementHeaders = new HttpHeaders()
      .append('Authorization', `Bearer ${subscriptionKey}`)
      .append('Ocp-Apim-Subscription-Key', subscriptionKey)
      .append('Token', token);

    let params = new HttpParams().append('PageSize', pageSize);
    let IncidentReqOptions = {
      headers: getWorkFlowElementHeaders,
      params: params,
    };

    return this.http.get(environment.getWorkFlowList, IncidentReqOptions);
  }

  //Get Incident Workflow Elements for find object (IncidentObject)
  getWorkFlowElements(
    subscriptionKey: string,
    token: string,
    WorkflowId: number,
    pageSize: number
  ) {
    let getWorkFlowElementHeaders = new HttpHeaders()
      .append('Authorization', `Bearer ${subscriptionKey}`)
      .append('Ocp-Apim-Subscription-Key', subscriptionKey)
      .append('Token', token);

    let params = new HttpParams()
      .append('WorkflowId', WorkflowId)
      .append('PageSize', pageSize);
    let WorkflowElementsReqOptions = {
      headers: getWorkFlowElementHeaders,
      params: params,
    };

    return this.http.get(
      environment.getWorkFlowElements,
      WorkflowElementsReqOptions
    );
  }

  //using workflowElementId get Workflow Element Field info
  getWorkFlowElementsFieldInfo(
    subscriptionKey: string,
    token: string,
    WorkflowElementId: number,
    pageSize: number
  ) {
    let getWorkFlowElementHeaders = new HttpHeaders()
      .append('Authorization', `Bearer ${subscriptionKey}`)
      .append('Ocp-Apim-Subscription-Key', subscriptionKey)
      .append('Token', token);

    let params = new HttpParams()
      .append('WorkflowElementId', WorkflowElementId)
      .append('PageSize', pageSize);
    let WorkflowElementsReqOptions = {
      headers: getWorkFlowElementHeaders,
      params: params,
    };

    return this.http.get(
      environment.getWorkflowElementFieldInfo,
      WorkflowElementsReqOptions
    );
  }
}
