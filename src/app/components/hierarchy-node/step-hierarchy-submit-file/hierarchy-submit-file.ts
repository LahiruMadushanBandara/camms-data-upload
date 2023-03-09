import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { interval, Subscription } from 'rxjs';
import { ApiAuth } from 'src/app/models/apiauth.model';
import { HierarchyNode } from 'src/app/models/HierarchyNode.model';
import { HierarchySharedService } from 'src/app/services/hierarchy-upload-shared.service';
import { HierarchyService } from 'src/app/services/hierarchy.service';
import { ModalResponseMessageComponent } from '../../blocks/modal-response-message/modal-response-message.component';

@Component({
  selector: 'app-hierarchy-submit-file',
  templateUrl: './hierarchy-submit-file.html',
  styleUrls: ['./hierarchy-submit-file.css']
})
export class HierarchySubmitFileComponent implements OnInit {

  hierarchyDataListToSubmit!: HierarchyNode[];
  dataToSubmitSubscription!: Subscription;

  showErrorMsg = false;
  showSuccessMsg = false;
  responseMessage!:string;
  responseTitle!:string;
  APIErrorList:any[] = [];
  openConfirmationMessage = false;
  IsWindowOpen = false;
  confirmationDialogMsg = "";

  @Input()
  public dataSubmit!: FormGroup;

  @Output() loaderAtSubmitEvent = new EventEmitter<boolean>();
  @Output() SubmittedSuccess = new EventEmitter<boolean>();

  @ViewChild('modalMessage', { static: false })
  modalMessage!: ModalResponseMessageComponent;


  constructor(private data: HierarchySharedService, private hierarchyService: HierarchyService) { }

  ngOnInit(): void {
    this.dataToSubmitSubscription = this.data.currentHierarchyListToSubmit.subscribe(d => this.hierarchyDataListToSubmit = d)
  }

  ngOnDestroy() {
    this.dataToSubmitSubscription.unsubscribe();
  }

  closeWindow(status:boolean){
    this.SubmittedSuccess.emit(status);
  }
  uploadHierarchyData(formData:any) {

    let data = new ApiAuth();
    data.AuthToken = JSON.parse(localStorage.getItem('auth-token')!)
    data.HierarchySubscriptionKey = JSON.parse(localStorage.getItem('hierarchy-subscription-key')!)
    
    
    let hierarchyNodeCount = this.hierarchyDataListToSubmit.length;
    this.hierarchyService.CreateHierarchyNode(data,this.hierarchyDataListToSubmit,true,hierarchyNodeCount,hierarchyNodeCount,1)
      .subscribe((res:any) => {
        this.responseTitle = res.Status
        this.loaderAtSubmitEvent.emit(false);
        if(res.errordata.length === 0){
          this.responseMessage = "Data Uploaded Successfully!"
          this.showSuccessMsg = true
          this.confirmationDialogMsg = "Data Uploaded Successfully. Do you want to close the window?"
          this.openConfirmationMessage = true;
          this.modalMessage.open();
        }
        else if(res.errordata.length > 0){
          res.errordata.forEach((e:any) => {
            let a = {
              data:e.id,
              message:e.message
            }
            this.APIErrorList.push(a);
          });
        }
      },
        (error: HttpErrorResponse) => {
          this.showErrorMsg = true
          this.responseMessage = error.message
          this.responseTitle = ""
        });
  }

}
