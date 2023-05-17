import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SelectEvent } from '@progress/kendo-angular-layout';
import { HierarchyService } from 'src/app/services/hierarchy.service';
import { IncidentService } from 'src/app/services/incident.service';
import { StaffService } from 'src/app/services/staff.service';

@Component({
  selector: 'app-key-modal',
  templateUrl: './key-modal.component.html',
  styleUrls: ['./key-modal.component.css'],
})
export class KeyModalComponent implements OnInit {
  @Input() active: boolean = false;
  @Output() closeKeyModel = new EventEmitter<boolean>();

  HierarchySubscriptionKey: string = '';
  StaffSubscriptionKey: string = '';
  AuthToken: string = '';
  incidentSubscriptionKey: string = '';

  availableAuthToken: string = '';
  availableIncidentKey: string = '';
  availableHierarchyKey: string = '';
  availableStaffkey: string = '';

  IsSavedKeys: boolean = false;
  IsSavedIncidentKeys: boolean = false;

  constructor(
    private staffService: StaffService,
    private hierarchyService: HierarchyService,
    private incidentService: IncidentService
  ) {
    console.log(this.active);
  }

  ngOnInit(): void {
    this.AuthToken = localStorage.getItem('auth-token')!;
    this.StaffSubscriptionKey = localStorage.getItem('staff-subscription-key')!;
    this.HierarchySubscriptionKey = localStorage.getItem(
      'hierarchy-subscription-key'
    )!;
    this.incidentSubscriptionKey = localStorage.getItem(
      'incident-subscription-key'
    )!;

    this.availableAuthToken = this.AuthToken;
    this.availableHierarchyKey = this.HierarchySubscriptionKey;
    this.availableIncidentKey = this.incidentSubscriptionKey;
    this.availableStaffkey = this.StaffSubscriptionKey;
  }

  public editForm: FormGroup = new FormGroup({
    AuthToken: new FormControl('', Validators.required),
    StaffSubscriptionKey: new FormControl('', Validators.required),
    HierarchySubscriptionKey: new FormControl('', Validators.required),
  });
  public incidentKeyForm: FormGroup = new FormGroup({
    AuthToken: new FormControl('', Validators.required),
    StaffSubscriptionKey: new FormControl('', Validators.required),
    incidentSubscriptionKey: new FormControl('', Validators.required),
  });

  public openForm() {
    this.active = true;
    this.IsSavedKeys = false;
    this.IsSavedIncidentKeys = false;
  }

  //saff and hirachy form save function
  public onSave(e: any) {
    localStorage.setItem(
      'hierarchy-subscription-key',
      this.editForm.value.HierarchySubscriptionKey
    );

    localStorage.setItem(
      'staff-subscription-key',
      this.editForm.value.StaffSubscriptionKey
    );

    localStorage.setItem('auth-token', this.editForm.value.AuthToken);

    this.IsSavedKeys = true;
  }

  //incident form save function
  public onSaveIncidentKeys(e: any) {
    if (this.availableAuthToken == '') {
      console.log('pasindu');
    }

    localStorage.setItem(
      'staff-subscription-key',
      this.incidentKeyForm.value.StaffSubscriptionKey
    );

    localStorage.setItem(
      'incident-subscription-key',
      this.incidentKeyForm.value.incidentSubscriptionKey
    );

    localStorage.setItem('auth-token', this.editForm.value.AuthToken);

    this.IsSavedIncidentKeys = true;
  }

  public closeForm(): void {
    this.active = false;
    this.closeKeyModel.emit(false);
    this.IsSavedKeys = false;
    this.IsSavedIncidentKeys = false;
  }

  public onTabSelect(e: SelectEvent): void {
    console.log(e);
  }
}
