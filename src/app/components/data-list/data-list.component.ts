import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { StaffBulk } from 'src/app/models/StaffBulk.model';
import { ExcelService } from 'src/app/services/excel.service';
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
  errorDataList!: any[];
  subscription!: Subscription;
  dataToSubmitSubscription!: Subscription;
  errorRowCount = 0;

  public gridData: StaffBulk[] = this.staffDataList

  constructor(private data: SharedService, private excelService:ExcelService) { }

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

    this.errorRowCount = this.errorDataList
          .map(v => v.RowNo)
          .filter((v, i, vIds) => vIds.indexOf(v) === i).length
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.dataToSubmitSubscription.unsubscribe();
  }
  sendDataToSubmit():void {
    this.data.sendDataListToSubmit(this.staffDataList)
  }
  exportErrors(){
    this.excelService.exportAsExcelFile(this.errorDataList,"error-report")
  }
}
