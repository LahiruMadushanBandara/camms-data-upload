import {
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-incident-file-select',
  templateUrl: './incident-file-select.component.html',
  styleUrls: ['./incident-file-select.component.css'],
})
export class IncidentFileSelectComponent implements OnInit {
  @ViewChild('fileInputSelect', { static: true }) fileInputSelect!: ElementRef;
  @Output() newItemEvent = new EventEmitter<Boolean>();

  public showErrorCard = false;
  public isIconShow = false;
  public disabledUploadBtn = true;
  public showSelectBtn = true;
  changefileSelectBackground = false;
  public showFileSuccessMessage = false;
  IsFileHasValidData = false;

  showFileIcon = false;
  showFileInputCloseBtn = false;
  fileToUpload: File | null = null;

  constructor() {}

  ngOnInit(): void {}

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
