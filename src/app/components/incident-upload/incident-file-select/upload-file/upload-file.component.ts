import {
  ChangeDetectorRef,
  Component,
  DoCheck,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { Workbook } from 'exceljs';
import { WorkFlowFields } from 'src/app/models/WorkFlowFields.model';
import { removeSymbolsAndSpaces } from 'src/app/utils/removeSymbolsAndSpaces';
import { uploadValidationClass } from '../utils/uploadValidationClass/uploadValidationClass';
import { fieldsValidationClass } from '../utils/fieldsValidatingClass/fieldsValidationClass';
import { IncidentService } from 'src/app/services/incident.service';
import { workFlowClass } from '../utils/workFlowClass/workFlowClass';
import { WorkflowElementInfo } from 'src/app/models/WorkflowElementInfo.model';

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.css'],
})
export class UploadFileComponent implements OnInit, DoCheck, OnChanges {
  @Output() newItemEvent = new EventEmitter<Boolean>();

  @ViewChild('fileInputSelect', { static: false })
  fileInputSelect!: ElementRef;
  @Input() workFlowListForFilter: Array<WorkFlowFields> = [];
  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private incidentService: IncidentService
  ) {}
  previousValue: Array<WorkFlowFields> = [];
  currentValue: Array<WorkFlowFields> = [];
  display = false;
  //upload file
  public loaderForDropDown = true;
  public showClearButton: boolean = false;
  public selectedWorkFlowIdForUpload: number = -1;
  public controlNgDoCheckForUploadWorkFlowId?: number;
  public showSelectBtn = true;
  public showErrorCard = false;
  public disabledUploadBtn = true;
  public isIconShow = false;
  public showFileSuccessMessage = false;
  public disableDropDown = true;
  private selectedWorkFlowName: string = '';
  private extractedWorkFlowName: string = '';
  changefileSelectBackground = false;
  IsFileHasValidData = false;
  showFileIcon = false;
  showFileInputCloseBtn = false;
  fileToUpload: File | null = null;
  public workFlowListForFilter1: Array<WorkFlowFields> = [];
  private workflowElementInfo: Array<WorkflowElementInfo> = [];

  ngOnInit(): void {}

  ngDoCheck(): void {
    if (this.selectedWorkFlowName != '') {
    }
    if (
      this.selectedWorkFlowIdForUpload &&
      this.selectedWorkFlowIdForUpload !=
        this.controlNgDoCheckForUploadWorkFlowId
    ) {
      this.disabledUploadBtn = true;
      this.showSelectBtn = true;
      //get selected workflowname for file name
      this.workFlowListForFilter.forEach((x: WorkFlowFields) => {
        if (x.workflowId == this.selectedWorkFlowIdForUpload) {
          this.selectedWorkFlowName = x.workflowName;
          console.log(this.selectedWorkFlowName);
          this.extractedWorkFlowName = removeSymbolsAndSpaces(
            this.selectedWorkFlowName
          );
        }
      });
      const workFlow = new workFlowClass(this.incidentService);

      this.workFlowListForFilter1 = workFlow.workFlowList;
      if (this.selectedWorkFlowIdForUpload > 0) {
        workFlow.GetWorkFlowElements(this.selectedWorkFlowIdForUpload);
      }

      this.workflowElementInfo = workFlow.workflowElementInfo;
      console.log(this.workflowElementInfo);
      this.clearSelectedFile();
      this.controlNgDoCheckForUploadWorkFlowId =
        this.selectedWorkFlowIdForUpload;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['workFlowListForFilter']) {
      this.previousValue = changes['workFlowListForFilter'].previousValue;
      this.currentValue = changes['workFlowListForFilter'].currentValue;
    }
    if (this.currentValue.length > 0) {
      this.loaderForDropDown = false;
      this.disableDropDown = false;
    }
  }

  //upload
  async onFileChange(e: any) {
    // fildValidation.getFinalArray();
    const workbook = new Workbook();
    this.changeDetectorRef.detectChanges();
    console.log(this.fileInputSelect);
    this.fileInputSelect.nativeElement.value = e.target.files[0].name;
    this.fileToUpload = e.target.files.item(0);

    this.showFileInputCloseBtn = true;
    this.fileToUpload?.arrayBuffer()?.then((data) => {
      workbook.xlsx.load(data).then((x) => {
        let worksheet = workbook.getWorksheet(1);

        const HeaderRow = worksheet.getRow(1);
        let rowCount = 0;
        worksheet.eachRow({ includeEmpty: false }, function (row, rowNumber) {
          rowCount = rowNumber;
        });
        console.log(HeaderRow.getCell(3).value);
        console.log(rowCount);
        console.log(worksheet.name);
        console.log(this.extractedWorkFlowName);

        if (
          HeaderRow.getCell(3).value === null ||
          rowCount <= 1 ||
          worksheet.name !== this.extractedWorkFlowName ||
          HeaderRow.getCell(1).value !== 'Code'
        ) {
          this.IsFileHasValidData = false;
          this.showErrorCard = true;
          this.changefileSelectBackground = false;
        } else {
          this.IsFileHasValidData = true;
          this.showErrorCard = false;
          this.showSelectBtn = false;
          this.changefileSelectBackground = true;
        }

        this.showFileIcon = true;

        if (this.IsFileHasValidData) {
          this.disabledUploadBtn = false;
        } else {
          this.disabledUploadBtn = true;
        }
      });
      this.showClearButton = true;
    });
  }

  clearSelectedFile() {
    if (this.selectedWorkFlowIdForUpload > -1) {
      this.changeDetectorRef.detectChanges();
      this.fileInputSelect.nativeElement.value = 'Please Select';
    }
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
  changeNextButtonBehavior(value: Boolean) {
    this.newItemEvent.emit(value);
  }
  //dropdown Filter
  handleFilter(value: string) {
    // this.workFlowListForFilter = this.workFlowList.filter(
    //   (s) => s.workflowName.toLowerCase().indexOf(value.toLowerCase()) !== -1
    // );
  }

  onClickFileInputButton() {
    const uploadFileValidation = new uploadValidationClass();

    uploadFileValidation.readExcel({}, this.fileToUpload?.arrayBuffer());
  }
}
