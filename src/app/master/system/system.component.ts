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
  selector: 'app-system',
  templateUrl: './system.component.html',
  styleUrls: ['./system.component.scss']
})
export class SystemComponent implements OnInit {


  displayedColumns: string[] = [
    "globalsection",
    "globalsubsection",
    "globalsubsubsection",
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
    global_section: new FormControl("",[Validators.required]),
    global_sub_section: new FormControl(""),
    global_sub_sub_section: new FormControl(""),
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
    this.editForm.patchValue({global_section:data.global_section.id});
    this.getSubSections(data.global_section.id);
    setTimeout(()=>{
       this.editForm.patchValue({global_sub_section:data.global_sub_section?data.global_sub_section.id:''});
     },500);
    this.getSubSubSections(data.global_section.id,data.global_sub_section.id);
    setTimeout(()=>{
       this.editForm.patchValue({global_sub_sub_section:data.global_sub_sub_section?data.global_sub_sub_section.id:''});
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
     this.getSystem();
     this.getSection();
     this.getAccess();
     this.getgSection();
     this.getSectionF();
  }

  sections:any;
  getSection() {
    this.api
      .getAPI(environment.API_URL + "master/section?status=1")
      .subscribe((res) => {
        this.sections = res.data;
      });
  }
sectiong:any;
  getgSection() {
    this.api
      .getAPI(environment.API_URL + "master/global_section?status=1&type_system=1&order_type=asc")
      .subscribe((res) => {
        this.sectiong = res.data;

      });
  }
   subSections:any;
  getSubSections(global_section_id='') {

    let filter='?status=1&order_type=asc&type_system=1';
    filter+=global_section_id?'&global_section_id='+global_section_id:'';
    //alert(filter)
    this.api
      .getAPI(environment.API_URL + "master/global_sub_section"+filter)
      .subscribe((res) => {
        this.subSections = res.data;

        
      });
  }
   subsubSections:any;
  getSubSubSections(global_sub_section_id='',global_section_id='') {

    let filter='?status=1&order_type=asc&type_system=1';
    filter+=global_section_id?'&global_section_id='+global_section_id+'&global_sub_section_id='+global_sub_section_id:'';
    //alert(filter)
    this.api
      .getAPI(environment.API_URL + "master/global_sub_sub_section"+filter)
      .subscribe((res) => {
        this.subsubSections = res.data;

        
      });
  }

  getSystem() {
    if(this.param==undefined) this.param=""; else this.param;
    this.api
      .getAPI(environment.API_URL + "master/system?"+this.param)
   
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
        this.api.postAPI(environment.API_URL + "master/system/details", {
          id: id,
          status: 3,
        }).subscribe((res)=>{
          this.logger.log('response',res);
          if(res.status==environment.SUCCESS_CODE) {
            this.logger.info('delete')
            this.notification.warn('System '+language[environment.DEFAULT_LANG].deleteMsg);
            this.getSystem();
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
          environment.API_URL + "master/system/details",
          this.editForm.value
        )
        .subscribe((res) => {
          this.logger.log('response',res);
          //this.error= res.status;
          if(res.status==environment.SUCCESS_CODE){
            // this.logger.log('Formvalue',this.editForm.value);
            this.notification.success(res.message);
            this.getSystem();
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
      this.getSystem();
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
  
  sectionF:any;
getSectionF() {
    this.api
      .getAPI(environment.API_URL + "master/global_section?status=1&order_type=asc")
      .subscribe((res) => {
        this.sectionF = res.data;

      });
  }
   subSectionF:any;
  getSubSectionF(global_section_id='') {

    let filter='?status=1&order_type=asc';
    filter+=global_section_id?'&global_section_id='+global_section_id:'';
    //alert(filter)
    this.api
      .getAPI(environment.API_URL + "master/global_sub_section"+filter)
      .subscribe((res) => {
        this.subSectionF = res.data;

        
      });
  }
   subsubSectionF:any;
  getSubSubSectionF(global_section_id='', global_sub_section_id='') {

    let filter='?status=1&order_type=asc';
    filter+=global_section_id?'&global_section_id='+global_section_id+'&global_sub_section_id='+global_sub_section_id:'';
    //alert(filter)
    this.api
      .getAPI(environment.API_URL + "master/global_sub_sub_section"+filter)
      .subscribe((res) => {
        this.subsubSectionF = res.data;

        
      });
  }
searchForm= new FormGroup({
    
    section:new FormControl(""),
    subsection:new FormControl(""),
    subsubsection:new FormControl("")
  })
  param:any;
  search(){
  
  let type=this.searchForm.value.section?"&global_section="+this.searchForm.value.section:"";
  type+=this.searchForm.value.subsection?"&global_sub_section="+this.searchForm.value.subsection:"";
  type+=this.searchForm.value.subsubsection?"&global_sub_sub_section="+this.searchForm.value.subsubsection:"";
  this.param=type;
    this.getSystem();
  }

 clear(){
    this.searchForm.reset();
    this.param="";
    this.getSystem();
  }
 close(){
    this.editForm.reset();
  }
}

