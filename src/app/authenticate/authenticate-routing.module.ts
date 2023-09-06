import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { SecurityPinComponent } from './security-pin/security-pin.component';
import { AuthguardGuard } from 'src/app/service/authguard.guard';
import { AuthenticateComponent } from './authenticate.component';
import { RoleSelectionComponent } from './role-selection/role-selection.component';





const routes: Routes = [ 
  {
    path: 'role-selection',
    component: RoleSelectionComponent, canActivate:[AuthguardGuard]
  }, 
  {
    path: 'login',
    component: LoginComponent
  },

  {
    path: 'forgot-password',
    component: ForgotPasswordComponent, canActivate:[AuthguardGuard]
  },
  {
    path: 'twofactor',
    component: SecurityPinComponent, canActivate:[AuthguardGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthenticateRoutingModule { }