import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {

  constructor(private eventEmitterService: SharedService ){
  }
  
     public opened = false;

    public close(status: string): void {
        console.log(`Dialog result: ${status}`);
        this.opened = false;
    }

    public open(isOpen:boolean): void {
      alert("dialog call")
        this.opened = isOpen;
    }

    ngOnInit(): void {
      
    }
}
