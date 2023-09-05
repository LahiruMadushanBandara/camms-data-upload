import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { HierarchyNode } from 'src/app/models/HierarchyNode.model';
import { ExcelService } from 'src/app/services/excel.service';
import { HierarchySharedService } from 'src/app/services/hierarchy-upload-shared.service';

@Component({
  selector: 'app-hierarchy-validate-data',
  templateUrl: './hierarchy-validate-data.html',
  styleUrls: ['./hierarchy-validate-data.css'],
})
export class HierarchyValidateDataComponent implements OnInit {
  @Output() newItemEvent = new EventEmitter<Boolean>();
  @Output() nextButtonEventEmit = new EventEmitter<Boolean>();
  NextButtonDisabled!: Boolean;

  @Input()
  public dataReview!: FormGroup;

  hierarchyNodeList!: HierarchyNode[];
  hierarchyNodeListToSubmit!: HierarchyNode[];
  errorDataList!: any[];
  subscription!: Subscription;
  dataToSubmitSubscription!: Subscription;
  errorRowCount = 0;
  errorMessage: string[] = [];

  public gridData: HierarchyNode[] = this.hierarchyNodeList;

  constructor(
    private hierarchySharedService: HierarchySharedService,
    private excelService: ExcelService
  ) {}

  ngOnInit(): void {
    this.subscription =
      this.hierarchySharedService.currentHierarchyList.subscribe(
        (d) => (this.hierarchyNodeList = d)
      );
    this.subscription =
      this.hierarchySharedService.currentHierarchyErrorList.subscribe(
        (d) => (this.errorDataList = d)
      );

    this.dataToSubmitSubscription =
      this.hierarchySharedService.currentHierarchyListToSubmit.subscribe(
        (d) => (this.hierarchyNodeListToSubmit = d)
      );
    this.gridData = this.hierarchyNodeList;
    if (this.errorDataList.length > 0) {
      this.nextButtonEventEmit.emit(true);
      this.changeNextButtonBehavior(true);
      this.createErrorMessage(this.errorDataList);
    }

    this.errorRowCount = this.errorDataList
      .map((v) => v.RowNo)
      .filter((v, i, vIds) => vIds.indexOf(v) === i)
      .filter(function (el) {
        return el != '';
      }).length;
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.dataToSubmitSubscription.unsubscribe();
  }
  sendDataToSubmit(): void {
    this.hierarchySharedService.sendDataListToSubmit(this.hierarchyNodeList);
  }
  exportErrors() {
    this.excelService.exportAsExcelFile(this.errorDataList, 'error-report');
  }
  changeNextButtonBehavior(value: Boolean) {
    this.newItemEvent.emit(value);
  }

  private createErrorMessage(errorDataList: any[]) {
    errorDataList.forEach((err, indexOf) => {
      if (
        err.ErrorMessage != '' &&
        err.ExpectedType != '' &&
        err.Column == '' &&
        err.RowNo == '' &&
        err.ValueEntered == ''
      ) {
        this.errorMessage.push(
          `${err.ErrorMessage}, Expected Data  "${err.ExpectedType}"`
        );
      } else if (
        err.ErrorMessage != '' &&
        err.ExpectedType != '' &&
        err.Column != '' &&
        err.RowNo != '' &&
        err.ValueEntered == ''
      ) {
        this.errorMessage.push(
          `${err.ErrorMessage} at row "${err.RowNo}" Column "${err.Column}" Expected Data Type "${err.ExpectedType}"`
        );
      } else {
        this.errorMessage.push(
          `${err.ErrorMessage} "${err.ValueEntered}" at row "${err.RowNo}" Column "${err.Column}" Expected Data Type "${err.ExpectedType}"`
        );
      }
    });
  }
}
