import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit, Output } from '@angular/core';
import { ApiAuth } from 'src/app/models/apiauth.model';
import { HierarchyNode } from 'src/app/models/HierarchyNode.model';
import { HierarchyService } from 'src/app/services/hierarchy.service';

@Component({
  selector: 'app-editTopNodeStep',
  templateUrl: './edit-top-node-step.component.html',
  styleUrls: ['./edit-top-node-step.component.css']
})
export class EditTopNodeStepComponent implements OnInit {
  subsKey = '';
  authToken = '';
  authKeys = new ApiAuth();

  constructor(private hierarchyService:HierarchyService) { }

  public isReLableTopNode = false;
  loaderVisible = false;
  showFileSuccessMessage = false;
  showErrorMsg = false;
  responseMessage = '';
  
  hierarchyDataListToSubmit:HierarchyNode[] = [];

  @Input() topNode!:HierarchyNode;

  ngOnInit(): void {

    this.authKeys.AuthToken = JSON.parse(localStorage.getItem('auth-token')!)
    this.authKeys.SubscriptionKey = JSON.parse(localStorage.getItem('HierarchySubscriptionKey')!)
    
  }

  editTopNodeName = () => {
      this.loaderVisible = true;
      console.log(this.topNode)
      this.hierarchyDataListToSubmit.push(this.topNode)

      this.hierarchyService.CreateHierarchyNode(this.authKeys, this.hierarchyDataListToSubmit, true, 1, 1, 1)
      .subscribe((res:any) => {
        console.log(res)
        if(res.errordata.length === 0){
          this.responseMessage = "Top Node Edited Successfully!"
          this.showFileSuccessMessage = true
          this.loaderVisible = false;
        }
      },
        (error: HttpErrorResponse) => {
          console.log(error)
          this.responseMessage = error.message
          this.showErrorMsg = true
          this.loaderVisible = false;
        });
      }
}
