import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

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

  open() {
    this.modal.nativeElement.style.display = 'block';
  }

  close() {
    this.modal.nativeElement.style.display = 'none';
  }
}
