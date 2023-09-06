import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MaterialModule } from '../../material/material.module';
import { SharedModule } from '../../shared/shared.module';
import { ReactiveFormsModule, FormsModule} from '@angular/forms';

import { DocumentComponent } from './document/document.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { PsrRoutingModule } from './psr-routing.module';



@NgModule({
  declarations: [
    DocumentComponent,
    
  ],
  imports: [
    CommonModule,
    PsrRoutingModule,
    NgbModule,
    AngularEditorModule,
    MaterialModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,

  ]
})
export class PsrModule { }
