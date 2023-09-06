
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
  selector: 'app-boiler',
  templateUrl: './boiler.component.html',
  styleUrls: ['./boiler.component.scss']
})
export class BoilerComponent implements OnInit {


  displayedColumns: string[] = [
    "trial_unit",
    "command",
    "satellite_unit",
    "ship",
    "section",
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
    trial_unit: new FormControl("",[Validators.required]),
    command : new FormControl("",[Validators.required]),
    satellite_unit: new FormControl("",[Validators.required]),
    ship: new FormControl("",[Validators.required]),
    section: new FormControl("",[Validators.required]),
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
    this.editForm.patchValue({trial_unit:data.trial_unit.id});
    this.getCommand(data.trial_unit.id);
    this.getSatelliteUnits(data.trial_unit.id,data.command.id);
    this.getShips(data.trial_unit.id,data.satellite_unit.id);
    this.getSections(data.trial_unit.id,data.satellite_unit.id,data.ship.id);
    setTimeout(()=>{
      this.editForm.patchValue({satellite_unit:data.satellite_unit.id});
      this.editForm.patchValue({command:data.command?data.command.id:''});
      this.editForm.patchValue({ship:data.ship?data.ship.id:''});
      this.editForm.patchValue({section:data.section?data.section.id:''});
    },500);
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
     this.getBoilers();
     this.getTrialUnits();
     this.getAccess();
  }
  trialUnits:any;

  getTrialUnits() {
    this.api
      .getAPI(environment.API_URL + "master/trial_units?status=1")
      .subscribe((res) => {
        this.trialUnits = res.data;
      });
  }
  commands:any;
  getCommand(trial_unit_id= '') {
      this.api
        .getAPI(environment.API_URL + "master/command?trial_unit_id="+trial_unit_id+'&status=1')
        .subscribe((res) => {
          this.commands =res.data;
        });
    }

    satelliteUnits:any;
    getSatelliteUnits(trial_unit_id='',command_id='') {
      this.api
        .getAPI(environment.API_URL + "master/satellite_units?trial_unit_id="+trial_unit_id+"&command_id="+command_id+'&status=1')
        .subscribe((res) => {
          this.satelliteUnits = res.data;
        });
    }

ships:any;
getShips(trial_unit_id='',satellite_unit_id='') {
  this.api
    .getAPI(environment.API_URL + "master/ships?satellite_unit_id="+satellite_unit_id+"&trial_unit_id="+trial_unit_id+'&status=1')
    .subscribe((res) => {
      this.ships = res.data;
    });
}
  sections:any;
  getSections(trial_unit_id='',satellite_unit_id='',ship_id='') {
    this.api
      .getAPI(environment.API_URL + "master/sections?trial_unit_id="+trial_unit_id+"&satellite_unit_id="+satellite_unit_id+"&ship_id="+ship_id+'&status=1')
      .subscribe((res) => {
        this.sections = res.data;
      });
  }
  getBoilers() {
    this.api
      .getAPI(environment.API_URL + "master/boilers")
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
        this.api.postAPI(environment.API_URL + "master/boilers/crud", {
          id: id,
          status: 3,
        }).subscribe((res)=>{
          this.logger.log('response',res);
          if(res.status==environment.SUCCESS_CODE) {
            this.logger.info('delete')
            this.notification.warn('Boilers '+language[environment.DEFAULT_LANG].deleteMsg);
            this.getBoilers();
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
          environment.API_URL + "master/boilers/crud",
          this.editForm.value
        )
        .subscribe((res) => {
          this.logger.log('response',res);
          //this.error= res.status;
          if(res.status==environment.SUCCESS_CODE){
            // this.logger.log('Formvalue',this.editForm.value);
            this.notification.success(res.message);
            this.getBoilers();
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
      this.getBoilers();
    }
  }

}



