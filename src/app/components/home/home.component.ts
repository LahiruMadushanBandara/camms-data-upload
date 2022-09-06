import { Component, Input, OnInit } from '@angular/core';
import { SharedService } from '../../services/shared.service';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  @Input()
  public homeDetails!: FormGroup;
  @Input()
  public opened: boolean = false;
  
  ngOnInit(): void {
  }

  title = 'camms-data-uploader';
  nodeUploadOpened = false
  
  constructor(){}
  

 close(status:boolean)
 {
  this.opened = status
  console.log(status)
 }
 closeModal(status:boolean){
  this.opened = !status
 }
}




