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

@Component({
  selector: 'app-incident-file-submit',
  templateUrl: './incident-file-submit.component.html',
  styleUrls: ['./incident-file-submit.component.css'],
})
export class IncidentFileSubmitComponent implements OnInit {
  hierarchyDataListToSubmit!: HierarchyNode[];
  dataToSubmitSubscription!: Subscription;

  showErrorMsg = false;
  showSuccessMsg = false;
  responseMessage!: string;
  responseTitle!: string;
  APIErrorList: any[] = [];
  openConfirmationMessage = false;
  IsWindowOpen = false;
  confirmationDialogMsg = '';

  @Input() public dataSubmit!: FormGroup;

  @Output() loaderAtSubmitEvent = new EventEmitter<boolean>();
  @Output() SubmittedSuccess = new EventEmitter<boolean>();

  @ViewChild('myModal', { static: false })
  modalMessage!: ModalResponseMessageComponent;

  constructor(
    private data: HierarchySharedService,
    private hierarchyService: HierarchyService
  ) {}

  ngOnInit(): void {
    this.dataToSubmitSubscription =
      this.data.currentHierarchyListToSubmit.subscribe(
        (d) => (this.hierarchyDataListToSubmit = d)
      );
  }

  ngOnDestroy() {
    this.dataToSubmitSubscription.unsubscribe();
  }

  closeWindow(status: boolean) {
    this.SubmittedSuccess.emit(status);
  }

  closeResponseMsg() {}

  uploadHierarchyData(formData: any) {
    
  }
}
