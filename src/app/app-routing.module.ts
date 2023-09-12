import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponentComponent } from './components/common/main-component/main-component.component';

const routes: Routes = [
  {
    path: 'Authorised/Administration/DataUploader.aspx',
    component: MainComponentComponent,
  },
  {
    path: 'Interplan/Authorised/Administration/DataUploader.aspx',
    component: MainComponentComponent,
  },
  {
    path: '**',
    component: MainComponentComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
