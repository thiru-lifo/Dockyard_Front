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
import { formatDate } from '@angular/common';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { MatCheckbox } from '@angular/material/checkbox';

import { of } from 'rxjs';
//import { Console } from 'console';
declare var arrayColumn;
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
  selector: 'app-template-generation',
  templateUrl: './template-generation.component.html',
  styleUrls: ['./template-generation.component.scss']
})
export class TemplateGenerationComponent implements OnInit {
  @ViewChild('localform')localform:HTMLFormElement;
  accordDate:any;
  conclusionDate:any;
  inductionDate:any;

  selected:any = '18'
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
    //"primary_role",
    //"secondary_role",
    "budget",
    "standard",
    "manpower_induction",
    //"quantity",
    //"acquisition_method",
    //"remarks",
    "requested_by",
    "requested_on",
    "email",
    "approval",
    "upload",
    "view",
    "edit",
    "delete",

  ];
  dataSource: MatTableDataSource<any>;
  dataSourceApproved: MatTableDataSource<any>;
  dataSourcePending: MatTableDataSource<any>;

  initiation: any;
  public crudName = "Add";
  public initiationList = [];
  public dataListApproved = [];
  public dataListPending = [];
  public documentList = [];
  //public projectid=[];
  projectid:any;
  UserList = [];
  filterValue:any;
  isReadonly=false;
  moduleAccess:any;
  ErrorMsg:any;
  error_msg=false;
  moment=moment;
  allSelected = false;
  allSelectedsecondary=false;
  environment=environment;
  showError = false;



  public permission={
    add:false,
    edit:false,
    view:false,
    delete:false,
    recommend:false,
    approve:false,
    print:false,
  };
  @ViewChild('select') select: MatSelect;
  @ViewChild('select2') select2: MatSelect;
  @ViewChild(MatPaginator) pagination: MatPaginator;
  @ViewChild('paginationApproved') paginationApproved: MatPaginator;
  @ViewChild('paginationPending') paginationPending: MatPaginator;
  @ViewChild("closebutton") closebutton;
  @ViewChild("closebuttonproject") closebuttonproject;
  @ViewChild("closebuttonapproval") closebuttonapproval;
  @ViewChild("closebutton_email") closebutton_email;

  @ViewChild(FormGroupDirective) formGroupDirective: FormGroupDirective;
  @ViewChild("mySel") skillSel: MatSelect;

  currentDate = new Date();
  constructor(public api: ApiService, private notification : NotificationService,
    private dialog:MatDialog, private router : Router, private elementref : ElementRef,private logger:ConsoleService,public aroute: ActivatedRoute) {
  }


  public editForm = new FormGroup({
    id: new FormControl(""),
    project: new FormControl("",[Validators.required]),
    primary_role: new FormControl("",[Validators.required]),
    secondary_role: new FormControl("",[Validators.required]),
    budgeted_cost_per_platform: new FormControl("",[Validators.required,Validators.maxLength(30)]),
    standard: new FormControl("",[Validators.required]),
    plan_for_manpower_induction: new FormControl("",[Validators.required]),
    quantity: new FormControl("",[Validators.required,Validators.maxLength(5)]),
    acquisition_method: new FormControl("",[Validators.required]),
    remarks: new FormControl("",[Validators.required]),

    accord_of_aon: new FormControl("",[Validators.required]),
    conclusion_of_contract: new FormControl("moment().format('MM/DD/yyyy')"),
    induction: new FormControl("",[Validators.required]),
  });


  primaryRole: any
  secondaryRole: any
  onPrimaryRoles()
  {
    console.log('this.editForm',this.editForm);
  }
  populate(data) {
    //alert(typeof(this.castArray(data.primary_role)))
    //alert(JSON.parse(data.primary_role))
    //this.primaryRole = JSON.parse(data.primary_role);
    //this.secondaryRole = JSON.parse(data.secondary_role);
    let primary_roles = data.primary_role.map(function(a){return a['id'];});
    let secondary_roles = data.secondary_role.map(function(a){return a['id'];});
    // console.log('sec',primary_roles)
    console.log(data,"data");
    this.editForm.patchValue(data);
    this.editForm.patchValue({project: data.project.id});
    this.editForm.patchValue({secondary_role:secondary_roles});
    this.editForm.patchValue({standard: data.standard.id});
    this.editForm.patchValue({plan_for_manpower_induction: data.plan_for_manpower_induction.id});
    this.editForm.patchValue({acquisition_method: data.acquisition_method.id});
    this.editForm.patchValue({primary_role:primary_roles});
    this.editForm.patchValue({budgeted_cost_per_platform: data.budgeted_cost_per_platform});
    this.editForm.patchValue({quantity:data.quantity});
    this.editForm.patchValue({remarks:data.remarks});




    //this.primaryRole = ['1','3'];

    this.logger.info(data.status)
  }

  initForm() {
    this.editForm.patchValue({
      status: "1",
      primary_role: "",
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
ProjectError = (controlName: string, errorName: string) => {
    return this.editFormProject.controls[controlName]?this.editFormProject.controls[controlName].hasError(errorName):false;
  };

  isEquipment=true;
  isBoiler=false;
  modeSelect:any;


  ngOnInit(): void {

   this.getListing();
   //this.getProject;
   this.getPrimaryRole();
   this.getSecondaryRole();
   this.getStandard();
   this.getManpowerInduction();
   this.getAcquisitionMethod();
   this.getGlobalStatus();
   this.getClass();
   this.getAccess();
   //var element = <HTMLInputElement>document.getElementById("exampleCheck1");
   //element.checked = true;
  }
  public FinalArray = [];
  projects=[];

getProject(code) {
  this.api
    .getAPI(environment.API_URL + "master/project?status=1")
    .subscribe((res) => {
      console.log('dff',res.data[0].id)
if(code=="add"){
for (var i = 0; i < res.data.length; ++i) {
   res.data[i].id;
  var found = false;

  for (var j = 0; j < this.dataListPending.length; ++j) {
      if (this.dataListPending[j].project.id == res.data[i].id) {
          found = true;
          break;
      }
  }

  if (!found) {
      this.FinalArray.push(res.data[i]);
  }
}
}
else if(code=="edit"||code=="view") {
  this.FinalArray = res.data;
}
console.log(this.FinalArray,'dsdd');


  });
}

  primary_roles:any;
  getPrimaryRole() {
    this.api
      .getAPI(environment.API_URL + "transaction/psr/primary_roles?status=1")
      .subscribe((res) => {
        this.primary_roles = res.data;
        console.log('Primary',res.data)

      });
  }

  secondary_roles:any;
  getSecondaryRole() {
    this.api
      .getAPI(environment.API_URL + "transaction/psr/secondary_roles?status=1")
      .subscribe((res) => {
        this.secondary_roles = res.data;
        console.log('secondary',res.data)
      });
  }


  standards:any;
  getStandard() {
    this.api
      .getAPI(environment.API_URL + "transaction/psr/standard?status=1")
      .subscribe((res) => {
        this.standards = res.data;
      });
  }

  manpower_inductions:any;
  getManpowerInduction() {
    this.api
      .getAPI(environment.API_URL + "transaction/psr/plan_for_manpower_induction?status=1")
      .subscribe((res) => {
        this.manpower_inductions = res.data;
      });
  }

  global_statuses:any;
  getGlobalStatus() {
    this.api
      .getAPI(environment.API_URL + "master/status?status=1")
      .subscribe((res) => {
        this.global_statuses = res.data;
      });
  }

  acquisition_methods:any;
  getAcquisitionMethod() {
    this.api
      .getAPI(environment.API_URL + "transaction/psr/acquisition_method?status=1")
      .subscribe((res) => {
        this.acquisition_methods = res.data;
      });
  }

  /*getListings()
  {
    let userDet={first_name:"Manivannan",last_name:"VC"};
    let sampleData=[{project_name:"Test Project",primary_role:"Seaward defense of the coast",secondary_role:"Maritime Interdiction Operations",budget:500000,manpower_induction:"ACCRETION",quantity:5,acquisition_method:"SECTION B",remarks:'test',requested_by:userDet,created_on:new Date(),standard:"Naval"}];
    this.dataSourcePending = new MatTableDataSource(sampleData);
    this.dataListPending = sampleData;
    this.dataSourcePending.paginator = this.paginationPending;
  }*/

  getListing() {
    this.api
      .getAPI(environment.API_URL + "transaction/psr/initiation_notes")
      .subscribe((res) => {
        this.dataSourcePending = new MatTableDataSource(res.data);
        //this.initiationList = res.data;
        this.dataListPending = res.data;
        this.FinalArray=[];
        this.getProject;
        this.dataSourcePending.paginator = this.paginationPending;
        this.logger.log('initiation',res.data)
      });
   }

  getDocumentListing(initiation) {

    //alert(initiation.id)
    this.api
      .getAPI(environment.API_URL + "transaction/psr/initiation_notes_document?status=1&initiation_notes="+initiation.id)
      .subscribe((res) => {
        this.documentList = res.data;
      });
   }

   downloadFile(document){
      let url = environment.API_URL + document.file_name;
      //alert(environment.API_URL + document.file_name);
      //window.open(url, '_self');
      //e.preventDefault();

      window.location.href = url;

   }

   onDeleteDocument(initiation) {
    //alert(id)
    //return false;
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: language[environment.DEFAULT_LANG].confirmMessage
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.api.postAPI(environment.API_URL + "transaction/psr/initiation_notes_document/crud", {
          id: initiation.id,
          status: 3,
          document_name: initiation.document_name,
          document_remark: initiation.document_remark
        }).subscribe((res)=>{
          this.logger.log('response',res);
          if(res.status==environment.SUCCESS_CODE) {
            this.logger.info('delete')
            this.notification.warn('Document '+language[environment.DEFAULT_LANG].deleteMsg);

            let initiation_id = this.editFormDocument.value.initiation_notes;
            //alert(initiation_id);
            this.getDocumentListing({id:initiation_id});

          } else {
            this.notification.displayMessage(language[environment.DEFAULT_LANG].unableDelete);
          }
        });
      }
      dialogRef=null;
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
    this.crudName = "Add";
    this.isReadonly=false;
    this.editForm.enable();
    let reset = this.formGroupDirective.resetForm();
    if(reset!==null) {
      this.initForm();
    }
    // var element = <HTMLInputElement>document.getElementById("");
    // element.checked = true;
  }




  onAcquisitionChange(value)
  {
    let remarks=`The process of SR formulation is to be initiated by a Note from DNP. This first step is most critical as it sets the foundation around which the SR evolves in an expanding spiral. The Initiation Note is to be prepared by ACNS(P&P). He is to be assisted by a team comprising reps from DNO, DSR, DSP, DND and DMPR. The Initiation Note is to lay out the following:-

      (a) Type and numbers of platforms required.

      (b) Role of the platforms.

      (c) Cardinal dates for induction. This is to cater to realistic shipbuilding timelines.

      (d) Plan for manpower induction – accretion or matching savings.

      (e) Budgeted cost per platform (the value is not to be fixed, but is to be in an estimated range).

      (f) Standards (Commercial or Naval) that the vessel is to be built to.`;
      this.editForm.patchValue({remarks:remarks});

  }
  pro:any;
  editOption(initiation) {
    this.pro=true;
    this.isReadonly=false;

    this.editForm.enable();

    //this.editForm.project.disable();
    this.crudName = "Submit";
    this.logger.info(initiation);
    this.editForm.controls['project'].disable();
    this.getProject("edit");
    this.populate(initiation);
    var element = <HTMLInputElement>document.getElementById("exampleCheck1");
    if (this.editForm.value.status == "1") {
      element.checked = true;
    }
    else {
      element.checked = false;
    }

  }

  // editOption(country) {
  //   this.isReadonly=false;
  //   this.editForm.enable();
  //   this.crudName = "Edit";
  //   this.logger.info(country);
  //   this.populate(country);
  //   var element = <HTMLInputElement> document.getElementById("exampleCheck1");
  //   if(this.editForm.value.status == 1) {
  //    element.checked = true;
  //   }
  //   else {
  //    element.checked = false;
  //   }
  // }

  viewTrial:any;
  onView(initiation) {
    this.crudName = 'View';
    this.viewTrial=initiation;
    this.getProject("view");
    this.isReadonly=true;
    this.editForm.disable();
    this.populate(initiation);
    this.editorConfig.editable= false;

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

    //console.log('@@@@@',initiation);
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
    this.editFormApproval.value

     this.editFormApproval.value.approve = 'yes';
     //this.editFormProject.value.status = this.editFormProject.value.status==true ? 1 : 2;
    if (this.editFormApproval.valid) {
      this.api
      .postAPI(
        environment.API_URL + "transaction/psr/initiation_notes/crud",
        this.editFormApproval.value
      )
      .subscribe((res) => {
        this.logger.log('response',res);
        if(res.status==environment.SUCCESS_CODE){
          this.notification.success(res.message);
          this.getListing();
          this.notification.warn('PSR Initiation notes Approval Updated');
          this.closebuttonapproval.nativeElement.click();
          //this.getListing();
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

  // Upload Part
  public editFormDocument = new FormGroup({
    id: new FormControl(""),
    initiation_notes: new FormControl("", [Validators.required]),
    document_name: new FormControl("", [Validators.required]),
    document_remark: new FormControl("",[Validators.required]),
    file_name: new FormControl("",[Validators.required]),

  });

  document(initiation) {
    this.localform.submitted=false;
    this.showError = false;
    //console.log('##',initiation);
    this.getDocumentListing(initiation)

    //console.log('@@@@@',initiation);
    this.editFormDocument.patchValue({
      initiation_notes: initiation.id,
      status: "1",
    });
  }

  onSubmitDocument() {
    this.showError =true;

    if (this.editFormDocument.valid) {

      const formData = new FormData();
      formData.append('id','');
      formData.append('initiation_notes', this.editFormDocument.value.initiation_notes);
      formData.append('document_name', this.editFormDocument.value.document_name);
      formData.append('document_remark', this.editFormDocument.value.document_remark);
      formData.append('file_name', this.fileToUpload);
      formData.append('status', '1')

      //console.log(formData);
      //return false;

      this.api
      .postAPI(
        environment.API_URL + "transaction/psr/initiation_notes_document/crud",
        formData
      )
      .subscribe((res) => {
        this.logger.log('response',res);
        if(res.status==environment.SUCCESS_CODE){
          this.notification.success(res.message);
          this.localform.submitted=false;

          this.editFormDocument.get('document_name').reset();
          this.editFormDocument.controls['document_remark'].reset();
          this.editFormDocument.controls['file_name'].reset();
          let reset = this.formGroupDirective.resetForm();
               if(reset!==null) {
              this.initForm();
               }

          let initiation_id = this.editFormDocument.value.initiation_notes;
          this.getDocumentListing({id:initiation_id});

          this.closebutton.nativeElement.click();
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

  fileToUpload: File | null = null;
  onFileHandler(event) {
    console.log(event,event.target.files[0])
    if (event.target.files.length > 0) {
      this.fileToUpload= event.target.files[0];
      // console.log("ghjgjhri",file);
      // this.form.patchValue({files:file});
     };

    }

  // Send Email

  public editFormSendMail = new FormGroup({
    id: new FormControl(""),
    initiation_notes: new FormControl("", [Validators.required]),
    to_email: new FormControl("", [Validators.required]),
    subject: new FormControl("", [Validators.required]),
    comments: new FormControl("",[Validators.required]),
    file_name: new FormControl("",[Validators.required]),

  });

  senEmail(initiation) {

    this.editFormSendMail.patchValue({
      initiation_notes: initiation.id,
      status: "1",
    });

  }


  onSubmitSendEmail(){
    //console.log('@@@@@@@@', this.editFormSendMail.value, '###', this.editFormSendMail.valid)
    //alert('############')
    //return false;
    if (this.editFormSendMail.valid) {

      const formData = new FormData();
      formData.append('id','');
      formData.append('initiation_notes', this.editFormSendMail.value.initiation_notes);
      formData.append('to_email', this.editFormSendMail.value.to_email);
      formData.append('subject', this.editFormSendMail.value.subject);
      formData.append('comments', this.editFormSendMail.value.comments);
      formData.append('file_name', this.fileSendMailToUpload);
      formData.append('created_by', this.api.userid.user_id);
      formData.append('status', '1')

      this.api
        .postAPI(
          environment.API_URL + "transaction/psr/initiation_notes_send_email/crud",
          formData
        )
        .subscribe((res) => {
          this.logger.log('response',res);
          //alert(res.status)
          //this.error= res.status;
          if(res.status==environment.SUCCESS_CODE){
            // this.logger.log('Formvalue',this.editForm.value);
            this.notification.success(res.message);
            //this.getListing();
            this.closebutton_email.nativeElement.click();
            //res.data['type']='edit';

          this.editFormSendMail.get('to_email').reset();
          this.editFormSendMail.controls['subject'].reset();
          this.editFormSendMail.controls['subject'].reset();
          this.editFormSendMail.controls['file_name'].reset();

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

  fileSendMailToUpload: File | null = null;
  onSendMailFileHandler(event) {
    console.log(event,event.target.files[0])
    if (event.target.files.length > 0) {
      this.fileSendMailToUpload= event.target.files[0];
     };

  }


  onDelete(data) {

    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: language[environment.DEFAULT_LANG].confirmMessage
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.api.postAPI(environment.API_URL + "transaction/psr/initiation_notes/crud", {
          id: data.id,
          status: 3,
          project: data.project.id,
          approve : 'yes'
        }).subscribe((res)=>{
          this.logger.log('response',res);
          if(res.status==environment.SUCCESS_CODE) {
            this.logger.info('delete')
            this.getListing();
            this.notification.warn('PSR Initiation notes '+language[environment.DEFAULT_LANG].deleteMsg);

          } else {
            this.notification.displayMessage(language[environment.DEFAULT_LANG].unableDelete);
          }
        });
      }
      dialogRef=null;
    });
  }

  onSubmit() {
    console.log('fsdf')
    this.showError = true;
     if (this.editForm.valid) {
      console.log('fsdfvalid')
      this.editForm.value.approve = 'no';

      this.editForm.value.accord_of_aon = moment(this.editForm.value.accord_of_aon, "YYYY-MM-DD").format("YYYY-MM-DD");

      this.editForm.value.conclusion_of_contract = moment(this.editForm.value.conclusion_of_contract, "YYYY-MM-DD").format("YYYY-MM-DD");

      this.editForm.value.induction = moment(this.editForm.value.induction, "YYYY-MM-DD").format("YYYY-MM-DD");

      this.editForm.value.created_by = this.api.userid.user_id;
      this.editForm.value.status = this.editForm.value.status==true ? 1 : 2;
      if(this.editForm.value.project !=null){
        this.editForm.value.project = this.editForm.value.project
        }
      //this.editForm.value.approved_status = '';

      //console.log(this.editForm.value);
      //return false;
      this.api
        .postAPI(
          environment.API_URL + "transaction/psr/initiation_notes/crud",
          this.editForm.value
        )
        .subscribe((res) => {
          this.logger.log('response',res);
          //alert(res.status)
          //this.error= res.status;
          if(res.status==environment.SUCCESS_CODE){
            // this.logger.log('Formvalue',this.editForm.value);
            this.notification.success(res.message);
            this.getListing();
            this.closebutton.nativeElement.click();
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



  classes:any;
  getClass() {
    this.api
      .getAPI(environment.API_URL + "master/class?status=1")
      .subscribe((res) => {
        this.classes = res.data;
      });
  }

  public editFormProject = new FormGroup({
    id: new FormControl(""),
    name: new FormControl("", [
      Validators.required,
    ]),
    description: new FormControl(""),
    code: new FormControl("", [Validators.required,Validators.pattern("[a-zA-Z0-9 ]+")]),
    class_id: new FormControl("", [Validators.required]),

    created_by: new FormControl(""),
    created_ip: new FormControl(""),
    modified_by: new FormControl(""),
    sequence : new FormControl("", [Validators.pattern("^[0-9]*$")]),
    //status: new FormControl("", [Validators.required])
    status: new FormControl("")
  });

  onSubmitProject() {

    if (this.editFormProject.valid) {
     this.editFormProject.value.created_by = this.api.userid.user_id;
     this.editFormProject.value.status = this.editFormProject.value.status==true ? 1 : 2;
     this.api
       .postAPI(
         environment.API_URL + "master/project/details",
         this.editFormProject.value
       )
       .subscribe((res) => {
         this.logger.log('response',res);
        //alert(res.status+','+environment.SUCCESS_CODE);
        //return false;

         //this.error= res.status;
         if(res.status==environment.SUCCESS_CODE){
           // this.logger.log('Formvalue',this.editForm.value);
           this.notification.success(res.message);
           this.getProject("add");
           //this.modeSelect = res.data.id;
           this.editFormProject.reset();
          

           //setTimeout(()=> {
            this.closebuttonproject.nativeElement.click();
           //}, 2000);
           // this.FinalArray=[];
           // this.getProject("add");
           // this.editForm.reset();
           // let reset = this.formGroupDirective.resetForm();
           //   if(reset!==null) {
           //     this.initForm();
           //   }
           this.modeSelect = res.data.id;


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
   //this.getProject;

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
  toggleAllSelectionSecondary() {
    if (this.allSelectedsecondary) {
      this.select2.options.forEach((item: MatOption) => item.select());
    } else {
      this.select2.options.forEach((item: MatOption) => item.deselect());
    }
  }

  optionClickSecondary() {
    let newStatus = true;
    this.select.options.forEach((item: MatOption) => {
      if (!item.selected) {
        newStatus = false;
      }
    });
    this.allSelectedsecondary = newStatus;
  }
  getValues(event: {
    isUserInput: any;
    source: { value: any; selected: any };
  }) {
    if (event.isUserInput) {
      if (event.source.selected === true) {
        console.log(event.source.value)
      } else {
        console.log(event.source.value)
      }
    }
  }


  disableDate(){
    return false;
  }
// allSelected = false;


  //category = new FormControl();
  add(){
    this.crudName = "Add";
    this.isReadonly=false;
    this.editForm.enable();
    this.getProject("add");
    this.editForm.reset();
    let reset = this.formGroupDirective.resetForm();
      if(reset!==null) {
        this.initForm();
      }
  }
   projectadd(){
   
    this.editFormProject.enable();
    
    this.editFormProject.reset();
    let reset = this.formGroupDirective.resetForm();
      if(reset!==null) {
        this.initForm();
      }
  }
  onclose(){
    this.FinalArray=[];
    let reset = this.formGroupDirective.resetForm();
    if(reset!==null) {
      this.initForm();
    }
    this.editForm.reset();
    this.editFormDocument.reset;
    this.pro=true;

  }
  Emailclose(){
    this.editFormSendMail.reset();
  }
  Approvalclose(){
   this.editFormApproval.reset();
  }
  Documentclose(){
    this.editFormDocument.reset();
  }
  // number input only
numberOnly(event:any): boolean {
  const charCode = (event.which) ? event.which : event.keyCode;
  if (charCode > 31 && (charCode < 48 || charCode > 57)) {
    return false;
  }
  return true;

}

projectclose(){
  this.editFormProject.reset();
   this.editForm.reset();
}


  initiation_form: any; 
  genInitiationTemplate() {
    this.api
      .getAPI(environment.API_URL + "master/generate_psr_template")
      .subscribe((res) => {
        console.log(res.data,"%%%%%%%");
        //this.initiation_form = res.data[0];
        //console.log(res.data[0],"WWWWWWWWWWW");
      });
   }


}



