import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MaterialModule } from '../../material/material.module';
import { SharedModule } from '../../shared/shared.module';
import { ReactiveFormsModule, FormsModule} from '@angular/forms';


import { AngularEditorModule } from '@kolkov/angular-editor';

import { BlsRoutingModule } from './bls-routing.module';
import { InitiationComponent } from './initiation/initiation.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BlsGtInitiationComponent } from './bls-gt-initiation/bls-gt-initiation.component';
import { VersionComponent } from './version/version.component';
import { DocumentGenerationComponent } from './document-generation/document-generation.component';


@NgModule({
  declarations: [
    InitiationComponent,
    DashboardComponent,
    BlsGtInitiationComponent,
    VersionComponent,
    DocumentGenerationComponent
  ],
  imports: [
    CommonModule,
    BlsRoutingModule,
    NgbModule,
    AngularEditorModule,
    MaterialModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class BlsModule { }
