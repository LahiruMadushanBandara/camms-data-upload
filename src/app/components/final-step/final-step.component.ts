import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DataService } from '@progress/kendo-angular-dropdowns/common/data.service';
import { Subscription } from 'rxjs';
import { StaffBulk } from 'src/app/models/StaffBulk.model';
import { SharedService } from 'src/app/services/shared.service';
import { StaffService } from 'src/app/services/staff.service';

@Component({
  selector: 'app-final-step',
  templateUrl: './final-step.component.html',
  styleUrls: ['./final-step.component.css']
})
export class FinalStepComponent implements OnInit {
  staffDataListToSubmit!: StaffBulk[];
  dataToSubmitSubscription!: Subscription;

  showErrorMsg = false;
  showSuccessMsg = false;
  responseMessage!:string;
  responseTitle!:string;

  @Input()
  public dataSubmit!: FormGroup;

  constructor(private data: SharedService, private staffService: StaffService) { }

  ngOnInit(): void {
    this.dataToSubmitSubscription = this.data.currentStaffListToSubmit.subscribe(d => this.staffDataListToSubmit = d)
  }

  ngOnDestroy() {
    this.dataToSubmitSubscription.unsubscribe();
  }
  uploadStaffData(authKey:string, subscrKey:string) {
    this.staffService.AddFlexStaffBulk(authKey,subscrKey, this.staffDataListToSubmit,true,this.staffDataListToSubmit.length,this.staffDataListToSubmit.length,1,"true")
      .subscribe((res:any) => {
        this.responseMessage = res.Data
        this.responseTitle = res.Status
        if(res.Code === 200){
          this.showSuccessMsg = true
        }
        else{
          this.showErrorMsg = true
        }
      },
        (error: HttpErrorResponse) => {
          this.showErrorMsg = true
          this.responseMessage = error.message
          this.responseTitle = error.name
          console.log(this.responseMessage)
        });
  }
}
