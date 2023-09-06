import { Component, OnInit, ViewChild, Input, ElementRef } from "@angular/core";
import { ApiService } from "src/app/service/api.service";
import { environment } from "src/environments/environment";
import { FormGroup, FormControl, Validators, FormBuilder, FormGroupDirective, FormArray } from "@angular/forms";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { NotificationService } from "src/app/service/notification.service";
import { ConfirmationDialogComponent } from "src/app/confirmation-dialog/confirmation-dialog.component";
import { MatDialog } from "@angular/material/dialog";
import { language } from "src/environments/language";
import { Router } from '@angular/router';
import { ConsoleService } from "src/app/service/console.service";
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
declare var arrayColumn:any;
declare var inArray:any;

@Component({
  selector: 'app-users',
  templateUrl: './user-role.component.html',
  styleUrls: ['./user-role.component.scss']
})
export class UserRole implements OnInit {

  displayedColumns: string[] = [
    "name",
    "code",
    "status",
    "view",
    "edit",
    "delete",

  ];
  dataSource: MatTableDataSource<any>;
  inArray=inArray;
  user: any;
  crudName = "Add";
  UserList = [];
  trials = [];
  satellite = [];
  ships=[];
  trial_unit:any;
  filterValue:any;
  isReadonly=false;
  moduleAccess:any;
  ErrorMsg:any;
  error_msg=false;
  allSelected=false;
  allSelectedSAT=false;
  isPassword=false;

  public permission={
    add:false,
    edit:false,
    view:false,
    delete:false,
  };

  @ViewChild(MatPaginator) pagination: MatPaginator;
  @ViewChild('select') select: MatSelect;
  @ViewChild('selectSAT') selectSAT: MatSelect;
  @ViewChild("closebutton") closebutton;
  @ViewChild(FormGroupDirective) formGroupDirective: FormGroupDirective;

  constructor(public api: ApiService, private notification : NotificationService,
    private dialog:MatDialog, private router : Router, private elementref : ElementRef,private logger:ConsoleService,
    private formBuilder: FormBuilder
    ,) {

  }
  docForm!: FormGroup;
  items!: FormArray;

  public editForm = new FormGroup({
    id: new FormControl(""),
    name: new FormControl("", [
      Validators.required,
      Validators.pattern("[a-zA-Z ]+"),
      Validators.minLength(3),
      Validators.maxLength(15)
    ]),
    code: new FormControl("", [
      Validators.required,
      Validators.pattern("[a-zA-Z ]+"),
    ]),
    designations: new FormControl("",[Validators.required]),
    created_by: new FormControl(""),
    modified_by: new FormControl(""),
    status: new FormControl(""),
  });


   status = this.editForm.value.status;
   clearFormArray = (formArray: FormArray) => {
    while (formArray.length !== 0) {
      formArray.removeAt(0)
    }
  }


  populate(data) {
    //alert('sss')
    //this.editForm.get('password').clearValidators();
    //this.editForm.get('password').updateValueAndValidity();

    //console.log(data.data_access)
    let des_id = [];
    for(let d=0; d<data.data_access.length; d++){

      let des = data.data_access[d].designation;
      des_id.push(parseInt(des))
    }

    console.log(des_id, 'Designation')
    this.items = this.docForm.get('items') as FormArray;
    this.clearFormArray(this.items);
    this.editForm.patchValue({
      id:data.id,
      name:data.name,
      code:data.code,
      designations:des_id,
      created_by:data.created_by,
      modified_by:this.api.userid.user_id,
      status:data.status
    });
    //this.editForm.patchValue({department:data.department.id,process:data.process.id});
    //let actions = data.roles.map(function(a){console.log(a.user_role);return a.user_role['id'];});
    //this.editForm.patchValue({user_role_id:actions});
    //console.log(this.editForm.value.user_role_id);
     if(data.data_access.length>0)
     {
       let designation = '';
    //   let satellite_unit_id ='';
    //   let  ship_id = [];
    //   //console.log('ship_id',ship_id);
       for(let i=0;i<data.data_access.length;i++)
       {

         designation = data.data_access[i].designation;
    //     satellite_unit_id = data.data_access[i].satellite_unit.id;
    //     //  itemDet=this.formBuilder.group({
    //     // designation: data.data_access[i].trial_unit.id,
    //     //    satellite_unit_id: data.data_access[i].satellite_unit.id,

    //     //  });
    //     //designation: data.data_access[i].trial_unit.id,
    //     //console.log('data.data_access[i]',data.data_access[i]);
    //     ship_id=[];
    //     for(let j=0;j< data.data_access[i].ships.length;j++)
    //     {
    //       let sId = data.data_access[i].ships[j].ship['id'];
    //       ship_id.push(sId);
    //     }

    //     // let list = data.data_access[i].ships.map(function(s){console.log("dava",s.ship['id']);return s.ship['id'];})
    //     // this.docForm.get('ship_id').patchValue({list})
         //this.items.push(this.formBuilder.group({designation: designation}));
         this.items.push(this.formBuilder.group({designation: designation}));
    //     console.log(this.items)
    //     console.log('ship_id-129',ship_id);

       }
    //   this.getSatellite();
    //   this.getShips();
     }
     else
     {
       this.items = this.docForm.get('items') as FormArray;
       this.items.push(this.formBuilder.group({designation: ''}));
     }
  }

  checkShipinSatelliteUnit(ship,trail_unit_id,satellite_unit_id)
  {
    if(satellite_unit_id)
    {
      let satIds=arrayColumn(arrayColumn(ship.satellite_units,'satellite_unit'),'id');
      return ship.trial_unit.id==trail_unit_id && inArray(satellite_unit_id,satIds);
    }
    else
      return false;
  }

  initForm() {
    this.editForm.patchValue({
      status: "1",
    });
  }

  displayShips(units)
  {
    let ship_id='';
    for(let i=0;i<units.length;i++)
      ship_id+=units[i].ship.name+' & ';
    return ship_id.substring(0,(ship_id.length)-3);

  }

  Error = (controlName: string, errorName: string) => {
    return this.editForm.controls[controlName].hasError(errorName);
  };

  ngOnInit(): void {
    console.log('this.api.userid',this.api.userid);
     /*this.getUserRoles();*/
     this.getProcess();
     //this.getTrial();
     //this.getDepartment();
     //this.getSatellite();
     this.getAccess();
     this.getUserList();
     this.getDesignation();

  }

  designations:any;
  getDesignation() {
    this.api
      .getAPI(environment.API_URL + "master/designation?status=1")
      .subscribe((res) => {
        this.designations = res.data;
        console.log('Designation',res.data)

      });
  }

  departmentList=[];
  getDepartment() {
    this.api.getAPI(environment.API_URL + "master/department?status=1").subscribe((res) => {
        this.departmentList = res.data;
    });
  }

  processChange(process_id)
  {
    if(process_id)
    {
      this.getUserRoles(process_id);
    }
  }

  getUserList() {
     this.api
    .getAPI(environment.API_URL + "access/user_role")
    .subscribe((res) => {
      this.dataSource = new MatTableDataSource(res.data);
      this.dataSource.paginator = this.pagination;
      this.user = res.data;
      console.log('user',this.user)
    });
  }

  getUserRoles(process_id='') {
    let searchString='?status=1';
    searchString+=process_id?'&process_id='+process_id:'';
   this.api
    .getAPI(environment.API_URL + "access/access_user_roles"+searchString)
    .subscribe((res) => {
      this.UserList = res.data;
      console.log('UserList',this.UserList)
    });

  }
  processList=[];
  getProcess() {
   this.api
    .getAPI(environment.API_URL + "access/process")
    .subscribe((res) => {
      this.processList = res.data;
      console.log('processList',this.processList);

      this.docForm = new FormGroup({
          items: new FormArray([]),
          ship_id :new FormArray([]),

      });
    });
  }

  getTrial() {
   this.api
    .getAPI(environment.API_URL + "master/trial_units?status=1")
    .subscribe((res) => {
      this.trials = res.data;
      console.log('UserList',this.trials)
    });
  }


  getSatellite(designation='') {
   this.api
    .getAPI(environment.API_URL + "master/satellite_units?status=1")
    .subscribe((res) => {
      this.satellite = res.data;
      console.log('UserListSat',this.satellite)
    });
  }

  getShips(satellite_unit_id='') {
    let searchString=satellite_unit_id?'&satellite_unit_id='+satellite_unit_id:'';
    this.api
     .getAPI(environment.API_URL + "master/ships?&status=1"+searchString)
     .subscribe((res) => {
       this.ships = res.data;
       console.log('UserListship',this.ships)
     });
   }

  createItem(): FormGroup {
    return this.formBuilder.group({
      designation: '',
       //satellite_unit_id:'',
       // ship_id:'',

    });
  }

  addMore(): void {
    this.items = this.docForm.get('items') as FormArray;
    this.items.push(this.createItem());
    console.log(this.items)
  }

  removeItem(i): void {
    this.items.removeAt(i);
    /*delete this.items.value[i];
    delete this.items.controls[i];*/
    console.log(this.items)
  }



  create() {
    //this.editForm.get('password').setValidators([Validators.required]);
    //this.editForm.get('password').updateValueAndValidity();
    this.crudName = "Add";
    this.isPassword = true;
    this.isReadonly=false;
    this.editForm.enable();
    let reset = this.formGroupDirective.resetForm();
    if(reset!==null) {
      this.initForm();
    }
    var element = <HTMLInputElement>document.getElementById("exampleCheck1");
    element.checked = true;
    this.items = this.docForm.get('items') as FormArray;
    this.clearFormArray(this.items);
    this.items.push(this.formBuilder.group({designation: ''}));
  }

  editOption(country) {
    console.log('country',country)
    this.isReadonly=false
    this.editForm.enable();
    this.isPassword = false;
    this.crudName = "Edit";
    this.logger.info(country);
    this.populate(country);
    var element = <HTMLInputElement> document.getElementById("exampleCheck1");
    if(this.editForm.value.status == 1) {
     element.checked = true;
    }
    else {
     element.checked = false;
    }
  }
 pro=false;
  onView(country) {
    
    this.crudName = 'View';
    this.pro=true;
    this.isReadonly=true;
    this.editForm.disable();
    this.docForm.disable();
    this.populate(country);
    var element = <HTMLInputElement> document.getElementById("exampleCheck1");
    if(this.editForm.value.status == 1) {
     element.checked = true;
    }
    else {
     element.checked = false;
    }
  }

  onDelete(id) {
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: language[environment.DEFAULT_LANG].confirmMessage
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.api.postAPI(environment.API_URL + "access/user_role/details", {
          id: id,
          status: 3,
          data_access:'',
        }).subscribe((res)=>{
          this.logger.log('response',res);
          if(res.status==environment.SUCCESS_CODE) {
            this.logger.info('delete')
            this.notification.warn('User Role '+language[environment.DEFAULT_LANG].deleteMsg);
            this.getUserList();
          } else {
            this.notification.displayMessage(language[environment.DEFAULT_LANG].unableDelete);
          }
        });
      }
      dialogRef=null;
    });
  }
  accessArr=[];
  onSubmit() {
    //console.log('this.items.value',this.items.value);
    // let trial_unit,satellite_unit,obj;
    /*for(let i =0; i<this.docForm.value.items.length; i++) {
      trial_unit=this.docForm.value.items[i].trial_unit;
      satellite_unit=this.docForm.value.items[i].satellite_unit;
      obj={'designation':trial_unit,'satellite_unit_id':satellite_unit}
      for(let i=0; i<this.accessArr.length;i++) {
        if(this.accessArr[i].trial_unit === obj.trial_unit && this.accessArr[i].satellite_unit === obj.satellite_unit)
        this.accessArr.splice(i,1)
      }
      this.accessArr.push(obj)
    }*/
    
    let data_access ={'data_access':this.items.value}
     console.log(this.editForm)
     //return false;
     if (this.editForm.valid) {
    
      this.editForm.value.created_by = this.api.userid.user_id;
      this.editForm.value.status = this.editForm.value.status==true ? 1 : 2;
       let formVal={
        ...this.editForm.value,
        ...data_access

       }
       console.log(this.items.value);
       console.log(this.editForm.value);
       console.log(formVal)
//return false;
    if (formVal.id!='' && formVal.id!=null)
      delete formVal.password;
     console.log(formVal)
      this.api
        .postAPI(
          environment.API_URL + "access/user_role/details",
          formVal
        )
        .subscribe((res) => {
          this.logger.log('response',res);

          if(res.status==environment.SUCCESS_CODE){
            // this.logger.log('Formvalue',this.editForm.value);
            this.notification.success(res.message);
            this.getUserList();
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
      this.getUserList();
    }
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

   toggleAllSelectionSAT() {
    if (this.allSelectedSAT) {
      this.selectSAT.options.forEach((item: MatOption) => item.select());
    } else {
      this.selectSAT.options.forEach((item: MatOption) => item.deselect());
    }
  }
  optionClickSAT() {
    let newStatus = true;
    this.selectSAT.options.forEach((item: MatOption) => {
      if (!item.selected) {
        newStatus = false;
      }
    });
    this.allSelectedSAT = newStatus;
  }

numberOnly(event:any): boolean {
    var key = event.keyCode;
          if (key > 31 && (key < 65 || key > 90) &&
              (key < 97 || key > 122)) {
          return false;
        }
        return true;
  
      }

}
