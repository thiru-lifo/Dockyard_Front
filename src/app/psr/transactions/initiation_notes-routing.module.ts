import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InitiationNotesComponent } from './initiation_notes/initiation_notes.component';



const routes: Routes = [
  { path: '', component: InitiationNotesComponent, data: { breadcrumb: 'Initiation Notes'} },
  { path: 'initiation_notes', component: InitiationNotesComponent, data: { breadcrumb: 'Initiation Notes Units'}  }


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MastersRoutingModule { }
