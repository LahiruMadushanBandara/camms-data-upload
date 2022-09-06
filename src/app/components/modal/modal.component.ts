import { Component, EventEmitter, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { SharedService } from 'src/app/services/shared.service';
import { HomeComponent } from '../home/home.component';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ModalComponent implements OnInit {
  @ViewChild("home")
  public home!: HomeComponent;

  @Output() windowClose = new EventEmitter<boolean>();

  
  constructor(){
  }
     public opened = false;
     public nodeUploadOpened = false;

    public close(status: boolean): void {
        this.windowClose.emit(status);
    }

    public open(e:any): void {
      
       
      
      this.opened = true;
    }


    public onClick(): void {
      
    }
    ngOnInit(): void {
      
    }
}
