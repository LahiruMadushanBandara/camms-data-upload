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
import { removeSymbolsAndSpaces } from 'src/app/utils/functions/removeSymbolsAndSpaces';
import { uploadValidationClass } from '../utils/uploadValidationClass/uploadValidationClass';
import { fieldsValidationClass } from '../utils/fieldsValidatingClass/fieldsValidationClass';
import { IncidentService } from 'src/app/services/incident.service';
import { workFlowClass } from '../utils/workFlowClass/workFlowClass';
import { WorkflowElementInfo } from 'src/app/models/WorkflowElementInfo.model';
import { returnExcelCoulmnForNumericValue } from 'src/app/utils/functions/returnExcelCoulmnForNumericValue';
import { IncidentUploadSharedService } from 'src/app/services/incident-upload-shared.service';

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.css'],
})
export class UploadFileComponent implements OnInit, DoCheck, OnChanges {
  @Output() newItemEvent = new EventEmitter<Boolean>();
  @ViewChild('fileInputSelect', { static: false })
  fileInputSelect!: ElementRef;
  @Input() workFlowList: Array<WorkFlowFields> = [];
  previousValue: Array<WorkFlowFields> = [];
  currentValue: Array<WorkFlowFields> = [];
  display = false;
  public workFlowListForFilter: Array<WorkFlowFields> = [];
  private workflowElementInfoFinal: Array<WorkflowElementInfo> = [];
  //upload file
  public uploadErrorTitles: string[] = [];

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
  private workflowElementInfo: Array<WorkflowElementInfo> = [];

  constructor(
    private incidentSharedData: IncidentUploadSharedService,
    private changeDetectorRef: ChangeDetectorRef,
    private incidentService: IncidentService
  ) {}

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
      this.workFlowList.forEach((x: WorkFlowFields) => {
        if (x.workflowId == this.selectedWorkFlowIdForUpload) {
          this.selectedWorkFlowName = x.workflowName;
          console.log(this.selectedWorkFlowName);
          this.extractedWorkFlowName = removeSymbolsAndSpaces(
            this.selectedWorkFlowName
          );
        }
      });
      //get workflow list info using workflow class
      const workFlow = new workFlowClass(this.incidentService);
      if (this.selectedWorkFlowIdForUpload > 0) {
        workFlow.GetWorkFlowElements(this.selectedWorkFlowIdForUpload);
      }

      this.workflowElementInfo = workFlow.workflowElementInfo;
      this.clearSelectedFile();
      this.controlNgDoCheckForUploadWorkFlowId =
        this.selectedWorkFlowIdForUpload;
      this.uploadErrorTitles = [];
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['workFlowList']) {
      this.previousValue = changes['workFlowList'].previousValue;
      this.currentValue = changes['workFlowList'].currentValue;
    }
    if (this.currentValue.length > 0) {
      this.loaderForDropDown = false;
      this.disableDropDown = false;
      this.workFlowListForFilter = this.workFlowList.slice();
    }
  }

  //upload
  async onFileChange(e: any) {
    const fieldsValidation = new fieldsValidationClass();
    this.workflowElementInfoFinal = fieldsValidation.getFinalArray(
      this.workflowElementInfo
    );
    console.log(this.workflowElementInfoFinal);
    console.log('len', this.workflowElementInfoFinal.length);

    const workbook = new Workbook();

    //after condition true in ngif detect changes in dom
    this.changeDetectorRef.detectChanges();
    this.fileInputSelect.nativeElement.value = e.target.files[0].name;
    this.fileToUpload = e.target.files.item(0);

    this.showFileInputCloseBtn = true;

    //get data from uploded file
    this.fileToUpload?.arrayBuffer()?.then((data) => {
      workbook.xlsx.load(data).then((x) => {
        let worksheet = workbook.getWorksheet(1);
        const HeaderRow = worksheet.getRow(1);
        var errorTitles: string[] = [];
        let rowCount = 0;
        worksheet.eachRow({ includeEmpty: false }, function (row, rowNumber) {
          rowCount = rowNumber;
        });
        console.log(HeaderRow.getCell(1).value);
        console.log(rowCount);
        console.log(worksheet.name);
        console.log(this.extractedWorkFlowName);
        var loopcount = 0;
        for (let i = 0; i < this.workflowElementInfoFinal.length; i++) {
          if (
            this.workflowElementInfoFinal[i].propertyDisplayText !=
            HeaderRow.getCell(i + 1).value
          ) {
            errorTitles.push(
              `Header rows of uploded data sheet didn't match with "${this.selectedWorkFlowName}" workFlow`
            );
            break;
          }
        }

        if (worksheet.name !== this.extractedWorkFlowName) {
          errorTitles.push(
            `Uploded data sheet not belongs to  "${this.selectedWorkFlowName}" workFlow`
          );
        }

        if (rowCount <= 1) {
          errorTitles.push(`It seems you have uploaded an empty excel sheet `);
        }

        if (errorTitles.length > 0) {
          this.IsFileHasValidData = false;
          this.showErrorCard = true;
          this.changefileSelectBackground = false;
          console.log('errorTitles', errorTitles);
          this.uploadErrorTitles = errorTitles;
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
    this.showFileInputCloseBtn = false;
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
    console.log('changeNextButtonBehavior-upload ->', value);
  }
  //dropdown Filter
  handleFilter(value: string) {
    this.workFlowListForFilter = this.workFlowList.filter(
      (s) => s.workflowName.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }

  onClickFileInputButton() {
    const uploadFileValidation = new uploadValidationClass(
      this.incidentSharedData
    );
    const lastCellLetter = returnExcelCoulmnForNumericValue(
      this.workflowElementInfoFinal.length
    );
    uploadFileValidation.readExcel(
      lastCellLetter,
      this.workflowElementInfoFinal,
      {},
      this.fileToUpload?.arrayBuffer()
    );
    //this is tempory
    this.showFileSuccessMessage = true;
    console.log('onClickFileInputButton->', 'hi');
    this.changeNextButtonBehavior(false);
  }
}
