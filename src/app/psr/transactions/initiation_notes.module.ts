import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MastersRoutingModule } from '../transactions/initiation_notes-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MaterialModule } from '../../material/material.module';
import { SharedModule } from '../../shared/shared.module';
import { ReactiveFormsModule, FormsModule} from '@angular/forms';
import{ InitiationNotesComponent } from './initiation_notes/initiation_notes.component';





@NgModule({
  declarations: [
    InitiationNotesComponent
  ],
  imports: [
    CommonModule,
    NgbModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    MastersRoutingModule
  ]
})
export class InitiationNotesModule { }
