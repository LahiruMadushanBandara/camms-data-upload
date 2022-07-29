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
    WizardComponent
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
    DialogsModule
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
