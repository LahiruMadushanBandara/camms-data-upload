import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatToolbarModule } from "@angular/material/toolbar";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatButtonModule } from "@angular/material/button";
import { ModalComponent } from './components/modal/modal.component';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { WizardComponent } from './components/staff-upload/wizard-staff-upload/wizard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogsModule } from '@progress/kendo-angular-dialog';
import { AccountDetailsComponent } from './components/common/step-api-setup/account-details.component';
import { LabelModule } from '@progress/kendo-angular-label';
import { UploadsModule } from '@progress/kendo-angular-upload';
import { WizardNodeUploadComponent } from './components/hierarchy-node/wizard-node-upload/wizard-node-upload.component';
import { StaffDataComponent } from './components/staff-upload/step-staff-file-select/fileSelectStep';
import { DataListComponent } from './components/staff-upload/step-staff-validate-data/data-list.component';
import { GridModule } from '@progress/kendo-angular-grid';
import { FinalStepComponent } from "./components/staff-upload/step-staff-submit-file/final-step.component";
import { MessageBoxComponent } from './components/blocks/message-box/message-box.component';
import { IndicatorsModule } from '@progress/kendo-angular-indicators';
import { NotificationModule } from '@progress/kendo-angular-notification';
import { hierarchySelectFileComponent } from './components/hierarchy-node/step-hierarchy-file-select/hierarchy-select-file';
import { HierarchyValidateDataComponent } from './components/hierarchy-node/step-hierarchy-validate-data/hierarchy-validate-data';
import { HierarchySubmitFileComponent } from './components/hierarchy-node/step-hierarchy-submit-file/hierarchy-submit-file';
import { DialogMessageComponent } from './components/blocks/dialog-message/dialog-message.component';
import { ModalResponseMessageComponent } from './components/blocks/modal-response-message/modal-response-message.component';





const appRoutes: Routes = [
  { path: '', component: HomeComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ModalComponent,
    WizardComponent,
    AccountDetailsComponent,
    WizardNodeUploadComponent,
    StaffDataComponent,
    DataListComponent,
    FinalStepComponent,
    MessageBoxComponent,
    hierarchySelectFileComponent,
    HierarchyValidateDataComponent,
    HierarchySubmitFileComponent,
    DialogMessageComponent,
    ModalResponseMessageComponent,
    
  ],
  imports: [
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatToolbarModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    ),
    NgbModule,
    BrowserAnimationsModule,
    ButtonsModule,
    LayoutModule,
    InputsModule,
    ReactiveFormsModule,
    DialogsModule,
    LabelModule,
    UploadsModule,
    GridModule,
    IndicatorsModule,
    NotificationModule
  ],
  providers: [
    
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
