import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MaterialModule } from '../../material/material.module';
import { SharedModule } from '../../shared/shared.module';
import { ReactiveFormsModule, FormsModule} from '@angular/forms';


import { AngularEditorModule } from '@kolkov/angular-editor';

import { GlsRoutingModule } from './gls-routing.module';
import { InitiationComponent } from './initiation/initiation.component';
import { GTInitiationComponent } from './gt-initiation/gt-initiation.component';
import { ReportsComponent } from './reports/reports.component';
import { VersionComponent } from './version/version.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { GlsDocumentGenerationComponent } from './gls-document-generation/gls-document-generation.component';

@NgModule({
  declarations: [
    InitiationComponent,
    GTInitiationComponent,
    DashboardComponent,
    ReportsComponent,
    VersionComponent,
    GlsDocumentGenerationComponent
  ],
  imports: [
    CommonModule,
    GlsRoutingModule,
    NgbModule,
    AngularEditorModule,
    MaterialModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class GlsModule { }
