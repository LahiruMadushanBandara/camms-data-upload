import {
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

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.css'],
})
export class UploadFileComponent implements OnInit, DoCheck, OnChanges {
  @Output() newItemEvent = new EventEmitter<Boolean>();
  @ViewChild('fileInputSelect', { static: true }) fileInputSelect!: ElementRef;
  @Input() workFlowListForFilter: Array<WorkFlowFields> = [];
  constructor() {}
  previousValue: Array<WorkFlowFields> = [];
  currentValue: Array<WorkFlowFields> = [];

  //upload file
  public loaderForDropDown = true;
  public showClearButton: boolean = false;
  public selectedWorkFlowIdForUpload?: number;
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

  ngOnInit(): void {}

  ngDoCheck(): void {
    if (this.selectedWorkFlowName != '') {
    }
    if (
      this.selectedWorkFlowIdForUpload &&
      this.selectedWorkFlowIdForUpload !=
        this.controlNgDoCheckForUploadWorkFlowId
    ) {
      //get selected workflowname for file name
      this.workFlowListForFilter.forEach((x: WorkFlowFields) => {
        if (x.workflowId == this.selectedWorkFlowIdForUpload) {
          this.selectedWorkFlowName = x.workflowName;
          console.log(this.selectedWorkFlowName);
          this.extractedWorkFlowName = removeSymbolsAndSpaces(
            'Property / Infrastructure / Near Miss / Hazard'
          );
        }
      });
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
  onFileChange(e: any) {
    const workbook = new Workbook();
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
    console.log('more Content to write');
  }
}
