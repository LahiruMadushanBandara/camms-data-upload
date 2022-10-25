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
import { WizardComponent } from './components/wizard-staff-upload/wizard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogsModule } from '@progress/kendo-angular-dialog';
import { AccountDetailsComponent } from './components/staff-upload/step-api-setup/account-details.component';
import { LabelModule } from '@progress/kendo-angular-label';
import { ButtonComponent } from './components/button/button.component';
import { UploadsModule } from '@progress/kendo-angular-upload';
import { WizardNodeUploadComponent } from './components/wizard-node-upload/wizard-node-upload.component';
import { StaffDataComponent } from './components/staff-upload/step-file-select/fileSelectStep';
import { DataListComponent } from './components/staff-upload/step-validate-data/data-list.component';
import { GridModule } from '@progress/kendo-angular-grid';
import { FinalStepComponent } from "./components/staff-upload/step-submit-data/final-step.component";
import { MessageBoxComponent } from './components/message-box/message-box.component';
import { IndicatorsModule } from '@progress/kendo-angular-indicators';
import { NotificationModule } from '@progress/kendo-angular-notification';
import { HierarchyApiSetupComponent } from './components/hierarchy-node/first-step/Hierarchy-Api-Setup';
import { hierarchySelectFileComponent } from './components/hierarchy-node/second-step/hierarchy-select-file';
import { HierarchyValidateDataComponent } from './components/hierarchy-node/third-step/hierarchy-validate-data';
import { HierarchySubmitFileComponent } from './components/hierarchy-node/final-step/hierarchy-submit-file';
import { EditTopNodeStepComponent } from './components/hierarchy-node/edit-top-node-step/edit-top-node-step.component';





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
    ButtonComponent,
    WizardNodeUploadComponent,
    StaffDataComponent,
    DataListComponent,
    FinalStepComponent,
    MessageBoxComponent,
    HierarchyApiSetupComponent,
    hierarchySelectFileComponent,
    HierarchyValidateDataComponent,
    HierarchySubmitFileComponent,
    EditTopNodeStepComponent
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
