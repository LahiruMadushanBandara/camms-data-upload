import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.css'],
})
export class SelectComponent implements OnInit {
  @Input() active: boolean = false;
  @Output() closeCommonModal = new EventEmitter<boolean>();
  @Output() openModals = new EventEmitter<string>();

  public form: FormGroup;
  public data: { [Key: string]: string } = {
    confirmation: '',
  };

  public model = {
    gender: null,
  };
  public selectedUploader: string = '';

  IsSavedKeys: boolean = false;

  public errors: string[] = [];

  constructor() {
    this.form = new FormGroup({
      confirmation: new FormControl(this.data['confirmation'], [
        Validators.required,
      ]),
    });
  }

  ngOnInit(): void {}

  public openForm() {
    this.active = true;
    this.IsSavedKeys = false;
  }

  public closeForm(): void {
    this.active = false;
    this.closeCommonModal.emit(false);
    this.IsSavedKeys = false;
  }

  public submitForm(): void {
    console.log(this.form.value);
    this.form.markAllAsTouched();
    this.openModals.emit(this.form.value);
    this.closeForm();
  }
}
