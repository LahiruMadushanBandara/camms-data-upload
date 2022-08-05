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
  
  ngOnInit(): void {
  }

  title = 'camms-data-uploader';
  opened = false;
  nodeUploadOpened = false
  
  constructor(private sharedService:SharedService){}
  

 close(status:any)
 {
  this.opened = false
  console.log(status)
 }

}




