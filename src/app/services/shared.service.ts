import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { Staff } from '../models/staff.model';
import { StaffBulk } from '../models/StaffBulk.model';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  val: Array<StaffBulk> = [];
  private messageSource: BehaviorSubject<StaffBulk[]> = new BehaviorSubject(this.val);
  currentMessage = this.messageSource.asObservable();

  constructor() { }

  changeDataList(data: StaffBulk[]) {
    var item = data;
    this.messageSource.next(data)
  }
}
