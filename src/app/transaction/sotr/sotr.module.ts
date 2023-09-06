import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SotrRoutingModule } from './sotr-routing.module';
import { InitiationComponent } from './initiation/initiation.component';
import { DashboardComponent } from './dashboard/dashboard.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MaterialModule } from '../../material/material.module';
import { SharedModule } from '../../shared/shared.module';
import { ReactiveFormsModule, FormsModule} from '@angular/forms';
import { AngularEditorModule } from '@kolkov/angular-editor';


@NgModule({
  declarations: [
    InitiationComponent,
    DashboardComponent
  ],
  imports: [
    CommonModule,
    SotrRoutingModule,
    NgbModule,
    AngularEditorModule,
    MaterialModule,
    SharedModule,
    ReactiveFormsModule,
  ]
})
export class SotrModule { }
