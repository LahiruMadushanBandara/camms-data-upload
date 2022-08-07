import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { StaffBulk } from 'src/app/models/StaffBulk.model';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-data-list',
  templateUrl: './data-list.component.html',
  styleUrls: ['./data-list.component.css'],
  encapsulation:ViewEncapsulation.None
})
export class DataListComponent implements OnInit, OnDestroy {

  @Input()
  public dataReview!: FormGroup;

  staffDataList!: StaffBulk[];
  staffDataListToSubmit!: StaffBulk[];
  errorDataList!: string[];
  subscription!: Subscription;
  dataToSubmitSubscription!: Subscription;

  public gridData: StaffBulk[] = this.staffDataList

  constructor(private data: SharedService) { }

  ngOnInit(): void {
    this.subscription = this.data.currentList.subscribe(d => this.staffDataList = d)
    this.subscription = this.data.currentErrorList.subscribe(d=>this.errorDataList = d)
    this.dataToSubmitSubscription = this.data.currentStaffListToSubmit.subscribe(d=>this.staffDataListToSubmit = d)
    this.gridData = this.staffDataList
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.dataToSubmitSubscription.unsubscribe();
  }

  sendDataToSubmit():void {
    this.data.sendDataListToSubmit(this.staffDataList)
  }
}
