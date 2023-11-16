import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { EnvService } from './env.service';

@Injectable({
  providedIn: 'root',
})
export class IncidentService {
  constructor(private http: HttpClient, private env: EnvService) {}

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
      `${this.env.baseForCammsAPI}${environment.getIncidentListUrl}`,
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

    return this.http.get(
      `${this.env.baseForCammsAPI}${environment.getWorkFlowList}`,
      IncidentReqOptions
    );
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
      `${this.env.baseForCammsAPI}${environment.getWorkFlowElements}`,
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
      `${this.env.baseForCammsAPI}${environment.getWorkflowElementFieldInfo}`,
      WorkflowElementsReqOptions
    );
  }
  //using selected object get listmapping
  getListMappingBelongsToSelectedObject(
    subscriptionKey: string,
    token: string,
    objectName: string
  ) {
    let getListHeaders = new HttpHeaders()
      .append('Authorization', `Bearer ${subscriptionKey}`)
      .append('Ocp-Apim-Subscription-Key', subscriptionKey)
      .append('Token', token);

    let params = new HttpParams().append('ObjectName', objectName);

    let getListMappingReqOptions = {
      headers: getListHeaders,
      params: params,
    };

    return this.http.get(
      `${this.env.baseForCammsAPI}${environment.getListMapping}`,
      getListMappingReqOptions
    );
  }

  //using list type get list items
  getListItemsAccordingToListType(
    subscriptionKey: string,
    token: string,
    listType: string
  ) {
    let getListItemsHeaders = new HttpHeaders()
      .append('Authorization', `Bearer ${subscriptionKey}`)
      .append('Ocp-Apim-Subscription-Key', subscriptionKey)
      .append('Token', token);

    let params = new HttpParams().append('ListType', listType);

    let getListItemsReqOptions = {
      headers: getListItemsHeaders,
      params: params,
    };

    return this.http.get(
      `${this.env.baseForCammsAPI}${environment.getListItems}`,
      getListItemsReqOptions
    );
  }

  // getIncidentTypes

  getIncidentTypes(subscriptionKey: string, token: string) {
    let getListHeaders = new HttpHeaders()
      .append('Authorization', `Bearer ${subscriptionKey}`)
      .append('Ocp-Apim-Subscription-Key', subscriptionKey)
      .append('Token', token);

    let getIncidentTypesReqOptions = {
      headers: getListHeaders,
    };

    return this.http.get(
      `${this.env.baseForCammsAPI}${environment.getIncidentTypes}`,
      getIncidentTypesReqOptions
    );
  }
}
