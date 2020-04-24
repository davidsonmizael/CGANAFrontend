import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ImageProcComponent } from './image-proc/image-proc.component'

const routes: Routes = [
  { path: '', component:  ImageProcComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
