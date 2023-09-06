import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { InitiationComponent } from './initiation/initiation.component';
import { GTInitiationComponent } from './gt-initiation/gt-initiation.component';

import { ReportsComponent } from './reports/reports.component';
import { VersionComponent } from './version/version.component';
import { GlsDocumentGenerationComponent } from './gls-document-generation/gls-document-generation.component';

const routes: Routes = [

  { path: 'dashboard', component: DashboardComponent, data: { breadcrumb: 'Dashboard'}  },
  { path: 'initiation', component: InitiationComponent, data: { breadcrumb: 'Initiation'}  },
  { path: 'gt-initiation', component: GTInitiationComponent, data: { breadcrumb: 'GT Initiation'}  },
  { path: 'reports', component: ReportsComponent, data: { breadcrumb: 'Reports'}  },
  { path: 'version', component: VersionComponent, data: { breadcrumb: 'Version'}  },
  { path: 'gls-document-generation', component: GlsDocumentGenerationComponent, data: { breadcrumb: 'Gls Document generation'}  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GlsRoutingModule { }
