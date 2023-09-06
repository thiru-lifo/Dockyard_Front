import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { HeaderComponent } from './templates/header/header.component';
import { SidemenuComponent } from './templates/sidemenu/sidemenu.component';
import { MetismenuAngularModule } from "@metismenu/angular";
import { MaterialModule } from './material/material.module';
import { HttpClientModule } from '@angular/common/http';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { SnackbarComponent } from './service/snackbar/snackbar.component';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { AuthguardGuard } from './service/authguard.guard';
import { SharedModule } from './shared/shared.module';
import {BreadcrumbModule} from 'angular-crumbs';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { NgIdleModule } from '@ng-idle/core';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ReactiveFormsModule, FormsModule} from '@angular/forms';



@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SidemenuComponent,
    SnackbarComponent,
    ConfirmationDialogComponent,
  ],
  imports: [
    BrowserModule,
    BreadcrumbModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NgbModule,
    MetismenuAngularModule,
    HttpClientModule,
    MatSnackBarModule,
    MaterialModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    NgIdleModule.forRoot(),
    NgIdleKeepaliveModule.forRoot(),
    ModalModule.forRoot(),
  ],
  providers: [{provide: LocationStrategy, useClass: HashLocationStrategy},AuthguardGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
