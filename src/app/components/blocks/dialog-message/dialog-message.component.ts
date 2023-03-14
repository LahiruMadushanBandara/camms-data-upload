import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-dialog-message',
  templateUrl: './dialog-message.component.html',
  styleUrls: ['./dialog-message.component.css']
})
export class DialogMessageComponent implements OnInit {
  @Input() noBtnNameTxt = "No";
  @Input() yesBtnNameTxt = "Yes";
  @Input() messageBody = "Are you sure you want to continue?";
  @Input() opened = false;
  @Output() confirmationStatus = new EventEmitter<boolean>();


  constructor() { }

  ngOnInit(): void {
  }

  public close(status: string): void {
    this.opened = false;
    if (status == 'yes') {
      this.confirmationStatus.emit(true);
    }
  }

  public open(): void {
    this.opened = true;
  }
}
