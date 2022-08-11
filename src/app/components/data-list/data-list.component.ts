import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { RowClassArgs } from '@progress/kendo-angular-grid';
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

  @Output() newItemEvent = new EventEmitter<Boolean>();
  NextButtonDisabled!: Boolean;

  @Input()
  public dataReview!: FormGroup;

  staffDataList!: StaffBulk[];
  staffDataListToSubmit!: StaffBulk[];
  errorDataList!: string[];
  subscription!: Subscription;
  dataToSubmitSubscription!: Subscription;

  public gridData: StaffBulk[] = this.staffDataList

  constructor(private data: SharedService) { }

  changeNextButtonBehavior(value: Boolean) {
    this.newItemEvent.emit(value);
  }

  ngOnInit(): void {
    this.subscription = this.data.currentList.subscribe(d => this.staffDataList = d)
    this.subscription = this.data.currentErrorList.subscribe(d=>this.errorDataList = d)
    this.dataToSubmitSubscription = this.data.currentStaffListToSubmit.subscribe(d=>this.staffDataListToSubmit = d)
    this.gridData = this.staffDataList
    if(this.errorDataList.length > 0){
      this.changeNextButtonBehavior(true)
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.dataToSubmitSubscription.unsubscribe();
  }

  sendDataToSubmit():void {
    this.data.sendDataListToSubmit(this.staffDataList)
  }
}
