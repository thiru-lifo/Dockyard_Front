import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DocumentComponent } from './document/document.component';


const routes: Routes = [

  { path: 'document', component: DocumentComponent, data: { breadcrumb: 'PSR Document'}  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PsrRoutingModule { }
