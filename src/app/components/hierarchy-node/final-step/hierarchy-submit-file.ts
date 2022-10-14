import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { interval, Subscription } from 'rxjs';
import { ApiAuth } from 'src/app/models/apiauth.model';
import { HierarchyNode } from 'src/app/models/HierarchyNode.model';
import { SharedService } from 'src/app/services/hierarchy-upload-shared.service';
import { StaffService } from 'src/app/services/staff.service';

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


  constructor(private data: SharedService, private staffService: StaffService) { }

  ngOnInit(): void {
    this.dataToSubmitSubscription = this.data.currentHierarchyListToSubmit.subscribe(d => this.hierarchyDataListToSubmit = d)
  }

  ngOnDestroy() {
    this.dataToSubmitSubscription.unsubscribe();
  }
  uploadHierarchyData(formData:any) {
    console.log(formData)
    let data = new ApiAuth();
    data.AuthToken = formData.authToken;
    data.SubscriptionKey = formData.subscriptionKey;
    console.log(data)
    this.staffService.AddFlexStaffBulk(data,this.hierarchyDataListToSubmit,true,this.hierarchyDataListToSubmit.length,this.hierarchyDataListToSubmit.length,1,"true")
      .subscribe((res:any) => {
        console.log(res)
        this.responseTitle = res.Status
        this.loaderAtSubmitEvent.emit(false);
        if(res.code === 200){
          this.responseMessage = "Data Uploaded Successfully!"
          this.showSuccessMsg = true
          interval(800).subscribe(x => {
            this.SubmittedSuccess.emit(true);
          });
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
