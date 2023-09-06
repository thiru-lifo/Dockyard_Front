import { Component,AfterContentInit, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, NavigationStart,RouterStateSnapshot } from '@angular/router';
import { DEFAULT_INTERRUPTSOURCES, Idle } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';
import { BsModalRef, BsModalService, ModalDirective } from 'ngx-bootstrap/modal';
import { environment } from 'src/environments/environment';
import { language } from 'src/environments/language';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { ApiService } from './service/api.service';
import { HeaderComponent } from 'src/app/templates/header/header.component';
import { FormGroup, FormControl, Validators, FormGroupDirective } from "@angular/forms";
import { NotificationService } from "src/app/service/notification.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'ETMA-v2';
  resData:any
  showHead:any = false;
  idleState = "Not started.";
  timedOut = false;
  lastPing?: Date = null;
  public modalRef: BsModalRef;
  timeoutsec: any;

  @ViewChild("childModal", { static: false }) childModal: ModalDirective;
  constructor(
    private router: Router,
    private idle: Idle,
    private dialog:MatDialog,
    public api:ApiService,
    private modalService: BsModalService,
    private keepalive: Keepalive,
    private notification:NotificationService) {
  // on route change to '/login', set the variable showHead to false

    router.events.forEach((event) => {
      if (event instanceof NavigationStart) {

        if (event['url'] == '/' || event['url'] == '/authenticate/login' || event['url'] == '/authenticate/biometrics-log' || event['url'] == '/authenticate/biometrics-verify' || event['url'] == '/authenticate/forgot-password' || event['url'] == '/authenticate/twofactor' || event['url'] == '/authenticate/role-selection'|| event['url'] == '/authenticate/forgot-password' || event['url'] == '/error/403' || event['url'] == '/authenticate/login/etma' || event['url'] == '/authenticate/login/cbiu' || event['url'] == '/authenticate/login/gttt' || event['url'] == '/authenticate/login/mtu') {
          this.showHead = false;
        } else {
          // console.log("NU")
          this.showHead = true;
        }
      }
    });

    this.resData = this.api.decryptData(localStorage.getItem("token-detail"));
    //console.log(this.resData);

    if (this.api.getConfiguration('STO')) {
      if(this.api.getConfiguration('STO')=='true')
      {
        // console.log("this.resData.sessiontime", this.resData.timer.sessiontime);
        // sets an idle timeout of 5 seconds, for testing purposes.
        // idle.setIdle((this.api.getConfiguration('STOT')?parseInt(this.api.getConfiguration('STOT')):1000));
        // sets a timeout period of 5 seconds. after 10 seconds of inactivity, the user will be considered timed out.
        idle.setTimeout(10);
        // sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
        idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

        idle.onIdleEnd.subscribe(() => {
          this.idleState = "No longer idle.";
          // console.log(this.idleState);
          this.reset();
        });

        idle.onTimeout.subscribe(() => {
          this.childModal.hide();
          this.idleState = "Timed out!";
          this.timedOut = true;
          // console.log(this.idleState);
          //this.router.navigate(["/"]);
          this.logout();
        });

        idle.onIdleStart.subscribe(() => {
          this.idleState = "You've gone idle!";
          // console.log(this.idleState);
          this.childModal.show();
        });

        idle.onTimeoutWarning.subscribe((countdown) => {
          this.idleState = "You will time out in " + countdown + " seconds!";
          // console.log(this.idleState);
        });

        // sets the ping interval to 15 seconds
        keepalive.interval(15);

        keepalive.onPing.subscribe(() => (this.lastPing = new Date()));

        this.api.getUserLoggedIn().subscribe((userLoggedIn) => {
          if (userLoggedIn) {
            idle.watch();
            this.timedOut = false;
          } else {
            idle.stop();
          }
        });
      }
    }
  }

  ngOnInit(): void {
  }

  ngAfterContentInit()
  {

  }

  reset() {
    this.idle.watch();
    //xthis.idleState = 'Started.';
    this.timedOut = false;
  }

  hideChildModal(): void {
    this.childModal.hide();
  }

  stay() {
    this.childModal.hide();
    this.reset();
  }

  logout() {
    this.childModal.hide();
    this.api.setUserLoggedIn(false);
    this.api.applicationLogoutLog();
    //this.router.navigate(["/"]);
  }

  public editForm = new FormGroup({
    id: new FormControl(""),
    name: new FormControl("", [
      Validators.required,
    ]),
    description: new FormControl(""),
    code: new FormControl("", [Validators.required,Validators.pattern("[a-zA-Z0-9 ]+")]),
    created_by: new FormControl(""),
    created_ip: new FormControl(""),
    modified_by: new FormControl(""),
    sequence : new FormControl("", [Validators.pattern("^[0-9]*$")]),
    status: new FormControl("", [Validators.required]),
  });

  ErrorMsg:any;
  error_msg=false;

  Error = (controlName: string, errorName: string) => {
    return this.editForm.controls[controlName].hasError(errorName);
  };
  onSubmit() {
    if (this.editForm.valid) {
     this.editForm.value.created_by = this.api.userid.user_id;
     this.editForm.value.status = this.editForm.value.status==true ? 1 : 2;
     this.api
       .postAPI(
         environment.API_URL + "master/project/details",
         this.editForm.value
       )
       .subscribe((res) => {
         //this.error= res.status;
         if(res.status==environment.SUCCESS_CODE){
           // this.logger.log('Formvalue',this.editForm.value);
           this.notification.success(res.message);
         } else if(res.status==environment.ERROR_CODE) {

         } else {
           this.notification.displayMessage(language[environment.DEFAULT_LANG].unableSubmit);
         }

       });
   }
 }
}


