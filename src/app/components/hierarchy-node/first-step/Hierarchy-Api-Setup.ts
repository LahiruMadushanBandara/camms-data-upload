import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-Hierarchy-Api-Setup',
  templateUrl: './Hierarchy-Api-Setup.html',
  styleUrls: ['./Hierarchy-Api-Setup.css']
})
export class HierarchyApiSetupComponent implements OnInit {

  constructor() { }

  public uploadSaveUrl = "saveUrl"; // should represent an actual API endpoint
  public uploadRemoveUrl = "removeUrl"; // should represent an actual API endpoint


  @Input()
  public accountDetails!: FormGroup;
  @Input()
  public showApiDetailsError = false;
  @Input()
  public msg!:string;

  ngOnInit(): void {
  }

}
