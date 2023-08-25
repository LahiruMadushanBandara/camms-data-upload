import { HttpClient, HttpHeaders, HttpParams  } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Guid } from 'guid-typescript';
import { environment } from 'src/environments/environment';
import { ApiAuth } from '../models/apiauth.model';
import { HierarchyNode } from '../models/HierarchyNode.model';

@Injectable({
  providedIn: 'root',
})
export class HierarchyService {
  constructor(private http: HttpClient) {}

  GetHierarchy(subscriptionKey: string, token: string) {
    let GetHierarchyReqHeaders = new HttpHeaders()
      .append('Authorization', `Bearer ${subscriptionKey}`)
      .append('Ocp-Apim-Subscription-Key', subscriptionKey)
      .append('Token', token)
      .append('IncludeInactive', 'false');

    let HerarchyRequestOptions = {
      headers: GetHierarchyReqHeaders,
      params: new HttpParams(),
    };
    return this.http.get(environment.HierarchyUrl, HerarchyRequestOptions);
  }

  GetHierarchyNodes(
    subscriptionKey: string,
    token: string,
    hierarchyId: string
  ) {
    let HierarchyNodeHeaders = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('HierarchyId', hierarchyId)
      .append('Authorization', `Bearer ${subscriptionKey}`)
      .append('Ocp-Apim-Subscription-Key', subscriptionKey)
      .append('Token', token);
    let HerarchyNodeRequestOptions = {
      headers: HierarchyNodeHeaders,
      params: new HttpParams(),
    };

    return this.http.get(
      environment.HierarchyNodeUrl,
      HerarchyNodeRequestOptions
    );
  }

  CreateHierarchyNode(
    authTokens: ApiAuth,
    hierarchyData: HierarchyNode[],
    isLastChunk: boolean,
    totalHierarchyNodeCount: number,
    hierarchyNodeCountInChunk: number,
    currentChunkIndex: number,
    hierarchyId: string
  ) {
    let HierarchyNodeHeaders = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Authorization', `Bearer ${authTokens.HierarchySubscriptionKey}`)
      .append('Ocp-Apim-Subscription-Key', authTokens.HierarchySubscriptionKey)
      .append('Token', authTokens.AuthToken)
      .append('Batchid', Guid.create().toString())
      .append('IsLastChunk', isLastChunk.toString())
      .append('TotalHierarchyNodeCount', totalHierarchyNodeCount.toString())
      .append('HierarchyNodeCountInChunk', hierarchyNodeCountInChunk.toString())
      .append('CurrentChunkIndex', currentChunkIndex.toString())
      .append('HierarchyId', hierarchyId);

    let HerarchyNodeRequestOptions = {
      headers: HierarchyNodeHeaders,
      params: new HttpParams(),
    };

    console.log(HerarchyNodeRequestOptions);

    return this.http.post(
      environment.HierarchyNodeUrl,
      hierarchyData,
      HerarchyNodeRequestOptions
    );
  }
}
