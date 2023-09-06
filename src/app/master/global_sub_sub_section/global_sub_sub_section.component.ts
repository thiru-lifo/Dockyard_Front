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
  selector: 'app-global_sub_sub_sections',
  templateUrl: './global_sub_sub_section.component.html',
  styleUrls: ['./global_sub_sub_section.component.scss']
})
export class GlobalSubSubSectionComponent implements OnInit {


  displayedColumns: string[] = [
    "module",
    "sub_module",
    "global_section",
    "global_sub_section",
    "name",
    "section_no",    
    "code",
    "status",
    "view",
    "edit",
    "delete",

  ];
  dataSource: MatTableDataSource<any>;

  selectedValue = '';
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
    module: new FormControl("",[Validators.required]),
    sub_module: new FormControl("",[Validators.required]),
    global_section: new FormControl("",[Validators.required]),
    global_sub_section: new FormControl("",[Validators.required]),
    section_no: new FormControl("",[Validators.required]),
    name: new FormControl("",[Validators.required]),
    description: new FormControl(""),
    code: new FormControl("", [Validators.required,Validators.pattern("[a-zA-Z0-9 ]+")]),
    data_type: new FormControl("",[Validators.required]),

    type_system: new FormControl(""),
    type_equipment: new FormControl(""),
    type_compartment: new FormControl(""),

    default_values: new FormControl(""),
    created_by: new FormControl(""),
    created_ip: new FormControl(""),
    modified_by: new FormControl(""),
    sequence : new FormControl("", [Validators.pattern("^[0-9]*$")]),
    status: new FormControl("", [Validators.required]),
  });
   status = this.editForm.value.status;
  populate(data) {

    console.log('Data', data)

    this.editForm.patchValue(data);
    this.editForm.patchValue({sub_module:data.sub_module.id});
    this.editForm.patchValue({module:data.module.id});
    this.getsubmodule(data.module.id);
    this.getSection(data.sub_module.id);
    setTimeout(()=>{
      this.editForm.patchValue({sub_module:data.sub_module?data.sub_module.id:''});
    },500);

    this.editForm.patchValue({global_section:data.global_section.id});
    
    this.getSubSections(data.global_section.id, data.sub_module.id);
    setTimeout(()=>{
       this.editForm.patchValue({global_sub_section:data.global_sub_section?data.global_sub_section.id:''});
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
     this.getSubSubSection();
     
     this.getDepartment();
     this.getAccess();
     
     this.getModule();
    
     
  }
module:any;
  getModule() {
    this.api
      .getAPI(environment.API_URL + "master/module?status=1")
      .subscribe((res) => {
        this.module = res.data;
      });
  }
  submodules:any;
  getsubmodule(module='') {
    this.api
      .getAPI(environment.API_URL + "master/sub_module?module="+module+"&status=1&order_type=asc")
      .subscribe((res) => {
        this.submodules = res.data;
        console.log(this.submodules,'dasdasda')
      });
  }
  submodule:any;
  getsubmodules(module='') {
    this.api
      .getAPI(environment.API_URL + "master/sub_module?module="+module+"&status=1&order_type=asc")
      .subscribe((res) => {
        this.submodule = res.data;
        
      });
  }
  sections:any;
  getSection(sub_module='') {
    this.api
      .getAPI(environment.API_URL + "master/global_section?sub_module="+sub_module+"&status=1")
      .subscribe((res) => {
        this.sections = res.data;

      });
  }
   section:any;
  getSections(sub_module='') {
    this.api
      .getAPI(environment.API_URL + "master/global_section?sub_module="+sub_module+"&status=1")
      .subscribe((res) => {
        this.section = res.data;

      });
  }
  subSections:any;
  getSubSections(global_section_id='', sub_module='') {

    let filter='?status=1';
    filter+=global_section_id?'&global_section_id='+global_section_id+'&sub_module='+sub_module:'';
    //alert(filter)
    this.api
      .getAPI(environment.API_URL + "master/global_sub_section"+filter)
      .subscribe((res) => {
        this.subSections = res.data;

        console.log(this.subSections,"#############")
      });
  }
  subSection:any;
getSubSection(global_section_id='',sub_module='') {

    let filter='?status=1';
    filter+=global_section_id?'&global_section_id='+global_section_id+'&sub_module='+sub_module:'';
    //alert(filter)
    this.api
      .getAPI(environment.API_URL + "master/global_sub_section"+filter)
      .subscribe((res) => {
        this.subSection = res.data;

        
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


  getSubSubSection() {
    if(this.param==undefined) this.param=""; else this.param;
    this.api.displayLoading(true)
    this.api
      .getAPI(environment.API_URL + "master/global_sub_sub_section?"+this.param)
      .subscribe((res) => {
        this.api.displayLoading(false)
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

    var element5 = <HTMLInputElement>document.getElementById("exampleCheck5");
    element5.checked = true;
    
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
        this.api.postAPI(environment.API_URL + "master/global_sub_sub_section/details", {
          id: id,
          status: 3,
        }).subscribe((res)=>{
          this.logger.log('response',res);
          if(res.status==environment.SUCCESS_CODE) {
            this.logger.info('delete')
            this.notification.warn('Global SubSubSection '+language[environment.DEFAULT_LANG].deleteMsg);
            this.getSubSubSection();
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

      this.editForm.value.type_system = this.editForm.value.type_system==true ? 1 : null;
      this.editForm.value.type_equipment = this.editForm.value.type_equipment==true ? 1 : null;
      this.editForm.value.type_compartment = this.editForm.value.type_compartment==true ? 1 : null;
      
      this.api
        .postAPI(
          environment.API_URL + "master/global_sub_sub_section/details",
          this.editForm.value
        )
        .subscribe((res) => {
          this.logger.log('response',res);
          //this.error= res.status;
          if(res.status==environment.SUCCESS_CODE){
            // this.logger.log('Formvalue',this.editForm.value);
            this.notification.success(res.message);
            this.getSubSubSection();
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
      this.getSubSubSection();
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
    module:new FormControl(""),
    submodule:new FormControl(""),
    section:new FormControl(""),
    subsection:new FormControl("")
    
  })
  param:any;
  search(){
  let type=this.searchForm.value.module?"module="+this.searchForm.value.module:"";
  type+=this.searchForm.value.submodule?"&sub_module="+this.searchForm.value.submodule:"";
  type+=this.searchForm.value.section?"&global_section="+this.searchForm.value.section:"";
  type+=this.searchForm.value.subsection?"&global_sub_section="+this.searchForm.value.subsection:"";

    this.param=type;
    this.getSubSubSection();
  }

 clear(){
    this.searchForm.reset();
    this.param="";
    this.getSubSubSection();
  }
 close(){
    this.editForm.reset();
  }
}
