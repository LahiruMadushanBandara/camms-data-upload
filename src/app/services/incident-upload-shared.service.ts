import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { workflowElementInfoWithRow } from '../components/incident-upload/incident-file-select/utils/uploadValidationClass/models/workflowElementInfoWithRow.model';
import { listMapping } from '../models/listMapping.model';
import { keyValues } from '../models/keyValues.model';

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

  IncidentRecordsListToSubmit: Array<any> = [];
  private incidentDataListBehavior: BehaviorSubject<any[]> =
    new BehaviorSubject(this.IncidentRecordsListToSubmit);
  currentIncidentListToSubmit = this.incidentDataListBehavior.asObservable();

  fieldInfo: Array<workflowElementInfoWithRow> = [];
  private fieldInfoList: BehaviorSubject<workflowElementInfoWithRow[]> =
    new BehaviorSubject(this.fieldInfo);
  currentFieldInfo = this.fieldInfoList.asObservable();

  constructor() {}

  changeDataList(data: any[], errrData: any[]) {
    this.dataList.next(data);
    this.errorDataList.next(errrData);
  }

  sendDataListToSubmit(data: any[]) {
    this.incidentDataListBehavior.next(data);
  }

  fieldInfoForSubmit(data: workflowElementInfoWithRow[]) {
    this.fieldInfoList.next(data);
  }

  //store single values
  private selectedObject: string = '';

  public getSelectedObject() {
    return this.selectedObject;
  }

  public setSelectedObject(objName: string) {
    this.selectedObject = objName;
  }

  //incidentkeys
  private incidentSubscriptionKey: string = '';
  private authToken: string = '';
  private staffSubscriptionKey: string = '';

  public setKeyValues(authToken: string, incidentKey: string) {
    this.authToken = authToken;
    this.incidentSubscriptionKey = incidentKey;
  }
  public getKeyValues(): keyValues {
    return {
      incidentKey: this.incidentSubscriptionKey,
      authToken: this.authToken,
    };
  }
}
