import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StaffComponent } from './components/staff/staff.component';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatToolbarModule } from "@angular/material/toolbar";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatButtonModule } from "@angular/material/button";
import { NetworkInterceptor } from './interceptors/network.interceptor';
import { ModalComponent } from './components/modal/modal.component';
import { HierarchyNodeComponent } from './components/hierarchy-node/hierarchy-node.component';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { WizardComponent } from './components/wizard/wizard.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DialogsModule } from '@progress/kendo-angular-dialog';
import { AccountDetailsComponent } from './components/account-details/account-details.component';
import { LabelModule } from '@progress/kendo-angular-label';
import { ButtonComponent } from './components/button/button.component';
import { UploadsModule } from '@progress/kendo-angular-upload';
import { FileUploaderComponent } from './components/file-uploader/file-uploader.component';
import { WizardNodeUploadComponent } from './components/wizard-node-upload/wizard-node-upload.component';
import { StaffDataComponent } from './components/staff-data/staff-data.component';
import { DataListComponent } from './components/data-list/data-list.component';
import { GridModule } from '@progress/kendo-angular-grid';
import { ToastrModule } from 'ngx-toastr';
import { FinalStepComponent } from './components/final-step/final-step.component';






const appRoutes: Routes = [
  { path: 'staff', component: StaffComponent },
  { path: '', component: HomeComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    StaffComponent,
    HomeComponent,
    ModalComponent,
    HierarchyNodeComponent,
    WizardComponent,
    AccountDetailsComponent,
    ButtonComponent,
    FileUploaderComponent,
    WizardNodeUploadComponent,
    StaffDataComponent,
    DataListComponent,
    FinalStepComponent
  ],
  imports: [
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
    ToastrModule.forRoot({ positionClass: 'inline' })
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass:NetworkInterceptor,
      multi:true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
