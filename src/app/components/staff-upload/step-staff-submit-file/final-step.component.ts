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
import { StaffBulk } from 'src/app/models/StaffBulk.model';
import { SharedService } from 'src/app/services/shared.service';
import { ExcelService } from 'src/app/services/excel.service';
@Component({
  selector: 'app-final-step',
  templateUrl: './final-step.component.html',
  styleUrls: ['./final-step.component.css'],
})
export class FinalStepComponent implements OnInit {
  @Input() uploadResultDetails: any;
  staffDataListToSubmit!: StaffBulk[];
  dataToSubmitSubscription!: Subscription;
  public isUploadSuccess = false;
  APIErrorList: any[] = [];

  @Input()
  public dataSubmit!: FormGroup;

  @Output() SubmittedSuccess = new EventEmitter<boolean>();

  constructor(
    private excelService: ExcelService,
    private data: SharedService
  ) {}

  ngOnInit(): void {
    if (this.uploadResultDetails == 'Success') {
      this.isUploadSuccess = true;
    } else {
      this.isUploadSuccess = false;
      this.APIErrorList = this.uploadResultDetails;
    }
  }

  ngOnDestroy() {}

  closeWindow(status: boolean) {
    this.SubmittedSuccess.emit(status);
  }

  exportErrors() {
    this.excelService.exportAsExcelFile(this.APIErrorList, 'api-error-report');
  }
}
