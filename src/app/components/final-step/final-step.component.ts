import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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

  @Output() loaderAtSubmitEvent = new EventEmitter<boolean>();

  constructor(private data: SharedService, private staffService: StaffService) { }

  ngOnInit(): void {
    this.dataToSubmitSubscription = this.data.currentStaffListToSubmit.subscribe(d => this.staffDataListToSubmit = d)
  }

  ngOnDestroy() {
    this.dataToSubmitSubscription.unsubscribe();
  }
  uploadStaffData(authKey:string, subscrKey:string) {
    console.log(this.staffDataListToSubmit)
    this.staffService.AddFlexStaffBulk(this.staffDataListToSubmit,true,this.staffDataListToSubmit.length,this.staffDataListToSubmit.length,1,"true")
      .subscribe((res:any) => {
        console.log(res)
        this.responseMessage = "Data Uploaded Successfully!"
        this.responseTitle = res.Status
        this.loaderAtSubmitEvent.emit(false);
        if(res.code === 200){
          this.showSuccessMsg = true
        }
        else{
          this.showErrorMsg = true
        }
      },
        (error: HttpErrorResponse) => {
          console.log(error)
          this.showErrorMsg = true
          this.responseMessage = ""
          this.responseTitle = ""
          
        });
  }
}
