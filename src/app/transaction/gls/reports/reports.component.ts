import { Component, OnInit, ViewChild, Input, ElementRef } from '@angular/core';
import { ApiService } from "src/app/service/api.service";
import { environment } from "src/environments/environment";
import { FormGroup, FormControl, Validators, FormGroupDirective } from "@angular/forms";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { NotificationService } from "src/app/service/notification.service";
import { ConfirmationDialogComponent } from "src/app/confirmation-dialog/confirmation-dialog.component";
import { MatDialog } from "@angular/material/dialog";
import { language } from "src/environments/language";
import { Router,ActivatedRoute } from '@angular/router';
import { ConsoleService } from "src/app/service/console.service";
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { of } from 'rxjs';
import { formatDate } from '@angular/common';
declare var moment:any;
declare function openModal(selector):any;
declare function closeModal(selector):any;
declare function formSubmit(selector):any;
declare function triggerClick(selector):any;

export interface PeriodicElement {
  name: string;
  //position: number;
  remarks: string;
  actions: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {name: 'test', remarks: 'test', actions: 'test'},
  {name: 'test', remarks: 'test', actions: 'test'},
  {name: 'test', remarks: 'test', actions: 'test'},
  {name: 'test', remarks: 'test', actions: 'test'},
];


@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {

    displayedColumns: string[] = ['name', 'remarks', 'actions'];
    dataSource2 = ELEMENT_DATA;

   active = 1;

   editorConfig: AngularEditorConfig = {
    editable: true,
      spellcheck: true,
      height: 'auto',
      minHeight: '0',
      maxHeight: 'auto',
      width: 'auto',
      minWidth: '0',
      translate: 'yes',
      enableToolbar: true,
      showToolbar: true,
      placeholder: 'Enter remarks here...',
      defaultParagraphSeparator: '',
      defaultFontName: '',
      defaultFontSize: '',
      fonts: [
        {class: 'arial', name: 'Arial'},
        {class: 'times-new-roman', name: 'Times New Roman'},
        {class: 'calibri', name: 'Calibri'},
        {class: 'comic-sans-ms', name: 'Comic Sans MS'}
      ],
      customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    uploadWithCredentials: false,
    sanitize: false,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [
      ['bold', 'italic'],
      ['fontSize','toggleEditorMode','customClasses']
    ]
};

  displayedColumnsPending: string[] = [
    "project_name",
    // "numof_section",
    // "numof_annexure",
    "requested_by",
    "requested_on",
    //"email",
    //"approval",
    //"upload",
    "view",
    //"edit",
    //"delete",
    'download'
  ];
  dataSource: MatTableDataSource<any>;
  dataSourceApproved: MatTableDataSource<any>;
  dataSourcePending: MatTableDataSource<any>;

  country: any;
  public crudName = "Add";
  public countryList = [];
  public dataListApproved = [];
  public dataListPending = [];
  filterValue:any;
  isReadonly=false;
  moduleAccess:any;
  ErrorMsg:any;
  error_msg=false;
  moment=moment;

  public permission={
    add:false,
    edit:false,
    view:false,
    delete:false,
    recommend:false,
    approve:false,
    print:false,
  };

  @ViewChild(MatPaginator) pagination: MatPaginator;
  @ViewChild('paginationApproved') paginationApproved: MatPaginator;
  @ViewChild('paginationPending') paginationPending: MatPaginator;
  @ViewChild("closebutton") closebutton;
  @ViewChild(FormGroupDirective) formGroupDirective: FormGroupDirective;

  constructor(public api: ApiService, private notification : NotificationService,
    private dialog:MatDialog, private router : Router, private elementref : ElementRef,private logger:ConsoleService,public aroute: ActivatedRoute) {
  }


  public editForm = new FormGroup({
    id: new FormControl(""),
    project: new FormControl("",[Validators.required]),
    type_name: new FormControl("",[Validators.required]),
    document_sections: new FormControl("",[Validators.required]),
    document_sub_sections: new FormControl("",[Validators.required]),
    document_sub_sections2: new FormControl("",[Validators.required]),
    primary: new FormControl("",[Validators.required]),
    secondary1: new FormControl("",[Validators.required]),
    secondary2: new FormControl("",[Validators.required]),
    secondary3: new FormControl("",[Validators.required]),
    paragraph_title: new FormControl("",[Validators.required]),
    paragraph: new FormControl("",[Validators.required]),
  });

  public editForm1 = new FormGroup({
    id: new FormControl(""),
    project_id: new FormControl("",[Validators.required]),
    primary_role: new FormControl("",[Validators.required]),
    secondary_role: new FormControl("",[Validators.required]),
    budget: new FormControl("",[Validators.required]),
    standard: new FormControl("",[Validators.required]),
    manpower_induction: new FormControl("",[Validators.required]),
    quantity: new FormControl("",[Validators.required]),
    acquisition_method: new FormControl("",[Validators.required]),
    remarks: new FormControl("",[Validators.required]),
  });

  public editForm2 = new FormGroup({
    id: new FormControl(""),
    project_id: new FormControl("",[Validators.required]),
    primary_role: new FormControl("",[Validators.required]),
    secondary_role: new FormControl("",[Validators.required]),
    budget: new FormControl("",[Validators.required]),
    standard: new FormControl("",[Validators.required]),
    manpower_induction: new FormControl("",[Validators.required]),
    quantity: new FormControl("",[Validators.required]),
    acquisition_method: new FormControl("",[Validators.required]),
    remarks: new FormControl("",[Validators.required]),
  });

  public editForm3 = new FormGroup({
    id: new FormControl(""),
    project_id: new FormControl("",[Validators.required]),
    primary_role: new FormControl("",[Validators.required]),
    secondary_role: new FormControl("",[Validators.required]),
    budget: new FormControl("",[Validators.required]),
    standard: new FormControl("",[Validators.required]),
    manpower_induction: new FormControl("",[Validators.required]),
    quantity: new FormControl("",[Validators.required]),
    acquisition_method: new FormControl("",[Validators.required]),
    remarks: new FormControl("",[Validators.required]),
  });
 
  populate(data) {
    
  }

  initForm() {
    this.editForm.patchValue({
      status: "1",
    });
  }
  selectedTrial:any;
  openCurrentStatus(trial){
    this.selectedTrial=trial;
    openModal('#trial-status-modal');
  }


  Error = (controlName: string, errorName: string) => {
    return this.editForm.controls[controlName]?this.editForm.controls[controlName].hasError(errorName):false;
  };
 

  isEquipment=true;
  isBoiler=false;


  ngOnInit(): void {
   this.getListing();
   this.getProject();
   this.getDocumentSections();
   //this.getDocumentSubSections();
   this.getUnits();
   this.getGlobalStatus();
  }
  global_statuses:any;
  getGlobalStatus() {
    this.api
      .getAPI(environment.API_URL + "master/status?status=1")
      .subscribe((res) => {
        this.global_statuses = res.data;
      });
  }

  getListing() {
    this.api
      .getAPI(environment.API_URL + "transaction/gls/initiation_notes")
      .subscribe((res) => {
        // this.dataSource = new MatTableDataSource(res.data);
        // this.countryList = res.data;
        // this.dataSource.paginator = this.pagination;
        // this.logger.log('country',this.countryList)

        this.dataSourcePending = new MatTableDataSource(res.data);
        this.dataListPending = res.data;
        this.dataSourcePending.paginator = this.paginationPending;
        this.logger.log('country',this.dataListPending)
      });
  }

  getListing1()
  {
    let userDet={first_name:"Manivannan",last_name:"VC"};
    let sampleData=[{project_name:"Test Project",primary_role:"Seaward defense of the coast", numof_section:"2", numof_annexure:"3", secondary_role:"Maritime Interdiction Operations",budget:500000,manpower_induction:"ACCRETION",quantity:5,acquisition_method:"SECTION B",remarks:'test',requested_by:userDet,created_on:new Date(),standard:"Naval"}];
    this.dataSourcePending = new MatTableDataSource(sampleData);
    this.dataListPending = sampleData;
    this.dataSourcePending.paginator = this.paginationPending;
  }

  units:any;
  getUnits() {
    this.api
      .getAPI(environment.API_URL + "master/unit?status=1")
      .subscribe((res) => {
        this.units = res.data;
      });
  }

  // projects:any;
  // getProject() {
  //   this.api
  //     .getAPI(environment.API_URL + "master/project?status=1")
  //     .subscribe((res) => {
  //       this.projects = res.data;
  //     });
  //     console.log(this.projects,"WWWWWWWWw")
  // }

  projects:any;  

  getProject() {
    this.api
      .getAPI(environment.API_URL + "transaction/psr/incorporation_of_design_inputs/global_master")
      .subscribe((res) => {
        this.projects = res.data;
        console.log(this.projects,"#######")
      });
  }


  documentSections:any;
  getDocumentSections() {
    this.api
      .getAPI(environment.API_URL + "transaction/gls/document_sections?status=1")
      .subscribe((res) => {
        this.documentSections = res.data;
        //console.log('#####',this.documentSections)
      });
  }

  documentSubSections:any;
  getDocumentSubSections(document_sections_id='') {
    this.api
      .getAPI(environment.API_URL + "transaction/gls/document_sub_sections?document_sections_id="+document_sections_id+"&status=1")
      .subscribe((res) => {
        this.documentSubSections = res.data;
      });
  }

  documentSubSections2:any;
  getDocumentSubSections2(document_sections_id='',document_sub_sections_id='') {
    this.api
      .getAPI(environment.API_URL + "transaction/gls/document_sub_sections2?document_sections_id="+document_sections_id+"&document_sub_sections_id="+document_sub_sections_id+"&status=1")
      .subscribe((res) => {
        this.documentSubSections2 = res.data;
      });
  }
  
  applyFilterPending(event: Event) {
    this.filterValue = (event.target as HTMLInputElement).value;
    if(this.filterValue){
      this.dataSourcePending.filter = this.filterValue.trim().toLowerCase();
    } else {
    }
  }

  create() {
    this.crudName = "Initiate";
    this.isReadonly=false;
    this.editForm.enable();
    let reset = this.formGroupDirective.resetForm();
    if(reset!==null) {
      this.initForm();
    }
    // var element = <HTMLInputElement>document.getElementById("exampleCheck1");
    // element.checked = true;
  }

  editOption(country) {
    this.isReadonly=false;
    this.editForm.enable();
    this.crudName = "Edit";
    this.logger.info(country);
    this.populate(country);
    
  }
  viewTrial:any;
  onView(country) {
    this.crudName = 'View';
    this.viewTrial=country;
    this.isReadonly=true;
    this.editForm.disable();
    this.populate(country);
   
  }
  

  public editFormApproval = new FormGroup({
    id: new FormControl("", [Validators.required]),
    project: new FormControl("", [Validators.required]),
    approved_status: new FormControl("", [Validators.required]),
    approved_by_name: new FormControl(""),
    approved_by: new FormControl("",[Validators.required]),
    approved_on: new FormControl("",[Validators.required]),
    approved_remark: new FormControl("",[Validators.required]),
  });

  approval(initiation) {

    this.editFormApproval.patchValue({
      id: initiation.id,
      project: initiation.project.id,
      approved_status: initiation.approved_status,
      approved_by_name: initiation.created_by.first_name+' '+initiation.created_by.last_name,
      approved_by: initiation.created_by.id,
      approved_remark: initiation.approved_remark,
      approved_on: formatDate(new Date(), 'yyyy-MM-dd', 'en')
    });

  }

  onSubmitApproval() {
    if (this.editFormApproval.valid) {
      this.api
      .postAPI(
        environment.API_URL + "transaction/gls/initiation_notes/crud",
        this.editFormApproval.value
      )
      .subscribe((res) => {
        this.logger.log('response',res);
        if(res.status==environment.SUCCESS_CODE){
          this.notification.success(res.message);
          this.notification.warn('GLS Initiation Approval Updated');
          this.getListing();
          //this.closebutton.nativeElement.click();
          //res.data['type']='edit';
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


  


  onDelete(id) {
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: language[environment.DEFAULT_LANG].confirmMessage
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.api.postAPI(environment.API_URL + "transaction/trials/crud", {
          id: id,
          status: 3,
        }).subscribe((res)=>{
          this.logger.log('response',res);
          if(res.status==environment.SUCCESS_CODE) {
            this.logger.info('delete')
            this.notification.warn('Trial '+language[environment.DEFAULT_LANG].deleteMsg);
          } else {
            this.notification.displayMessage(language[environment.DEFAULT_LANG].unableDelete);
          }
        });
      }
      dialogRef=null;
    });
  }

  onSubmit() {

    console.log("#######",this.editForm);
    //return false;
     if (this.editForm.valid) {
      this.editForm.value.created_by = this.api.userid.user_id;
      this.editForm.value.status = this.editForm.value.status==true ? 1 : 2;
      this.api
        .postAPI(
          environment.API_URL + "transaction/gls/initiation_notes/crud",
          this.editForm.value
        )
        .subscribe((res) => {
          this.logger.log('response',res);
          //this.error= res.status;
          if(res.status==environment.SUCCESS_CODE){
            // this.logger.log('Formvalue',this.editForm.value);
            this.notification.success(res.message);
            this.closebutton.nativeElement.click();
            this.getListing();
            //res.data['type']='edit';
            //localStorage.setItem('trial_form',this.api.encryptData(res.data));
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

  public editFormImport = new FormGroup({ 
    file_name: new FormControl("",[Validators.required]),
    project: new FormControl("",[Validators.required]),
    start_date: new FormControl("",[Validators.required]),
    close_date: new FormControl("",[Validators.required]),
    type_name: new FormControl("",[Validators.required]),
    created_by: new FormControl("")
  });

  clearEditFormImport() {

    this.editFormImport.reset({
          'file_name': '',
          'project': '',
          'start_date': '',
          'close_date': '',
          'type_name': ''
         });
  }

  onSubmitImport(){
    //alert(this.api.userid.user_id)
    const formData = new FormData();
    formData.append('excel_file_upload', this.fileToUpload);
    formData.append('project', this.editFormImport.value.project);
    formData.append('start_date', this.editFormImport.value.start_date);
    formData.append('close_date', this.editFormImport.value.close_date);
    formData.append('type_name', this.editFormImport.value.type_name);
    formData.append('created_by', this.api.userid.user_id);
    this.api
      .postAPI(
        environment.API_URL + "transaction/excel",
        formData
      )
      .subscribe((res) => {
        this.logger.log('response',res);
        //alert(res.status)
        //this.error= res.status;
        if(res.status==environment.SUCCESS_CODE){
          // this.logger.log('Formvalue',this.editForm.value);
          this.clearEditFormImport()
          this.notification.success(res.message);
          
          this.closebutton.nativeElement.click();
          this.getListing();
          //res.data['type']='edit';

          //localStorage.setItem('trial_form',this.api.encryptData(res.data));
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


  fileToUpload: File | null = null;
  onFileHandler(event) {
    console.log(event,event.target.files[0])
    if (event.target.files.length > 0) {
      this.fileToUpload= event.target.files[0];
      // console.log("ghjgjhri",file);
      // this.form.patchValue({files:file});
     };

    }

  trialPage:any;
  getAccess() {
    this.moduleAccess=this.api.getPageAction();
    if(this.moduleAccess)
    {
      let addPermission=(this.moduleAccess).filter(function(access){ if(access.code=='INI') return access.status; }).map(function(obj) {return obj.status;});
      let editPermission=(this.moduleAccess).filter(function(access){ if(access.code=='EDIT') { return access.status;} }).map(function(obj) {return obj.status;});
      let viewPermission=(this.moduleAccess).filter(function(access){ if(access.code=='VIW') { return access.status;} }).map(function(obj) {return obj.status;});
      let deletePermission=(this.moduleAccess).filter(function(access){ if(access.code=='DEL') { return access.status;} }).map(function(obj) {return obj.status;});
      let recommendPermission=(this.moduleAccess).filter(function(access){ if(access.code=='REC') { return access.status;} }).map(function(obj) {return obj.status;});
      let approvePermission=(this.moduleAccess).filter(function(access){ if(access.code=='APR') { return access.status;} }).map(function(obj) {return obj.status;});
      let printPermission=(this.moduleAccess).filter(function(access){ if(access.code=='PRI') { return access.status;} }).map(function(obj) {return obj.status;});
      this.permission.add=addPermission.length>0?addPermission[0]:false;
      this.permission.edit=editPermission.length>0?editPermission[0]:false;
      this.permission.view=viewPermission.length>0?viewPermission[0]:false;
      this.permission.delete=deletePermission.length>0?deletePermission[0]:false;
      this.permission.recommend=recommendPermission.length>0?recommendPermission[0]:false;
      this.permission.approve=approvePermission.length>0?approvePermission[0]:false;
      this.permission.print=printPermission.length>0?printPermission[0]:false;
    }

    this.logger.log('this.permission',this.permission);
  }


}
