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

  @Output() newItemEvent = new EventEmitter<boolean>();

  
  constructor(private eventEmitterService: SharedService ){
  }


  
     public opened = false;
     public nodeUploadOpened = false;

    public close(status: boolean): void {
        console.log(`Dialog result: ${status}`);
        this.newItemEvent.emit(status);
    }

    public open(e:any): void {
      alert("dialog call")
       
      
      this.opened = true;
    }


    public onClick(): void {
      alert("Custom Action Clicked");
    }
    ngOnInit(): void {
      
    }
}
