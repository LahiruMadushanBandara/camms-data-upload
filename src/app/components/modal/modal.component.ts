import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { SharedService } from 'src/app/services/shared.service';
import { HomeComponent } from '../home/home.component';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {
  @ViewChild("home")
  public home!: HomeComponent;

  constructor(private eventEmitterService: SharedService ){
  }


  
     public opened = false;
     public nodeUploadOpened = false;

    public close(status: string): void {
        console.log(`Dialog result: ${status}`);
        this.opened = false;
    }

    public open(e:any): void {
      alert("dialog call")
        this.opened = true;
    }

    ngOnInit(): void {
      
    }
}
