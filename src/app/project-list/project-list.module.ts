import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProjectListRoutingModule } from './project-list-routing.module';
import { ListComponent } from './list/list.component';

import { MaterialModule } from '../material/material.module';
import { ReactiveFormsModule} from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ListComponent


  ],
  imports: [
    CommonModule,
    ProjectListRoutingModule,
    ReactiveFormsModule,
    MaterialModule,
    NgbModule,
    FormsModule
  ]
})
export class ProjectListModule { }
