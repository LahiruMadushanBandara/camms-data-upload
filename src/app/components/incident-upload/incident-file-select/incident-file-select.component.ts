import {
  Component,
  DoCheck,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { WorkFlowFields } from 'src/app/models/WorkFlowFields.model';
import { IncidentService } from 'src/app/services/incident.service';

@Component({
  selector: 'app-incident-file-select',
  templateUrl: './incident-file-select.component.html',
  styleUrls: ['./incident-file-select.component.css'],
})
export class IncidentFileSelectComponent implements OnInit, DoCheck {
  @ViewChild('fileInputSelect', { static: true }) fileInputSelect!: ElementRef;
  @Output() newItemEvent = new EventEmitter<Boolean>();

  public loaderVisible = false;
  public showErrorCard = false;
  public isIconShow = false;
  public disabledUploadBtn = true;
  public showSelectBtn = true;
  public selectedWorkFlowId?: number;
  changefileSelectBackground = false;
  public showFileSuccessMessage = false;
  IsFileHasValidData = false;
  public workFlowList: Array<WorkFlowFields> = [];
  public controlNgDoCheck?: number;
  public loaderForDropDown = true;
  public disableDropDown = true;
  public pageSize = 1;
  public name = 'pasindu';
  public workFlowListForFilter: Array<WorkFlowFields> = [];
  public isNotIncidentObjectAvailable?: boolean;

  public workflowElementId?: number;

  showFileIcon = false;
  showFileInputCloseBtn = false;
  fileToUpload: File | null = null;

  incidentSubscriptionKey: string = '';
  authToken: string = '';

  constructor(private incidentService: IncidentService) {}
  ngDoCheck(): void {
    if (
      this.selectedWorkFlowId &&
      this.selectedWorkFlowId !== this.controlNgDoCheck
    ) {
      //for development
      this.isNotIncidentObjectAvailable = undefined;

      console.log(this.selectedWorkFlowId);
      this.controlNgDoCheck = this.selectedWorkFlowId;
      this.GetWorkFlowElements(this.selectedWorkFlowId);
    }
  }

  ngOnInit(): void {
    this.authToken = JSON.parse(localStorage.getItem('auth-token')!);
    this.incidentSubscriptionKey = JSON.parse(
      localStorage.getItem('incident-subscription-key')!
    );
    this.GetWorkFlowList();
  }

  //GetWork flow list
  GetWorkFlowList() {
    this.incidentService
      .getWorkFlowList(
        this.incidentSubscriptionKey,
        this.authToken,
        this.pageSize
      )
      .subscribe({
        next: (res: any) => (this.pageSize = res.totalRowCount),

        error: (error) => console.log(error),

        complete: () => {
          this.incidentService
            .getWorkFlowList(
              this.incidentSubscriptionKey,
              this.authToken,
              this.pageSize
            )
            .subscribe({
              next: (res: any) => {
                res.data.forEach((x: WorkFlowFields) => {
                  this.workFlowList.push({
                    workflowId: x.workflowId,
                    workflowName: x.workflowName,
                  });
                });
              },

              error: (error) => {
                console.log(error);
              },

              complete: () => {
                this.loaderForDropDown = false;
                this.disableDropDown = false;
                this.workFlowListForFilter = this.workFlowList.slice();
              },
            });
        },
      });
  }

  //to get object(IncidentObjct) useing selectedWorkFlowId
  GetWorkFlowElements(workflowId: number) {
    this.incidentService
      .getWorkFlowElements(
        this.incidentSubscriptionKey,
        this.authToken,
        workflowId
      )
      .subscribe({
        next: (res: any) => {
          res.data.forEach((x: any) => {
            console.log(x);
            if (x.name === 'IncidentObject' && x.isStandardObject === true) {
              this.workflowElementId = x.workflowElementId;
              console.log(x.workflowElementId);

              //for development
              this.isNotIncidentObjectAvailable = false;
            }
          });
        },

        error: (error) => console.log(error),

        complete: () => {
          if (this.isNotIncidentObjectAvailable != false) {
            //for development
            this.isNotIncidentObjectAvailable = true;
          }
        },
      });
  }

  //dropdown Filter
  handleFilter(value: string) {
    this.workFlowListForFilter = this.workFlowList.filter(
      (s) => s.workflowName.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }

  //Downlode xl file
  GetIncidentDetails() {
    this.loaderVisible = true;
    let IncidentCodes: any = [];

    let headerList = [
      'Hierarchy Code',
      'Description',
      'Parent Node',
      'Responsible Person',
    ];
  }

  changeNextButtonBehavior(value: Boolean) {
    this.newItemEvent.emit(value);
  }

  clearSelectedFile() {
    this.fileInputSelect.nativeElement.value = 'Please Select';
    this.showFileIcon = false;
    this.showErrorCard = false;
    this.isIconShow = false;
    this.disabledUploadBtn = true;
    this.IsFileHasValidData = false;
    this.showSelectBtn = true;
    this.showFileSuccessMessage = false;
    this.changefileSelectBackground = false;
    this.fileToUpload = null;
    this.changeNextButtonBehavior(true);
  }

  onFileChange(e: any) {
    console.log('more Content to write');
  }
  onClickFileInputButton() {
    console.log('more Content to write');
  }
}
