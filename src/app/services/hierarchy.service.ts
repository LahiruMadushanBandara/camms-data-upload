import { HttpClient, HttpHeaders, HttpParams  } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Guid } from 'guid-typescript';
import { ApiAuth } from '../models/apiauth.model';
import { HierarchyNode } from '../models/HierarchyNode.model';

@Injectable({
  providedIn: 'root'
})
export class HierarchyService {

  constructor(private http:HttpClient) { }

  HierarchyUrl = "https://demo.cammsconnect.com.au/customhierarchy/Hierarchy";
  HierarchyNodeUrl = "https://demo.cammsconnect.com.au/customhierarchy/api/V1/HierarchyNode";



  GetHierarchy(subscriptionKey:string, token:string){
    let GetHierarchyReqHeaders = new HttpHeaders().append('Authorization', `Bearer ${subscriptionKey}`).append('Ocp-Apim-Subscription-Key',subscriptionKey)
    .append('Token',token).append('IncludeInactive', 'false');

    let HerarchyRequestOptions = { headers: GetHierarchyReqHeaders, params:new HttpParams };
    return this.http.get( this.HierarchyUrl, HerarchyRequestOptions)
  }

  GetHierarchyNodes(subscriptionKey:string, token:string){
    let HierarchyNodeHeaders = new HttpHeaders()
        .append('Content-Type', 'application/json')
        .append('HierarchyId','9d063188-87f8-4931-bcc7-31dcf516202f')
        .append('Authorization', `Bearer ${subscriptionKey}`)
        .append('Ocp-Apim-Subscription-Key',subscriptionKey)
        .append('Token',token)
    let  HerarchyNodeRequestOptions = { headers: HierarchyNodeHeaders, params:new HttpParams };

    return this.http.get( this.HierarchyNodeUrl, HerarchyNodeRequestOptions)
  }

  CreateHierarchyNode(authTokens:ApiAuth, hierarchyData:HierarchyNode[], isLastChunk:boolean,totalHierarchyNodeCount:number,hierarchyNodeCountInChunk:number,currentChunkIndex:number){
    
    let HierarchyNodeHeaders = new HttpHeaders()
            .append('Content-Type', 'application/json')
            .append('Authorization', `Bearer ${authTokens.HierarchySubscriptionKey}`)
            .append('Ocp-Apim-Subscription-Key',authTokens.HierarchySubscriptionKey)
            .append('Token',authTokens.AuthToken)
            .append('Batchid', Guid.create().toString())
            .append('IsLastChunk', isLastChunk.toString())
            .append('TotalHierarchyNodeCount', totalHierarchyNodeCount.toString())
            .append('HierarchyNodeCountInChunk', hierarchyNodeCountInChunk.toString())
            .append('CurrentChunkIndex', currentChunkIndex.toString())
            .append('HierarchyId', '9d063188-87f8-4931-bcc7-31dcf516202f')

          let  HerarchyNodeRequestOptions = { headers: HierarchyNodeHeaders, params:new HttpParams };

          console.log(HerarchyNodeRequestOptions)
            
    return this.http.post( this.HierarchyNodeUrl, hierarchyData, HerarchyNodeRequestOptions)
  }
}
