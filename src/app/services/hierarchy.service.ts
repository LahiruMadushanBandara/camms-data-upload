import { HttpClient, HttpHeaders, HttpParams  } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Guid } from 'guid-typescript';

@Injectable({
  providedIn: 'root'
})
export class HierarchyService {

  token = 'NPG[SLASH]or9qZwWo3UZpuXecuiavYsA2nMnz2fPCCtudqipDai1gnjcS[PLUS]g86oQSTAPXihCSu[PLUS]lqjS2KvoyQrb7F4UH3hlomyDI7ESFZdO1Wz[SLASH]qEnxDUEuVFfsRlPVCqeGq63'


  constructor(private http:HttpClient) { }

  GetHierarchyReqHeaders = new HttpHeaders().append(
    'Authorization', `Bearer f275c7024a584dd5b58c728ca08d6c4c`).append(
    'Ocp-Apim-Subscription-Key','f275c7024a584dd5b58c728ca08d6c4c').append(
    'Token',this.token).append('IncludeInactive', 'false');
    
  HierarchyNodeHeaders = new HttpHeaders().append('Content-Type', 'application/json').append(
      'Authorization', `Bearer f275c7024a584dd5b58c728ca08d6c4c`).append(
      'Ocp-Apim-Subscription-Key','f275c7024a584dd5b58c728ca08d6c4c').append(
      'Token',this.token).append('HierarchyId','9d063188-87f8-4931-bcc7-31dcf516202f');

  HerarchyNodeRequestOptions = { headers: this.HierarchyNodeHeaders, params:new HttpParams };
  HerarchyRequestOptions = { headers: this.GetHierarchyReqHeaders, params:new HttpParams };

  HierarchyUrl = "https://demo.cammsconnect.com.au/customhierarchy/Hierarchy";
  HierarchyNodeUrl = "https://demo.cammsconnect.com.au/customhierarchy/HierarchyNode";
  
  GetHierarchy(){
    return this.http.get( this.HierarchyUrl, this.HerarchyRequestOptions)
  }

  GetHierarchyNodes(){
    return this.http.get( this.HierarchyNodeUrl, this.HerarchyNodeRequestOptions)
  }

  CreateHierarchyNode(){
    return this.http.get( this.HierarchyNodeUrl, this.HerarchyNodeRequestOptions)
  }
}
