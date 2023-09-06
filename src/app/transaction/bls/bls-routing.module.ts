import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { InitiationComponent } from './initiation/initiation.component';
import { BlsGtInitiationComponent } from './bls-gt-initiation/bls-gt-initiation.component';
import { VersionComponent } from './version/version.component';
import { DocumentGenerationComponent } from './document-generation/document-generation.component';
const routes: Routes = [

  { path: 'dashboard', component: DashboardComponent, data: { breadcrumb: 'Dashboard'}  },
  { path: 'initiation', component: InitiationComponent, data: { breadcrumb: 'Initiation'}  },
  { path: 'bls-gt-initiation', component: BlsGtInitiationComponent, data: { breadcrumb: 'BLS Initiation'}  },
  { path: 'version', component: VersionComponent, data: { breadcrumb: 'Version'}  },
  { path: 'document-generation', component: DocumentGenerationComponent, data: { breadcrumb: 'BLS Document generation'}  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BlsRoutingModule { }
