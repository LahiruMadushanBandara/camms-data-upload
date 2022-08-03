import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WizardNodeUploadComponent } from './wizard-node-upload.component';

describe('WizardNodeUploadComponent', () => {
  let component: WizardNodeUploadComponent;
  let fixture: ComponentFixture<WizardNodeUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WizardNodeUploadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WizardNodeUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
