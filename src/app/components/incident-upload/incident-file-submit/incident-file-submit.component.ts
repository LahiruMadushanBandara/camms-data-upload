import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ApiAuth } from 'src/app/models/apiauth.model';
import { HierarchyNode } from 'src/app/models/HierarchyNode.model';
import { HierarchySharedService } from 'src/app/services/hierarchy-upload-shared.service';
import { HierarchyService } from 'src/app/services/hierarchy.service';
import { ModalResponseMessageComponent } from '../../blocks/modal-response-message/modal-response-message.component';
import { IncidentUploadSharedService } from 'src/app/services/incident-upload-shared.service';
import { IncidentService } from 'src/app/services/incident.service';
import { workflowElementInfoWithRow } from '../incident-file-select/utils/uploadValidationClass/models/workflowElementInfoWithRow.model';
import { columns } from './models/columns.model';

@Component({
  selector: 'app-incident-file-submit',
  templateUrl: './incident-file-submit.component.html',
  styleUrls: ['./incident-file-submit.component.css'],
})
export class IncidentFileSubmitComponent implements OnInit {
  incidentDataListToSubmit!: any[];
  dataToSubmitSubscription!: Subscription;

  fieldInfo!: workflowElementInfoWithRow[];
  headers: string[] = [];
  fieldInfoSubscription!: Subscription;
  constructor(
    private data: IncidentUploadSharedService,
    private incidentService: IncidentService
  ) {}
  public col: columns[] = [];
  ngOnInit(): void {
    this.dataToSubmitSubscription =
      this.data.currentIncidentListToSubmit.subscribe(
        (d) => (this.incidentDataListToSubmit = d)
      );

    this.fieldInfoSubscription = this.data.currentFieldInfo.subscribe(
      (d) => (this.fieldInfo = d)
    );

    this.fieldInfo.forEach((x) =>
      this.col.push({
        field: x.propertyDisplayText,
        width:
          x.propertyDisplayText.length < 10
            ? (x.propertyDisplayText.length + 5) * 10
            : x.propertyDisplayText.length * 10,
      })
    );
  }
  public groupedColumns = [
    {
      title: 'All',
      width: 500,
      isGroup: false,
      columns: this.col,
    },
  ];
}
