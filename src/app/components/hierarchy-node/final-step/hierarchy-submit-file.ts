import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { interval, Subscription } from 'rxjs';
import { ApiAuth } from 'src/app/models/apiauth.model';
import { HierarchyNode } from 'src/app/models/HierarchyNode.model';
import { HierarchySharedService } from 'src/app/services/hierarchy-upload-shared.service';
import { HierarchyService } from 'src/app/services/hierarchy.service';

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

  @Input()
  public dataSubmit!: FormGroup;

  @Output() loaderAtSubmitEvent = new EventEmitter<boolean>();
  @Output() SubmittedSuccess = new EventEmitter<boolean>();


  constructor(private data: HierarchySharedService, private hierarchyService: HierarchyService) { }

  ngOnInit(): void {
    this.dataToSubmitSubscription = this.data.currentHierarchyListToSubmit.subscribe(d => this.hierarchyDataListToSubmit = d)
  }

  ngOnDestroy() {
    this.dataToSubmitSubscription.unsubscribe();
  }
  uploadHierarchyData(formData:any) {

    let data = new ApiAuth();
    data.AuthToken = JSON.parse(localStorage.getItem('auth-token')!)
    data.SubscriptionKey = JSON.parse(localStorage.getItem('HierarchySubscriptionKey')!)
    console.log(data)
    
    let hierarchyNodeCount = this.hierarchyDataListToSubmit.length;
    this.hierarchyService.CreateHierarchyNode(data,this.hierarchyDataListToSubmit,true,hierarchyNodeCount,hierarchyNodeCount,1)
      .subscribe((res:any) => {
        console.log(res)
        this.responseTitle = res.Status
        this.loaderAtSubmitEvent.emit(false);
        if(res.errordata.length === 0){
          this.responseMessage = "Data Uploaded Successfully!"
          this.showSuccessMsg = true
          if(confirm("Data Uploaded Successfully. Do you want to close the window?")){
            this.SubmittedSuccess.emit(true);
        }
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
          console.log(error)
          this.showErrorMsg = true
          this.responseMessage = error.message
          this.responseTitle = ""
        });
  }

}
