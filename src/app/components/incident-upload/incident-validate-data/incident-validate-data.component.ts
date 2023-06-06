import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { Subscription } from 'rxjs';
import { HierarchyNode } from 'src/app/models/HierarchyNode.model';
import { ExcelService } from 'src/app/services/excel.service';
import { IncidentUploadSharedService } from 'src/app/services/incident-upload-shared.service';

@Component({
  selector: 'app-incident-validate-data',
  templateUrl: './incident-validate-data.component.html',
  styleUrls: ['./incident-validate-data.component.css'],
})
export class IncidentValidateDataComponent implements OnInit {
  @Output() newItemEvent = new EventEmitter<Boolean>();
  NextButtonDisabled!: Boolean;

  @Output() showNextBtnLoader = new EventEmitter<Boolean>();

  incidentDataList!: any[];
  incidentDataListToSubmit!: any[];
  errorDataList!: any[];
  subscription!: Subscription;
  dataToSubmitSubscription!: Subscription;
  errorRowCount = 0;

  public gridData: any[] = this.incidentDataList;

  changeNextButtonBehavior(value: Boolean) {
    this.newItemEvent.emit(value);
  }

  constructor(
    private data: IncidentUploadSharedService,
    private excelService: ExcelService
  ) {}

  ngOnInit(): void {
    this.subscription = this.data.currentList.subscribe(
      (d) => (this.incidentDataList = d)
    );
    this.subscription = this.data.currentErrorList.subscribe(
      (d) => (this.errorDataList = d)
    );

    this.dataToSubmitSubscription =
      this.data.currentIncidentListToSubmit.subscribe(
        (d) => (this.incidentDataListToSubmit = d)
      );
    this.gridData = this.incidentDataList;
    if (this.errorDataList.length > 0) {
      this.changeNextButtonBehavior(true);
    }
    this.errorRowCount = this.errorDataList
      .map((v) => v.RowNo)
      .filter((v, i, vIds) => vIds.indexOf(v) === i)
      .filter(function (el) {
        return el != '';
      }).length;
  }

  ngOnDestroy(): void {
    this.showNextBtnLoader.emit(true);
    this.data.sendDataListToSubmit(this.incidentDataList);
    this.showNextBtnLoader.emit(false);
  }
  sendDataToSubmit(): void {}
  exportErrors() {
    this.excelService.exportAsExcelFile(this.errorDataList, 'error-report');
  }
}
