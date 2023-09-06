import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from "src/app/service/api.service";
import { ConsoleService } from "src/app/service/console.service";
import { environment } from "src/environments/environment";
import { FormGroup, FormControl, Validators, FormGroupDirective } from "@angular/forms";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { NotificationService } from "src/app/service/notification.service";
import { ConfirmationDialogComponent } from "src/app/confirmation-dialog/confirmation-dialog.component";
import { MatDialog } from "@angular/material/dialog";
import { language } from "src/environments/language";


@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss']
})
export class ConfigComponent implements OnInit {

 displayedColumns: string[] = [
    "name",
    "value",
    "center_detail",
    "isCenter",
    "role",
    "view",
    "edit",
  ];
  dataSource: MatTableDataSource<any>;

  isReadOnly=false;
  public crudName = "Add";
  public ConfigList = [];
  centers=[];
  roles=[];
  values:any;
  ErrorMsg:any;
  error_msg=false;
  config:any;

  iscentercheck = false;
  allSelected=false;

  moduleAccess:any;
  filterValue:any;
  public permission={
    add:false,
    edit:false,
    view:false,
    delete:false,
  };


  @ViewChild(MatPaginator) pagination: MatPaginator;
  @ViewChild("closebutton") closebutton;
  @ViewChild('select') select: MatSelect;
  @ViewChild(FormGroupDirective) formGroupDirective: FormGroupDirective;

  constructor(public api: ApiService, private notification : NotificationService,
    private dialog:MatDialog, private logger : ConsoleService) {}

  public editForm = new FormGroup({
    id: new FormControl(""),
    name: new FormControl("", [Validators.required,Validators.pattern('^[a-zA-Z \-\']+')]),
    code: new FormControl("", [Validators.required,Validators.pattern('[a-zA-Z0-9 ]+')]),
    value: new FormControl("", [Validators.required]),
    center: new FormControl(""),
    isCenter: new FormControl(""),
    role : new FormControl(""),
    status : new FormControl(""),
    created_by: new FormControl(""),
    modified_by:new FormControl("")
  });

  populate(data) {
   let list = data.center_detail.map(function(a){return a['id'];});

   this.editForm.patchValue({center:list});
   this.editForm.patchValue({name:data.name});
   this.editForm.patchValue({id:data.id});
   this.editForm.patchValue({code:data.code});
   if(data.type=='text' || data.type=='textarea' || data.type=='email' || data.type=='number' ) {
    this.editForm.patchValue({value:(data.value?data.value:data.default_values)});
  } else{ 
    this.editForm.patchValue({value:data.value});
   }
   let actions = data.role_detail.map(function(a){return a['id'];});
   this.editForm.patchValue({role:actions});
   this.editForm.patchValue({isCenter:data.isCenter});
   this.editForm.patchValue({status:data.status});
   this.editForm.patchValue({created_by:data.created_by});
   this.editForm.patchValue({modified_by:this.api.userid.user_id});
   // this.logger.info(data.role)
  }

  initForm() {
    this.editForm.patchValue({
      id: "",
      name: "",
      code: "",
      created_by: "",
      // created_ip: "127.0.0.1",
      status:"1",
      value: "",
      isCenter: "",
      center: "",
    });
  }

  Error = (controlName: string, errorName: string) => {
    return this.editForm.controls[controlName].hasError(errorName);
  };

  extractValue(arr, prop) {
      let extractedValue = arr.map(item => item[prop]);
      return extractedValue;      
  }

  ngOnInit(): void {
    this.getConfig();
    this.getCenter();
    this.getAccess();
    this.getRoles();
  }

  toggleShow() {
    this.iscentercheck = !this.iscentercheck;
  }

  getConfig() {
    this.api
      .getAPI(environment.API_URL + "configuration/configuration_table")
      .subscribe((res) => {
        this.logger.log('config',res);
        this.dataSource = new MatTableDataSource(res.data);
        this.ConfigList = res.data;
        this.dataSource.paginator = this.pagination;     
      });
  } 

  getCenter() {
    this.api
    .getAPI(environment.API_URL + "master/center")
    .subscribe((res)=>{
      this.centers = res.data;
    })
  }

  getRoles() {
    this.api
    .getAPI(environment.API_URL + "access/access_user_roles")
    .subscribe((res)=>{
      this.roles = res.data;
    })
  }

  create() {
    this.crudName = "Add";
    this.iscentercheck = false;
    let reset = this.formGroupDirective.resetForm();
    if(reset!==null) {
      this.initForm();
    }
    
  } 

  editOption(config) {
    this.crudName = "Edit";
    this.editForm.enable();
    this.isReadOnly=false;
    this.logger.info(config);
    // console.log(config.default_values);
    this.populate(config);
    this.config=config;

    var element = <HTMLInputElement> document.getElementById("exampleCheck1");
    if(this.editForm.value.isCenter == true) {
     this.iscentercheck=true;
    }
    else {
     this.iscentercheck=false;
    }
  }

  onView(catalog) {
    this.crudName = 'View';
    this.editForm.disable();
    this.isReadOnly=true;
    // this.isReadonly=true;
    this.populate(catalog);
    var element = <HTMLInputElement> document.getElementById("exampleCheck1");
    if(this.editForm.value.status == 1) {
     element.checked = true;
    }
    else {
     element.checked = false;
    }
  }

  onSubmit() {
     if (this.editForm.valid) {
      this.editForm.value.created_by = this.api.userid.user_id;
      this.editForm.value.isCenter = this.editForm.value.isCenter ? "true" : "false";
      this.editForm.value.center = this.editForm.value.center;
      this.api
        .postAPI(
          environment.API_URL + "configuration/configuration_table/details",
          this.editForm.value
        )
        .subscribe((res) => {
          this.logger.log('FormValue',res);
          if(res.status==environment.SUCCESS_CODE) {
          this.notification.success(res.message);
          this.getConfig();
          this.closebutton.nativeElement.click();
        }else if(res.status==environment.ERROR_CODE) {
          // this.notification.success(res.message);
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
  close() {
    // this.initForm()
  }
   toggleAllSelection() {
    if (this.allSelected) {
      this.select.options.forEach((item: MatOption) => item.select());
    } else {
      this.select.options.forEach((item: MatOption) => item.deselect());
    }
  }
  optionClick() {
    let newStatus = true;
    this.select.options.forEach((item: MatOption) => {
      if (!item.selected) {
        newStatus = false;
      }
    });
    this.allSelected = newStatus;
  }

  getAccess() {
    this.moduleAccess=this.api.getPageAction();
    if(this.moduleAccess)
    {
      let addPermission=(this.moduleAccess).filter(function(access){ if(access.code=='ADD') return access.status; }).map(function(obj) {return obj.status;});
      let editPermission=(this.moduleAccess).filter(function(access){ if(access.code=='EDIT') { return access.status;} }).map(function(obj) {return obj.status;});;
      let viewPermission=(this.moduleAccess).filter(function(access){ if(access.code=='VIW') { return access.status;} }).map(function(obj) {return obj.status;});;
      let deletePermission=(this.moduleAccess).filter(function(access){ if(access.code=='DEL') { return access.status;} }).map(function(obj) {return obj.status;});;
      this.permission.add=addPermission.length>0?addPermission[0]:false;
      this.permission.edit=editPermission.length>0?editPermission[0]:false;;
      this.permission.view=viewPermission.length>0?viewPermission[0]:false;;
      this.permission.delete=deletePermission.length>0?deletePermission[0]:false;;
    }

     this.logger.log('this.permission',this.permission);
  }
  
  applyFilter(event: Event) {
    this.filterValue = (event.target as HTMLInputElement).value;
    if(this.filterValue){
      this.dataSource.filter = this.filterValue.trim().toLowerCase();
    } else {
      this.getConfig();
    }
  }
}