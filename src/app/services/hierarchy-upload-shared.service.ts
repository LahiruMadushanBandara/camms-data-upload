import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HierarchyNode } from '../models/HierarchyNode.model';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  hierarchyRecordsList: Array<HierarchyNode> = [];
  private hierarchyList: BehaviorSubject<HierarchyNode[]> = new BehaviorSubject(this.hierarchyRecordsList);
  currentHierarchyList = this.hierarchyList.asObservable();

  hierarchyErrorList: Array<string> = [];
  private hierarchyErrorDataList: BehaviorSubject<string[]> = new BehaviorSubject(this.hierarchyErrorList);
  currentHierarchyErrorList = this.hierarchyErrorDataList.asObservable();

  hierarchyListToSubmit: Array<HierarchyNode> = [];
  private HierarchyDataListBehavior: BehaviorSubject<HierarchyNode[]> = new BehaviorSubject(this.hierarchyListToSubmit);
  currentHierarchyListToSubmit = this.HierarchyDataListBehavior.asObservable();

  changeDataList =  (data: HierarchyNode[], errrData:any[]) => {
    this.hierarchyList.next(data)
    this.hierarchyErrorDataList.next(errrData)
  }

  sendDataListToSubmit = (data: HierarchyNode[]) =>{
    this.HierarchyDataListBehavior.next(data)
  }
}