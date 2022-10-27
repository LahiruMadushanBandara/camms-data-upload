

import { AfterViewInit, Component, Input, ViewChild } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { StaffService } from "src/app/services/staff.service";


@Component({
  selector: "account-details",
  templateUrl:'./account-details.component.html'
})
export class AccountDetailsComponent implements AfterViewInit {
  public uploadSaveUrl = "saveUrl"; // should represent an actual API endpoint
  public uploadRemoveUrl = "removeUrl"; // should represent an actual API endpoint


  @Input()
  public accountDetails!: FormGroup;
  @Input()
  public showApiDetailsError = false;
  @Input()
  public msg!:string;

  constructor(private staffService: StaffService){

  }
  

  public ngAfterViewInit(): void {
    
  }
  deleteEmployees(){
    for(var i = 4900;i<5100;i++){
      this.staffService.DeleteEmployees(i.toString()).subscribe((d:any)=>{
        console.log(d)
      })
    }
  }
  
}
