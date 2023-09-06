import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, FormGroupDirective } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationDialogComponent } from 'src/app/confirmation-dialog/confirmation-dialog.component';
import { ApiService } from 'src/app/service/api.service';
import { ConsoleService } from 'src/app/service/console.service';
import { NotificationService } from 'src/app/service/notification.service';
import { environment } from 'src/environments/environment';
import { language } from 'src/environments/language';

@Component({
  selector: 'app-job-position',
  templateUrl: './job-position.component.html',
  styleUrls: ['./job-position.component.scss']
})
export class JobPositionComponent implements OnInit {

  form: FormGroup;
  error = "";
  public crudName = "Add";
  public jobPositionList = [];

  moduleAccess:any;
  filterValue:any;
  isReadonly=false;
  ErrorMsg:any;
  error_msg=false;
  public permission={
    add:false,
    edit:false,
    view:false,
    delete:false,
  };

  accepted: Boolean = false;
  constructor( 
    public api: ApiService,
    private notification: NotificationService,
    private formBuilder: FormBuilder,
    private modelservice :NgbModal,
    private dialog:MatDialog,
    private logger : ConsoleService,
    ) { }

  dataSource: MatTableDataSource<any>;
  displayedColumns = ["name", "code","description", "status","view","edit", "delete"];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild("closebutton") closebutton;
  @ViewChild(FormGroupDirective) formGroupDirective: FormGroupDirective;

  InputVar: ElementRef;

  ngOnInit(): void {
    this.initForm();
    this.getjobPosition();
    this.getAccess();
  }

  initForm() {
    this.form = this.formBuilder.group({
      id: new FormControl(""),
      name: new FormControl("", [Validators.required,Validators.pattern("[a-zA-Z ]+")]), //Validators.pattern('^[a-zA-Z \-\']+')
      code: new FormControl("", [Validators.required,Validators.pattern("[a-zA-Z0-9 ]+")]), //Validators.pattern("^[0-9]*$")
      status: new FormControl(""),
      description: new FormControl(""),
      created_by: new FormControl(""),
      created_ip: new FormControl(""),
      modified_by: new FormControl(""),
      sequence:new FormControl("",[Validators.pattern("^[0-9]*$")])
    });
  }

  populateForms(users) {
    this.form.patchValue(users);
    this.form.patchValue({modified_by:this.api.userid.user_id});
  }

  initialize() {
    this.form.patchValue({
      status: "1",
    });
  }
  
  getjobPosition(){
    this.api.getAPI(environment.API_URL + "master/job_position").subscribe({
      next: (res) => {
        this.logger.log('jobPosition',res);
        this.dataSource = new MatTableDataSource(res.data);
        this.jobPositionList = res.data;
        this.dataSource.paginator = this.paginator;
      },
      error: (error) => {
        this.logger.error('error',error);
      },
    });
  }

  add(){
    this.crudName="Add";
    this.isReadonly=false;
    this.form.enable();
    let reset=this.formGroupDirective.resetForm();
    if(reset!==null){
     this.initialize();
    }
    
  }
  
  update(value){
   this.crudName="Edit";
   this.isReadonly=false;
   this.form.enable();
   this.logger.info(value);
   this.populateForms(value);
   let Element=<HTMLInputElement> document.getElementById("exampleCheck1")
   if(this.form.value.status == 1){
     Element.checked=true;
   }else{
    Element.checked=false;
   }
  }

  onView(value) {
    this.crudName = 'View';
    this.isReadonly=true;
    this.form.disable();
    this.populateForms(value);
    var element = <HTMLInputElement> document.getElementById("exampleCheck1");
    if(this.form.value.status == 1) {
     element.checked = true;
    }
    else {
     element.checked = false;
    }
  }

  delete(id) {
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data:language[environment.DEFAULT_LANG].confirmMessage
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.api.postAPI(environment.API_URL + "master/job_position/details", {
          id: id,
          status: 3,
        }).subscribe((res)=>{
          if(res.status==environment.SUCCESS_CODE) {
            this.notification.warn('Job position details '+language[environment.DEFAULT_LANG].deleteMsg);
            this.getjobPosition();
          } else {
            this.notification.displayMessage(language[environment.DEFAULT_LANG].unableDelete);
          }
        });
      }
      dialogRef=null;
    });
  }

  crudSubmit() {
    if (this.form.invalid) {
      return;
    } else {
      this.form.value.created_by = this.api.userid.user_id;
      this.form.value.status = this.form.value.status==true ? 1 : 2;
      this.api
        .postAPI(
          environment.API_URL + "master/job_position/details",
          this.form.value
        )
        .subscribe((res)=> {
          this.logger.log('FormValue',res);
          if(res.status==environment.SUCCESS_CODE) {
            this.notification.success(res.message);
            this.getjobPosition();
            this.closebutton.nativeElement.click();
          } else if(res.status==environment.ERROR_CODE) {
            this.error_msg=true;
            this.ErrorMsg=res.message;
            setTimeout(()=> {
              this.error_msg = false;
           }, 2000);
          } else {
            this.notification.displayMessage(language[environment.DEFAULT_LANG].unableSubmit)
          }
        });
    }
  }

  close() {
    // this.initialize();
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
      this.getjobPosition();
    }
  }    

}
