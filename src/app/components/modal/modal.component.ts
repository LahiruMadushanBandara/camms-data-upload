import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';


@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ModalComponent {
  @Output() windowClose = new EventEmitter<boolean>();
  @Input() windowTitle = '';

  constructor() {}
  public opened = false;
  public nodeUploadOpened = false;

  public close(status: boolean): void {
    this.windowClose.emit(status);
  }

  public open(e: any): void {
    this.opened = true;
  }
}
