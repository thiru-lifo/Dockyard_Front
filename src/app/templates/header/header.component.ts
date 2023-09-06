import { Component, ViewChild, OnInit } from '@angular/core';
import { MatDialog } from "@angular/material/dialog";
import { Router } from '@angular/router';
import { ConfirmationDialogComponent } from "src/app/confirmation-dialog/confirmation-dialog.component";
import { ApiService } from "src/app/service/api.service";
import { NotificationService } from "src/app/service/notification.service";
import { environment } from "src/environments/environment";
import { language } from "src/environments/language";
import { FormGroup, FormControl, Validators, FormGroupDirective } from "@angular/forms";
import { ConsoleService } from "src/app/service/console.service";
// import custom validator  class
import { CustomValidators } from 'src/app/providers/CustomValidators';
declare var moment:any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  ErrorMsg:any;
  error_msg=false;

  @ViewChild("closebutton") closebutton;
  @ViewChild(FormGroupDirective) formGroupDirective: FormGroupDirective;


  constructor(private dialog:MatDialog,public router: Router,public api: ApiService, private notification : NotificationService) { }

  header:any;
  tmsToken:any;
  form_level_recommender:any;
  form_level_approver:any;

  project_level_recommender:any;
  project_level_approver:any;

  h_type:any;
  moment=moment;
  modules = [];
  applicant_details= this.api.decryptData(localStorage.getItem('applicant-details'));
  interval;
  currentPath=location.hash;
  appLogo=localStorage.getItem('APPLOGO')?localStorage.getItem('APPLOGO'):'';

  ngOnInit(): void {
    console.log('this.api.userid',this.api);
    this.router.events.subscribe((val) => {
      this.currentPath=location.hash;
    });
    let data = this.api.decryptData(localStorage.getItem('token-detail'));

    // Form //
    this.form_level_recommender = data.form_level_recommender
    this.form_level_approver = data.form_level_approver

    let form_recommend_count = this.form_level_recommender.length
    let form_approver_count = this.form_level_approver.length

    console.log(this.form_level_recommender, this.form_level_approver, "APProver")

    // Project //
    this.project_level_recommender = data.project_level_recommender
    this.project_level_approver = data.project_level_approver

    let project_recommend_count = this.project_level_recommender.length
    let project_approver_count = this.project_level_approver.length

    console.log(project_recommend_count, project_approver_count, "APProver _ Project")



    //console.log(data)
    this.tmsToken = localStorage.getItem('tmsToken');
    console.log( data.role_center[0].user_role.code)
    if(data.role_center.length==1){
      this.header = data.role_center[0].user_role.code
    } else {
      this.header = data.role_code
    }
    console.log(this.header)

    if(data.permissions) {
      this.modules = JSON.parse(data.permissions);
    }
    this.getPage(this.modules);

    if(this.api.userid.role_id!=1){

        if(form_recommend_count>0 || project_recommend_count>0){
          this.getNotifications(this.h_type='2');
          //console.log(recommend_count, "recommend_count")
        }else if(form_approver_count>0 || project_approver_count>0){
          this.getNotifications(this.h_type='3');
        }else{
          this.getNotifications(this.h_type='1');
        }

    }else{
      this.getNotifications(this.h_type='');
    }

    //if(this.api.userid.role_id==1){
      //this.reloadNotifications();
    //}
  }

  reloadNotifications()
  {
    // this.interval = setInterval(() => {
    //   this.getNotifications(this.h_type='');
    // },1000*60*3);

    this.interval = setInterval(() => {
      this.getNotifications(this.h_type='');
    },1000);

  }
  getPage(modules) {
    let currentUrl = modules.map(value => value.url);
    console.log(currentUrl);

  }

  updateApplicantDetails() {
    this.applicant_details= this.api.decryptData(localStorage.getItem('applicant-details'));
  }

  logout()
  {

    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: language[environment.DEFAULT_LANG].logoutMessage
    });
      dialogRef.afterClosed().subscribe(result => {
        if(result) {
          let response= localStorage.getItem('token-detail');
          let decResponse=this.api.decryptData(response);
          this.api.applicationLogoutLog();
          clearInterval(this.interval);
        }
        dialogRef=null;
      });
  }
  toggleDisplayDiv2(){
    let response= this.api.decryptData(localStorage.getItem('token-detail'));
    console.log(response)
    var body = document.body;
    body.classList.toggle(response.role_code=='admin'?'master_flow':'body_flow');

  }

  toggleMenu(){
    let response= this.api.decryptData(localStorage.getItem('token-detail'));
    var body = document.body;
    body.classList.toggle(response.role_code=='admin'?'master_flow':'body_flow');

  }

  changePasswordForm = new FormGroup({
    old_password: new FormControl("", [Validators.required]),
    new_password: new FormControl("", [Validators.required,Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')]),
    new_password2: new FormControl("", [Validators.required]),
  },
  CustomValidators.mustMatch('new_password', 'new_password2') // insert here
  );
  public signinDisable=false;

  populate(data) {
    this.changePasswordForm.patchValue(data);
  }

  initForm() {
    this.changePasswordForm.patchValue({
    });
  }

  Error = (controlName: string, errorName: string) => {
    return this.changePasswordForm.controls[controlName].hasError(errorName);
  };

  /*changePassword() {
    //this.crudName = "Add";
    //this.isReadonly=false;
    this.changePasswordForm.enable();
    let reset = this.formGroupDirective.resetForm();
    if(reset!==null) {
      this.initForm();
    }
    var element = <HTMLInputElement>document.getElementById("exampleCheck1");
    element.checked = true;
  } */
  notificationsList=[];
  getNotifications(h_type='') {
    //alert(h_type)
    console.log(h_type,"h_type")
      this.api.postAPI(environment.API_URL + "notification/get-notifications",{
        h_type : h_type,
        user_id : this.api.userid.user_id,
      }).subscribe((res) => {
        if(res.status==environment.SUCCESS_CODE){
         console.log('getNotifications',res);
         this.notificationsList=res.data;

         //console.log(this.notificationsList[0]['user_id'],"WWWW")
         //console.log(this.notificationsList,"notificationsList")
        } else if(res.status==environment.ERROR_CODE) {
            this.notification.displayMessage(res.message);
        } else {
          this.notification.displayMessage(language[environment.DEFAULT_LANG].unableSubmit);
        }
      });
  }
  saveNotificationsLog(notification_id) {
      this.api.postAPI(environment.API_URL + "notification/save-notification-log",{notification_id:notification_id}).subscribe((res) => {
        if(res.status==environment.SUCCESS_CODE){
         console.log('saveNotificationsLog',res);
         this.getNotifications();
        } else if(res.status==environment.ERROR_CODE) {
            this.notification.displayMessage(res.message);
        } else {
          this.notification.displayMessage(language[environment.DEFAULT_LANG].unableSubmit);
        }
      });
  }

  goToTrialForm(type)
  {
    switch(type)
    {
      case 'HSC':
        this.router.navigateByUrl('/transaction/etma/hs-converter');
      break;
      case 'HSRP':
        this.router.navigateByUrl('/transaction/etma/hsr-proforma');
      break;
      case 'IPDA':
        this.router.navigateByUrl('/transaction/etma/inhouse-proforma-da');
      break;
      case 'LTPDA':
        this.router.navigateByUrl('/transaction/etma/load-trial-proforma-da');
      break;
      case 'IPGTG':
        this.router.navigateByUrl('/transaction/etma/inhouse-proforma-gtg');
      break;
      case 'LTPGTG':
        this.router.navigateByUrl('/transaction/etma/load-trial-proforma-gtg');
      break;
      case 'PRTT':
        this.router.navigateByUrl('/transaction/etma/pre-refit-trial');
      break;
      case 'POTT':
        this.router.navigateByUrl('/transaction/etma/post-refit-trial');
      break;
      case 'EHC':
        this.router.navigateByUrl('/transaction/etma/eh-checks');
      break;

       // CBIU
       case 'BD':
        this.router.navigateByUrl('transaction/cbiu/boiler-data');
      break;
      case 'RTN':
        this.router.navigateByUrl('transaction/cbiu/returns');
      break;
      case 'FGA':
        this.router.navigateByUrl('transaction/cbiu/flue-gas-analyser');
      break;
      case 'BAR':
        this.router.navigateByUrl('transaction/cbiu/burner-alignment-readings');
      break;
      case 'BAP':
        this.router.navigateByUrl('transaction/cbiu/blowing-arc-port');
      break;
      case 'BASTBD':
        this.router.navigateByUrl('transaction/cbiu/blowing-arc-stbd');
      break;
       case 'ECO':
        this.router.navigateByUrl('transaction/cbiu/economiser-operating');
      break;
      case 'INFOH':
        this.router.navigateByUrl('transaction/cbiu/information-history');
      break;
      case 'INEX':
        this.router.navigateByUrl('transaction/cbiu/internal-examination');
      break;
    }
  }

  // goToTrialForm(type)
  // {
  //   switch(type)
  //   {
  //     case 'HSC':
  //       this.router.navigateByUrl('/transaction/etma/hs-converter');
  //     break;
  //     case 'HSRP':
  //       this.router.navigateByUrl('/transaction/etma/hsr-proforma');
  //     break;
  //     case 'IPDA':
  //       this.router.navigateByUrl('/transaction/etma/inhouse-proforma-da');
  //     break;
  //     case 'LTPDA':
  //       this.router.navigateByUrl('/transaction/etma/load-trial-proforma-da');
  //     break;
  //     case 'IPGTG':
  //       this.router.navigateByUrl('/transaction/etma/inhouse-proforma-gtg');
  //     break;
  //     case 'LTPGTG':
  //       this.router.navigateByUrl('/transaction/etma/load-trial-proforma-gtg');
  //     break;
  //     case 'PRTT':
  //       this.router.navigateByUrl('/transaction/etma/pre-refit-trial');
  //     break;
  //     case 'POTT':
  //       this.router.navigateByUrl('/transaction/etma/post-refit-trial');
  //     break;
  //     case 'EHC':
  //       this.router.navigateByUrl('/transaction/etma/eh-checks');
  //     break;
  //   }
  // }

  navigateTo(notification)
  {

    //console.log(notification,'notificationnotificationnotificationnotification')
    //return false;
    //console.log(notification,"notificationnotification")

    let form_id = notification.form_id;
    let transaction_id = notification.transaction_id;
    let project_id = notification.project_id;

    switch(form_id)
    {
      case 1:
        this.router.navigateByUrl('/transaction/psr/template-generation/1?pid='+project_id);
      break;
      case 2:
        this.router.navigateByUrl('/transaction/psr/gt-formulation-paper/2?pid='+project_id);
      break;
      case 3:
        this.router.navigateByUrl('/transaction/psr/gt-presentation-paper/3?pid='+project_id);
      break;
      case 4:
        this.router.navigateByUrl('/transaction/psr/gt-inputs-sr/4?pid='+project_id);
      break;
      case 5:
        this.router.navigateByUrl('/transaction/psr/gt-concept-design/5?pid='+project_id);
      break;
      case 6:
        this.router.navigateByUrl('/transaction/psr/gt-incorporation/6?pid='+project_id);
      break;
      case 7:
        this.router.navigateByUrl('/transaction/psr/gt-receipt-rfi/7?pid='+project_id);
      break;
    }
  }

  viewTrialRequest(notification)
  {

    console.log(notification,"notification123123123")
    this.navigateTo(notification)
    //console.log(transaction_id, notification_id,"AAAAAAAAAAAa")
    //this.saveNotificationsLog(notification_id);


    //this.router.navigateByUrl('/transaction/psr/template-generation/1?tran_id=200');
    //this.getInitiationTemplate();
    /*let viewTrial=trial;
    viewTrial['type']='view';
    localStorage.setItem('trial_form',this.api.encryptData(viewTrial));
    //this.goToTrialForm(viewTrial.trial_type.code);
    if(trial.trial_type.type=='Trials')
      this.router.navigateByUrl('/transaction/trials');
    if(trial.trial_type.type=='Returns')
      this.router.navigateByUrl('/transaction/returns');
    if(trial.trial_type.type=='CBPM')
      this.router.navigateByUrl('/transaction/cbpm');*/
  }

  onSubmit() {
     if (this.changePasswordForm.valid) {
      this.changePasswordForm.value.user_id = this.api.userid.user_id;
      this.api
        .postAPI(
          environment.API_URL + "api/auth/change-password",
          this.changePasswordForm.value
        )
        .subscribe((res) => {
          //this.logger.log('response',res);
          //this.error= res.status;
          if(res.status==environment.SUCCESS_CODE){
            // this.logger.log('Formvalue',this.changePasswordForm.value);
            this.notification.success(res.message);
            this.closebutton.nativeElement.click();
          } else if(res.status==environment.ERROR_CODE) {
            this.error_msg=true;
            this.ErrorMsg=res.message;
            setTimeout(()=> {
              this.error_msg = false;
           }, 2000);
          } else {
            this.notification.displayMessage(language[environment.DEFAULT_LANG].unableSubmit);
          }

        });
    }
  }
close(){
  this.formGroupDirective.resetForm()

}
}
