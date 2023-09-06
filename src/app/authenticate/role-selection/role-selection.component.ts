import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { environment } from "src/environments/environment";
import { ApiService } from "src/app/service/api.service";

@Component({
  selector: 'app-role-selection',
  templateUrl: './role-selection.component.html',
  styleUrls: ['./role-selection.component.scss']
})
export class RoleSelectionComponent implements OnInit {

  constructor(private api : ApiService, private router : Router) { }
    roles=[];
    resData:any;
    ngOnInit(): void {
      localStorage.removeItem('tmsToken');
      localStorage.removeItem('liveCounter');
      this.getUserRole(); 
    }
    RoleForm = new FormGroup({
        rolename:new FormControl('',[Validators.required]),
    });

    Error = (controlName: string, errorName: string) => {
    return this.RoleForm.controls[controlName].hasError(errorName);
  };

  appLogo=localStorage.getItem('APPLOGO')?localStorage.getItem('APPLOGO'):'';

    getUserRole() {
        this.resData = this.api.decryptData(localStorage.getItem('token-detail'));
        this.roles = this.resData.role_center;
        console.log(this.resData.role_center);
    }

    SelectRole() {
      console.log(this.RoleForm.value.rolename.user_role.id)
        if(this.RoleForm.valid){
          this.api.getAPI(environment.API_URL+"access/permissions?user_role_id="+this.RoleForm.value.rolename.user_role.id+'&process_id='+this.resData.process_id).subscribe((res)=>{
            if(res.status==environment.SUCCESS_CODE) {
              if(res.data.length==1){
                let data =this.api.decryptData(localStorage.getItem('token-detail'));
                data.permissions = res.data[0].permissions;
                

                data.role_code=this.RoleForm.value.rolename.user_role.code;
                data.role_id=this.RoleForm.value.rolename.user_role.id;
                data.center=this.RoleForm.value.rolename.center?this.RoleForm.value.rolename.center.id:'';
                data.center_name=this.RoleForm.value.rolename.center?this.RoleForm.value.rolename.center.name:'';
                data.role_name = this.RoleForm.value.rolename.user_role.name;
                
                this.api.postAPI(environment.API_URL+"api/auth/authentications",{user_id:this.resData.user_id,user_role_id:this.RoleForm.value.rolename.user_role.id,center_id:(this.RoleForm.value.rolename.center?this.RoleForm.value.rolename.center.id:'')}).subscribe((res)=>{
                  console.log(res.authentication.fpdata)
                  data.token_user=res.authentication.token_user;
                  localStorage.setItem('token-detail',this.api.encryptData(data));
                  if(res.authentication.biometric) {
                    if(res.authentication.fpdata.length<3) {
                     this.router.navigateByUrl('/authenticate/biometrics-log');
                    } else {
                      this.router.navigateByUrl('/authenticate/biometrics-verify');
                    }
                  } else if(res.authentication.twofactor){
                    this.router.navigateByUrl('/authenticate/twofactor');
                  } else {
                    switch(this.RoleForm.value.rolename.user_role.code)
                    { 
                      case 'admin':
                      this.router.navigateByUrl('dashboard/admin');
                      break;
                      case 'gro':
                      this.router.navigateByUrl('/gro/dashboard');
                      break;
                      case 'nurse':
                      this.router.navigateByUrl('/nurse/dashboard-nurse');
                      break;
                      default:
                      this.router.navigateByUrl('dashboard/admin');
                      break; 
                    }
                  }
                });
              }
            }
          });
          
      }  
     

    }
  
  }