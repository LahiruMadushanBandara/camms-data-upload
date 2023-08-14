import { HttpErrorResponse } from '@angular/common/http';
import {
  AfterContentInit,
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticationDetails } from 'src/app/models/AuthenticationDetails.model';
import { TokenData } from 'src/app/models/TokenData.model';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { IncidentUploadSharedService } from 'src/app/services/incident-upload-shared.service';
import { AuthenticationClass } from 'src/app/utils/Classes/AuthenticationClass';
import { eyeIcon, facebookBoxIcon, SVGIcon } from '@progress/kendo-svg-icons';
import { TextBoxComponent } from '@progress/kendo-angular-inputs';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.css'],
})
export class PasswordComponent implements OnInit, AfterViewInit {
  @ViewChild('AuthToken') public textbox: TextBoxComponent;
  @Input() active: boolean = false;
  @Output() closeCommonModal = new EventEmitter<boolean>();
  @Output() mainModalOpen = new EventEmitter<string>();
  @Output() initiatePasswordModal = new EventEmitter<boolean>();
  inputType = 'password';
  public eyeIcon: SVGIcon = eyeIcon;
  public tokenData: TokenData = {
    message: '',
    token: '',
    tokenExprirationDateUTC: '',
    tokenGeneratedDateUTC: '',
  };
  public modalActive = false;
  public width = 200;
  public height = 300;

  public saveButtonloaderVisible = false;
  public saveButtonText = 'Save';

  private passwordView = false;
  doCheckControler = 0;
  incidentSubscriptionKeyIncident: string = '';
  APIPassword: string = '';
  StaffSubscriptionKeyIncident: string = '';

  invalidPassword: boolean = false;
  availableAuthToken: string = '';
  availableIncidentKey: string = '';
  availableHierarchyKey: string = '';
  availableStaffkey: string = '';

  IsSavedKeys: boolean = false;
  IsSavedIncidentKeys: boolean = false;

  public errors: string[] = [];

  constructor(
    private incidentData: IncidentUploadSharedService,
    private authentication: AuthenticationService
  ) {
    console.log('constu');
  }
  ngAfterViewInit(): void {
    this.textbox.input.nativeElement.type = 'password';
  }

  ngOnInit(): void {
    let keys = this.incidentData.getKeyValues();
    this.availableAuthToken = keys.authToken;

    this.availableIncidentKey = keys.incidentKey;
  }

  public APIPasswordForm: FormGroup = new FormGroup({
    APIPassword: new FormControl('', Validators.required),
  });

  public openForm() {
    this.active = true;
    this.IsSavedKeys = false;
    this.IsSavedIncidentKeys = false;
  }

  public closeForm(): void {
    this.active = false;
    this.closeCommonModal.emit(false);
    this.IsSavedKeys = false;
    this.IsSavedIncidentKeys = false;
    this.invalidPassword = false;
    this.APIPasswordForm.reset();
    this.initiatePasswordModal.emit(false);
  }
  public async requestsTokenAndOpenSelectModal() {
    console.log(this.APIPasswordForm);
    this.authentication.authenticationDetails.Password =
      this.APIPasswordForm.value.APIPassword;
    this.saveButtonloaderVisible = true;
    this.saveButtonText = 'Saving';
    this.tokenData = await this.getAuthToken();
    localStorage.setItem('auth-token', this.tokenData.token);
    localStorage.setItem(
      'auth-token-exp-time',
      this.tokenData.tokenExprirationDateUTC
    );
  }

  private async getAuthToken() {
    return new Promise<TokenData>((resolve, reject) => {
      this.authentication
        .getCammsToken(this.authentication.authenticationDetails)
        .subscribe({
          next: (res: any) => {
            resolve(res);
          },
          error: (error: HttpErrorResponse) => {
            this.invalidPassword = true;
            this.saveButtonloaderVisible = false;
            this.saveButtonText = 'Save';
          },
          complete: () => {
            this.closeCommonModal.emit(false);
            this.modalActive = true;
            this.active = false;
            this.saveButtonloaderVisible = false;
            this.saveButtonText = 'Save';
            this.invalidPassword = false;
            this.APIPasswordForm.reset();
          },
        });
    });
  }

  public closeSelectModal(e: any) {
    this.modalActive = false;
    this.APIPasswordForm.reset();
    this.initiatePasswordModal.emit(false);
  }
  public mainModalOpenFromSelect(data: any) {
    console.log('commen-data->', data);
    this.mainModalOpen.emit(data);
  }
  public toggleVisibility(): void {
    console.log('toggel', this.textbox);
    const inputEl = this.textbox.input.nativeElement;

    if (inputEl.type === 'password') {
      this.passwordView = false;
      inputEl.type = 'text';
    } else {
      this.passwordView = true;
      inputEl.type = 'password';
    }
  }
}
