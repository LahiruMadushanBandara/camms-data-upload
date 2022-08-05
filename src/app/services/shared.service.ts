import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { CustomErrorModal } from '../models/CustomErrorModal.modal';
import { Staff } from '../models/staff.model';
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

  constructor() { }

  changeDataList(data: StaffBulk[], errrData:string[]) {
    this.dataList.next(data)
    this.errorDataList.next(errrData)
  }
}
