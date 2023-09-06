import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialModule } from '../material/material.module';
import { ReactiveFormsModule, FormsModule} from '@angular/forms';

import { AccessControlDirective } from './access-control.directive';
import { PipePipe } from './pipe.pipe';
import { SystemComponent } from '../transaction/psr/system/system.component';
import { CompartmentComponent } from '../transaction/psr/compartment/compartment.component';



@NgModule({
  declarations: [
    AccessControlDirective,
    PipePipe,
    SystemComponent,
    CompartmentComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  exports : [
  AccessControlDirective,
  PipePipe,
  SystemComponent,
  CompartmentComponent,
  ]
})
export class SharedModule { }
