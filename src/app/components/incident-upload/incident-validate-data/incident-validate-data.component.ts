import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { HierarchyNode } from 'src/app/models/HierarchyNode.model';

@Component({
  selector: 'app-incident-validate-data',
  templateUrl: './incident-validate-data.component.html',
  styleUrls: ['./incident-validate-data.component.css'],
})
export class IncidentValidateDataComponent implements OnInit {
  @Output() nextButtonEventEmit = new EventEmitter<Boolean>();
  NextButtonDisabled!: Boolean;

  @Input() public dataReview!: FormGroup;

  hierarchyNodeList!: HierarchyNode[];
  hierarchyNodeListToSubmit!: HierarchyNode[];
  errorDataList!: any[];
  subscription!: Subscription;
  dataToSubmitSubscription!: Subscription;
  errorRowCount = 0;

  public gridData: HierarchyNode[] = this.hierarchyNodeList;

  constructor() {}

  ngOnInit(): void {}
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.dataToSubmitSubscription.unsubscribe();
  }
  sendDataToSubmit(): void {}
  exportErrors() {}
}
