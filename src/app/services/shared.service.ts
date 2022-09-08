import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { StaffBulk } from '../models/StaffBulk.model';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  staffRecordsList: Array<StaffBulk> = [];
  private dataList: BehaviorSubject<StaffBulk[]> = new BehaviorSubject(this.staffRecordsList);
  currentList = this.dataList.asObservable();

  errorList: Array<string> = [];
  private errorDataList: BehaviorSubject<string[]> = new BehaviorSubject(this.errorList);
  currentErrorList = this.errorDataList.asObservable();

  staffListToSubmit: Array<StaffBulk> = [];
  private staffDataListBehavior: BehaviorSubject<StaffBulk[]> = new BehaviorSubject(this.staffListToSubmit);
  currentStaffListToSubmit = this.staffDataListBehavior.asObservable();

  constructor() { }

  changeDataList(data: StaffBulk[], errrData:any[]) {
    this.dataList.next(data)
    this.errorDataList.next(errrData)
  }

  sendDataListToSubmit(data: StaffBulk[]) {
    this.staffDataListBehavior.next(data)
  }
}
