

import { AfterViewInit, Component, Input, ViewChild } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { TextBoxComponent } from "@progress/kendo-angular-inputs";


@Component({
  selector: "account-details",
  templateUrl:'./account-details.component.html'
})
export class AccountDetailsComponent implements AfterViewInit {
  public uploadSaveUrl = "saveUrl"; // should represent an actual API endpoint
  public uploadRemoveUrl = "removeUrl"; // should represent an actual API endpoint


  @Input()
  public accountDetails!: FormGroup;
  @ViewChild("password")
  public textbox!: TextBoxComponent;

  public ngAfterViewInit(): void {
    this.textbox.input.nativeElement.type = "password";
  }

  public toggleVisibility(): void {
    const inputEl = this.textbox.input.nativeElement;
    inputEl.type = inputEl.type === "password" ? "text" : "password";
  }
}
