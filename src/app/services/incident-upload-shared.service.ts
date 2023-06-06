import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class IncidentUploadSharedService {
  IncidentRecordsList: Array<any> = [];
  private dataList: BehaviorSubject<any[]> = new BehaviorSubject(
    this.IncidentRecordsList
  );
  currentList = this.dataList.asObservable();

  errorList: Array<string> = [];
  private errorDataList: BehaviorSubject<string[]> = new BehaviorSubject(
    this.errorList
  );
  currentErrorList = this.errorDataList.asObservable();

  staffListToSubmit: Array<any> = [];
  private incidentDataListBehavior: BehaviorSubject<any[]> =
    new BehaviorSubject(this.IncidentRecordsList);
  currentIncidentListToSubmit = this.incidentDataListBehavior.asObservable();

  constructor() {}

  changeDataList(data: any[], errrData: any[]) {
    this.dataList.next(data);
    this.errorDataList.next(errrData);
  }

  sendDataListToSubmit(data: any[]) {
    this.incidentDataListBehavior.next(data);
  }
}
