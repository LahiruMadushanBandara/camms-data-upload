import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

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

  constructor() {
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
    AuthToken: new FormControl(this.availableAuthToken, Validators.required),
    StaffSubscriptionKey: new FormControl(''),
    HierarchySubscriptionKey: new FormControl(''),
    incidentSubscriptionKey: new FormControl(''),
  });

  public openForm() {
    this.active = true;
    this.IsSavedKeys = false;
    if (this.AuthToken !== '') {
      this.editForm.value.AuthToken = this.AuthToken;
    }
    if (this.HierarchySubscriptionKey !== '') {
      this.editForm.value.HierarchySubscriptionKey =
        this.HierarchySubscriptionKey;
    }
    if (this.StaffSubscriptionKey !== '') {
      this.editForm.value.StaffSubscriptionKey = this.StaffSubscriptionKey;
    }
    if (this.incidentSubscriptionKey !== '') {
      this.editForm.value.incidentSubscriptionKey =
        this.incidentSubscriptionKey;
    }
  }

  public onSave(e: any) {
    localStorage.setItem(
      'hierarchy-subscription-key',
      this.editForm.value.HierarchySubscriptionKey
    );

    localStorage.setItem(
      'staff-subscription-key',
      this.editForm.value.StaffSubscriptionKey
    );

    localStorage.setItem(
      'incident-subscription-key',
      this.editForm.value.incidentSubscriptionKey
    );

    localStorage.setItem('auth-token', this.editForm.value.AuthToken);

    this.IsSavedKeys = true;
  }

  public closeForm(): void {
    this.active = false;
    this.closeKeyModel.emit(false);
    this.IsSavedKeys = false;
  }
}
