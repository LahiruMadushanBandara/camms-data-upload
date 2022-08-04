import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CustomErrorModal } from 'src/app/models/CustomErrorModal.modal';
import { Staff } from 'src/app/models/staff.model';
import { StaffBulk } from 'src/app/models/StaffBulk.model';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-data-list',
  templateUrl: './data-list.component.html',
  styleUrls: ['./data-list.component.css']
})
export class DataListComponent implements OnInit, OnDestroy {

  @Input()
  public dataReview!: FormGroup;

  staffDataList!: StaffBulk[];
  errorDataList!: CustomErrorModal[];
  subscription!: Subscription;

  items!: unknown[];

  

  public gridData: StaffBulk[] = this.staffDataList
  //   [{
  //     staffCode: "1",
  //     reportingOfficerCode: "0101",
  //     staffName: "SName001",
  //     userName:"",
  //     phone:"",
  //     email:""
  //   },
  //   {
  //     staffCode: "1",
  //     reportingOfficerCode: "0101",
  //     staffName: "SName001",
  //     userName:"",
  //     phone:"",
  //     email:""
  //   },
  //   {
  //     staffCode: "1",
  //     reportingOfficerCode: "0101",
  //     staffName: "SName001",
  //     userName:"",
  //     phone:"",
  //     email:""
  //   },
  // ];

  constructor(private data: SharedService) { }

  

  ngOnInit(): void {
    this.subscription = this.data.currentList.subscribe(d => this.staffDataList = d)
    this.subscription = this.data.currentErrorList.subscribe(d=>this.errorDataList = d)
    this.gridData = this.staffDataList
    console.log(this.staffDataList)
    console.log(this.errorDataList)
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
