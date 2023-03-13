import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

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

  open() {
    this.isResponse = true;
  }

  close(){
    this.isResponse = false;
  }
}
