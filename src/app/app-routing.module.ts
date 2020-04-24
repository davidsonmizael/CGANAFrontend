import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ImageProcComponent } from './image-proc/image-proc.component';
import { HomeComponent } from './home/home.component';
import { AdminComponent } from './admin/admin.component';
import { SubmitFormComponent } from './submit-form/submit-form.component';

const routes: Routes = [
  { path: '', component:  HomeComponent},
  { path: 'draw', component: ImageProcComponent},
  { path: 'admin', component: AdminComponent},
  { path: 'submit-form', component: SubmitFormComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
