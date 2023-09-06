import { Component, OnInit, ViewChild, Input, ElementRef } from "@angular/core";
import { ApiService } from "src/app/service/api.service";
import { environment } from "src/environments/environment";
import { FormGroup, FormControl, Validators, FormGroupDirective } from "@angular/forms";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { NotificationService } from "src/app/service/notification.service";
import { ConfirmationDialogComponent } from "src/app/confirmation-dialog/confirmation-dialog.component";
import { MatDialog } from "@angular/material/dialog";
import { language } from "src/environments/language";
import { Router } from '@angular/router';
import { ConsoleService } from "src/app/service/console.service";
import { of } from 'rxjs';

@Component({
  selector: 'app-sections',
  templateUrl: './unit.component.html',
  styleUrls: ['./unit.component.scss']
})
export class UnitComponent implements OnInit {


  displayedColumns: string[] = [
    //'command_id',
    "section_id",
    //"department_id",
    "unit_type_id",
    "name",
    "code",
    "status",
    "view",
    "edit",
    "delete",

  ];
  dataSource: MatTableDataSource<any>;

  country: any;
  public crudName = "Add";
  public countryList = [];
  filterValue:any;
  isReadonly=false;
  moduleAccess:any;
  ErrorMsg:any;
  error_msg=false;

  public permission={
    add:false,
    edit:false,
    view:false,
    delete:false,
  };

  @ViewChild(MatPaginator) pagination: MatPaginator;
  @ViewChild("closebutton") closebutton;
  @ViewChild(FormGroupDirective) formGroupDirective: FormGroupDirective;

  constructor(public api: ApiService, private notification : NotificationService,
    private dialog:MatDialog, private router : Router, private elementref : ElementRef,private logger:ConsoleService) {

  }

  public editForm = new FormGroup({
    id: new FormControl(""),
    //command_id: new FormControl("",[Validators.required]),
    section_id: new FormControl("",[Validators.required]),
    //department_id: new FormControl("",[Validators.required]),
    unit_type_id: new FormControl("",[Validators.required]),
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
   status = this.editForm.value.status;
  populate(data) {

    this.editForm.patchValue(data);
    //this.editForm.patchValue({command_id:data.command_id.id});
    this.editForm.patchValue({section_id:data.section_id.id});
    //this.editForm.patchValue({department_id:data.department_id.id});
    this.editForm.patchValue({unit_type_id:data.unit_type_id.id});
    //this.editForm.patchValue({trial_unit:data.trial_unit.id});
    /*this.getCommand(data.trial_unit.id);
    this.getSatelliteUnits(data.trial_unit.id,data.command.id);
    this.getShips(data.trial_unit.id,data.satellite_unit.id);
    setTimeout(()=>{
      this.editForm.patchValue({satellite_unit:data.satellite_unit.id});
      this.editForm.patchValue({command:data.command?data.command.id:''});
      this.editForm.patchValue({ship:data.ship.id});
    },500);*/
    this.editForm.patchValue({modified_by:this.api.userid.user_id});
    this.logger.info(data.status)
  }

  initForm() {
    this.editForm.patchValue({
      status: "1",
    });
  }

  Error = (controlName: string, errorName: string) => {
    return this.editForm.controls[controlName].hasError(errorName);
  };

  ngOnInit(): void {
     this.getUnit();
     this.getCommand();
     this.getSection();
     this.getDepartment();
     this.getUnitType();
     this.getAccess();
     this.geCompartments();
     this.getSystems();
     //this.get();
  }

  commands:any;
  getCommand() {
    this.api
      .getAPI(environment.API_URL + "master/command?status=1")
      .subscribe((res) => {
        this.commands = res.data;
      });
  }
  sections:any;
  getSection() {
    this.api
      .getAPI(environment.API_URL + "master/section?status=1")
      .subscribe((res) => {
        this.sections = res.data;

      });
  }
  departments:any;
  getDepartment() {
    this.api
      .getAPI(environment.API_URL + "master/department?status=1")
      .subscribe((res) => {
        this.departments = res.data;
      });
  }
  unit_types:any;
  getUnitType() {

    this.api
      .getAPI(environment.API_URL + "master/unit_type?status=1")
      .subscribe((res) => {
        this.unit_types = res.data;
      });
  }

  compartments:any;
  geCompartments() {
    this.api
      .getAPI(environment.API_URL + "master/compartment?status=1")
      .subscribe((res) => {
        this.compartments = res.data;

      });
  }

  systems:any;
  getSystems() {
    this.api
      .getAPI(environment.API_URL + "master/system?status=1")
      .subscribe((res) => {
        this.systems = res.data;

      });
  }


  equipments:any;
  getEquipments() {
    this.api
      .getAPI(environment.API_URL + "master/equipments?status=1")
      .subscribe((res) => {
        this.equipments = res.data;

      });
  }

  /*syncSections()
  {
    this.api.displayLoading(true);
    this.api.postAPI(environment.API_URL + "transaction/sync/sections", {}).subscribe((res)=>{
        this.logger.log('response',res);
        this.api.displayLoading(false);
        if(res.status==environment.SUCCESS_CODE) {
          this.notification.success(res.message);
          this.getSubSection();
        } else {
          this.notification.displayMessage(language[environment.DEFAULT_LANG].unableSubmit);
        }
      });
  }*/
  /*department:any;
  getDepartment(trial_unit_id='', command_id='') {
      this.api
        .getAPI(environment.API_URL + "master/department?trial_unit_id="+trial_unit_id+"&command_id="+command_id+'&status=1')
        .subscribe((res) => {
          this.department = res.data;
        });
  }

  ships:any;
  getShips(trial_unit_id='',satellite_unit_id='') {
    this.api
      .getAPI(environment.API_URL + "master/ships?satellite_unit_id="+satellite_unit_id+"&trial_unit_id="+trial_unit_id+'&status=1')
      .subscribe((res) => {
        this.ships = res.data;
      });
  }*/
  getUnit() {
    if(this.param==undefined) this.param=""; else this.param;
    this.api
      .getAPI(environment.API_URL + "master/unit?"+this.param)
    
      .subscribe((res) => {
        this.dataSource = new MatTableDataSource(res.data);
        this.countryList = res.data;
        this.dataSource.paginator = this.pagination;
        this.logger.log('country',this.countryList)
      });
  }

  create() {
    this.crudName = "Add";
    this.isReadonly=false;
    this.editForm.enable();
    let reset = this.formGroupDirective.resetForm();
    if(reset!==null) {
      this.initForm();
    }
    var element = <HTMLInputElement>document.getElementById("exampleCheck1");
    element.checked = true;
  }

  editOption(country) {
    this.isReadonly=false;
    this.editForm.enable();
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

  onView(country) {
    this.crudName = 'View';
    this.isReadonly=true;
    this.editForm.disable();
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
        this.api.postAPI(environment.API_URL + "master/unit/details", {
          id: id,
          status: 3,
        }).subscribe((res)=>{
          this.logger.log('response',res);
          if(res.status==environment.SUCCESS_CODE) {
            this.logger.info('delete')
            this.notification.warn('Unit '+language[environment.DEFAULT_LANG].deleteMsg);
            this.getUnit();
          } else {
            this.notification.displayMessage(language[environment.DEFAULT_LANG].unableDelete);
          }
        });
      }
      dialogRef=null;
    });
  }

  onSubmit() {
     if (this.editForm.valid) {
      this.editForm.value.created_by = this.api.userid.user_id;
      this.editForm.value.status = this.editForm.value.status==true ? 1 : 2;
      this.api
        .postAPI(
          environment.API_URL + "master/unit/details",
          this.editForm.value
        )
        .subscribe((res) => {
          this.logger.log('response',res);
          //this.error= res.status;
          if(res.status==environment.SUCCESS_CODE){
            // this.logger.log('Formvalue',this.editForm.value);
            this.notification.success(res.message);
            this.getUnit();
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
      this.getUnit();
    }
  }
  numberOnly(event:any): boolean {
    var key = event.keyCode;
          if (key > 31 && (key < 65 || key > 90) &&
              (key < 97 || key > 122)) {
          return false;
        }
        return true;
  
      }
       searchForm= new FormGroup({
   section:new FormControl(""),
   unit_type:new FormControl(""),
    
  })
  param:any;
  search(){
  let type=this.searchForm.value.section?"section_id="+this.searchForm.value.section:"";
  type+=this.searchForm.value.unit_type?"&unit_type_id="+this.searchForm.value.unit_type:"";
    this.param=type;
    this.getUnit();
  }

 clear(){
    this.searchForm.reset();
    this.param="";
    this.getUnit();
  }
 chooseCountry(event) {
    this.getSection();
    
  }
  chooseUnitType(event) {
    this.getUnitType();
    
  }
}

