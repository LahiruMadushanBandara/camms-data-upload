import {
  Component,
  DoCheck,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Workbook } from 'exceljs';
import { WorkFlowFields } from 'src/app/models/WorkFlowFields.model';

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.css'],
})
export class UploadFileComponent implements OnInit, DoCheck {
  @Output() newItemEvent = new EventEmitter<Boolean>();
  @ViewChild('fileInputSelect', { static: true }) fileInputSelect!: ElementRef;
  @Input() workFlowListForFilter: Array<WorkFlowFields> = [];
  constructor() {}

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
  changefileSelectBackground = false;
  IsFileHasValidData = false;
  showFileIcon = false;
  showFileInputCloseBtn = false;
  fileToUpload: File | null = null;
  ngOnInit(): void {}

  ngDoCheck(): void {
    if (
      this.selectedWorkFlowIdForUpload &&
      this.selectedWorkFlowIdForUpload !=
        this.controlNgDoCheckForUploadWorkFlowId
    ) {
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

        if (
          HeaderRow.getCell(3).value === null ||
          rowCount <= 1 ||
          worksheet.name !== 'Hierarchy Node Data' ||
          HeaderRow.getCell(1).value !== 'Hierarchy Code'
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
