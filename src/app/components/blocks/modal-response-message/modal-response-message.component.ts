import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-modal-response-message',
  templateUrl: './modal-response-message.component.html',
  styleUrls: ['./modal-response-message.component.css']
})
export class ModalResponseMessageComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  @ViewChild('myModal', { static: false })
  modal!: ElementRef;

  @Input() responseMsgeBody:string = "";
  @Input() responseTitle:string = "";
  @Input() isResponse:boolean = false;
  @Output() confirmationStatus = new EventEmitter<boolean>();

  open() {
    this.modal.nativeElement.style.display = 'block';
  }

  close(){
    this.modal.nativeElement.style.display = 'none';
    this.confirmationStatus.emit(true);
  }
}
