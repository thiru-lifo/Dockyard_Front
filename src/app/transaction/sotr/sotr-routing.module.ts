import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InitiationComponent } from './initiation/initiation.component';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [
  { path: 'initiation', component: InitiationComponent, data: { breadcrumb: 'Initiation Notes'}  },
  { path: 'dashboard', component: DashboardComponent, data: { breadcrumb: 'Dashboard'}  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SotrRoutingModule { }
