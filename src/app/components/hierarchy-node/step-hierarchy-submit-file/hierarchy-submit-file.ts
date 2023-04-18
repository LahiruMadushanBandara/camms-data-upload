import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { interval, Subscription } from 'rxjs';
import { ApiAuth } from 'src/app/models/apiauth.model';
import { HierarchyNode } from 'src/app/models/HierarchyNode.model';
import { HierarchySharedService } from 'src/app/services/hierarchy-upload-shared.service';
import { HierarchyService } from 'src/app/services/hierarchy.service';
import { ModalResponseMessageComponent } from '../../blocks/modal-response-message/modal-response-message.component';
import { environment } from 'src/environments/environment';


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
  HierarchySubscriptionKey : string = "";
  AuthToken:string="";
  
  @Input() orgHierarchyId : string = "";
  
  @Input()
  public dataSubmit!: FormGroup;

  @Output() loaderAtSubmitEvent = new EventEmitter<boolean>();
  @Output() SubmittedSuccess = new EventEmitter<boolean>();

  @ViewChild('modal', { static: false })
  modal!: ModalResponseMessageComponent;


  constructor(private data: HierarchySharedService, private hierarchyService: HierarchyService) { }

  ngOnInit(): void {
    
    this.AuthToken = environment.AuthToken;
    this.HierarchySubscriptionKey = environment.HierarchySubscriptionKey;

    this.dataToSubmitSubscription = this.data.currentHierarchyListToSubmit.subscribe(d => this.hierarchyDataListToSubmit = d)

    this.hierarchyService
        .GetHierarchy(this.HierarchySubscriptionKey, this.AuthToken)
        .subscribe((d:any)=>{
          let hierarchies: [] = d.data;
          let orgHierarchy:any = hierarchies.find((obj:any) => obj.name === "ORG Hierarchy");
          this.orgHierarchyId = orgHierarchy.hierarchyId;
        })
    
  }

  ngOnDestroy() {
    this.dataToSubmitSubscription.unsubscribe();
  }

  closeWindow(status:boolean){
    this.SubmittedSuccess.emit(status);
  }

  closeResponseMsg(){

  }

  uploadHierarchyData(formData:any) {
    debugger;

    let data = new ApiAuth();
    data.AuthToken = environment.AuthToken;
    data.HierarchySubscriptionKey = environment.HierarchySubscriptionKey;
    
    
    let hierarchyNodeCount = this.hierarchyDataListToSubmit.length;
    this.hierarchyService.CreateHierarchyNode(data,this.hierarchyDataListToSubmit,true,hierarchyNodeCount,hierarchyNodeCount,1,this.orgHierarchyId)
      .subscribe((res:any) => {
        this.responseTitle = res.Status
        this.loaderAtSubmitEvent.emit(false);
        if(res.errordata.length === 0){
          this.responseMessage = "Success"
          this.showSuccessMsg = true
          this.confirmationDialogMsg = "Data Uploaded Successfully!"
          this.modal.open();
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
