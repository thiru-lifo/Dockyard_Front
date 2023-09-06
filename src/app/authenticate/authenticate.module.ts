import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';  

import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { SecurityPinComponent } from './security-pin/security-pin.component';

import { AuthenticateRoutingModule } from './authenticate-routing.module';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MaterialModule } from '../material/material.module';
import { ReactiveFormsModule} from '@angular/forms';
import { AuthenticateComponent } from './authenticate.component';
import { RoleSelectionComponent } from './role-selection/role-selection.component';


@NgModule({
  declarations: [
    AuthenticateComponent,
    LoginComponent,
    ForgotPasswordComponent,
    SecurityPinComponent,
    RoleSelectionComponent,
  ],
  imports: [
    AuthenticateRoutingModule,
    NgbModule,
    CommonModule,
    MaterialModule,
    ReactiveFormsModule
  ]
})
export class AuthenticateModule { }
