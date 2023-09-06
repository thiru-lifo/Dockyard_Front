import { Component, OnInit, ViewChild, Input, ElementRef } from '@angular/core';
import { ApiService } from "src/app/service/api.service";
import { environment } from "src/environments/environment";
import { FormGroup, FormControl, Validators, FormGroupDirective, FormBuilder, FormArray } from "@angular/forms";
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
  selector: 'app-bls-gt-initiation',
  templateUrl: './bls-gt-initiation.component.html',
  styleUrls: ['./bls-gt-initiation.component.scss']
})
export class BlsGtInitiationComponent implements OnInit {
  @ViewChild('localform')localform:HTMLFormElement;
  @ViewChild("gtID") gtID: ElementRef;
  @ViewChild("moduleID") moduleID: ElementRef;
  @ViewChild("closebutton_ship") closebutton_ship;
  
  PAGE_MODULE_ID=3;
  PAGE_FORM_ID=9;  

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
      showToolbar: false,
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
    //"module_name",
    "project_name",
    //"primary_role",
    //"secondary_role",
    //"budget",
    //"standard",
    //"manpower_induction",
    //"quantity",
    //"acquisition_method",
    //"remarks",
    //"requested_by",
    "requested_on",
    //"email",
    "approval",
    "ship",
    "responsibility",
    //"upload",
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
  public GTRList = [];
  //public projectid=[];
  projectid:any;
  project_id:any;
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
  editID='';

  showErrors = false


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
  @ViewChild("closebutton_edit") closebutton_edit;

  @ViewChild("closebuttonproject") closebuttonproject;
  @ViewChild("closebuttonapproval") closebuttonapproval;
  @ViewChild("closebuttoncomments") closebuttoncomments;
  @ViewChild("closebutton_email") closebutton_email;

  @ViewChild(FormGroupDirective) formGroupDirective: FormGroupDirective;
  @ViewChild("mySel") skillSel: MatSelect;




  currentDate = new Date();
  constructor(public api: ApiService, private notification : NotificationService,
    private dialog:MatDialog, private router : Router, private elementref : ElementRef,private logger:ConsoleService,public aroute: ActivatedRoute, 
    private formBuilder: FormBuilder) {

    // this.aroute.params.subscribe(routeParams => {
    //     this.PAGE_FORM_ID = routeParams.id;
    //     this.getFormName();
    // });
    this.getFormName();
  }
  test:any;


  docForm!: FormGroup;
  items!: FormArray;

  public editForm = new FormGroup({
    id: new FormControl(""),
     section: new FormControl(""),
     sub_section: new FormControl(""),
     sub_sub_section: new FormControl(""),
     paragraph: new FormControl(""),
  });

  populate(data) {
    openModal('#crud-countries-edit');
    this.global_psr1 = data['sub_module'][0]['section']

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
  formNAME='';
  getFormName()
  {
    this.api.postAPI(environment.API_URL + "transaction/form-name",{id:this.PAGE_FORM_ID}).subscribe((res) => {
      if(res.status==environment.SUCCESS_CODE)
      {
        this.formNAME=res.name;
      }
    });
  }
  ngOnInit(): void {

    
   this.getprojectlist();
   this.getListing();
   this.getAccess();
   this.getGlobalStatus();

   this.getUnits();
   this.getModule();
   this.getSubmodule();
   this.getSection();
   this.getSubSection();
   this.getSubSubSection();

  this.getCommand()

   this.editID='';
  }
  public FinalArray = [];
  projects=[];


  // ** Dynamic Part ** //

  module=[];
  submodule=[];
  section=[];
  subsection=[];
  subsubsection=[];
  getSubmodule(module_id='') {
    let searchString='?status=1&module_id=1&order_type=asc';
    //let searchString='?status=1&id='+Number(4);
    //searchString+=module_id?'&module_id='+1:'&order_type=asc';
    // searchString+=region_id?'&region_id='+region_id:'';
      let id=event;
      this.api.getAPI(environment.API_URL + "master/sub_module"+searchString).subscribe((res)=> {
        this.submodule = res.data;
    });
  }

  getSection(module_id='') {
    let searchString='?status=1';
    searchString+=module_id?'&module_id='+module_id:'&order_type=asc';
    // searchString+=region_id?'&region_id='+region_id:'';
    this.api.getAPI(environment.API_URL + "master/global_section"+searchString).subscribe((res)=> {
        this.section = res.data;
    });
  }

  getSubSection(module_id='') {
    let searchString='?status=1';
    searchString+=module_id?'&module_id='+module_id:'&order_type=asc';
    // searchString+=region_id?'&region_id='+region_id:'';
    this.api.getAPI(environment.API_URL + "master/global_sub_section"+searchString).subscribe((res)=> {
        this.subsection = res.data;
        console.log(this.subsection,'dddddddd')
    });

  }
  getSubSubSection(module_id='') {
    let searchString='?status=1';
    searchString+=module_id?'&module_id='+module_id:'&order_type=asc';
    // searchString+=region_id?'&region_id='+region_id:'';
    this.api.getAPI(environment.API_URL + "master/global_sub_sub_section"+searchString).subscribe((res)=> {
      this.subsubsection = res.data;
       console.log(this.subsubsection,'dd1111d')
    });
  } 

  getModule() {
      this.api
      .getAPI(environment.API_URL + "master/module?status=1")
      .subscribe((res)=> {
        this.module = res.data;
    });

   }


  allUnits:any;
  getUnits()
  {
      this.api
        .getAPI(environment.API_URL + "master/unit?&status=1")
        .subscribe((res) => {
          this.allUnits = res.data;
          console.log(this.allUnits,"@@@@")
        });
  }



getProject(code) {

  var proURL:any;
  proURL = 'transaction/global_transaction_edit_1?approved_status=2&form_id='+(this.PAGE_FORM_ID-1);


  console.log(proURL);
  //return false;
  this.api
    //.getAPI(environment.API_URL + "transaction/global_transaction_edit_1?approved_status=2&form_id=5")
  .getAPI(environment.API_URL + proURL)
    .subscribe((res) => {
      //console.log('dff',res.data[0].project)

      //console.log(res.data,"GGGGGGg")

          if(code=="add"){
          for (var i = 0; i < res.data.length; ++i) {
             res.data[i].project;
             console.log('project1',res.data[i].project.id)
            var found = false;

            for (var j = 0; j < this.dataListPending.length; ++j) {
                if (this.dataListPending[j].project.id == res.data[i].project.id) {
                    found = true;
                    break;
                }
            }

            if (!found) {

              console.log(res.data[i].project,"sss")
              this.FinalArray.push(res.data[i].project);
            }
          }
          }
          else if(code=="edit"||code=="view") {
            this.FinalArray = arrayColumn(res.data,'project');
          }
          

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

  

  getListing() {
    let data=[];
     this.dataSourcePending =new MatTableDataSource(data);
if(this.param==undefined) this.param=""; else this.param;
this.api.displayLoading(true)
    this.api.getAPI(environment.API_URL + "transaction/global/transactions?status=1&form_id="+this.PAGE_FORM_ID+'&'+this.param).subscribe((res) => {
  this.api.displayLoading(false)    
        setTimeout(() => {
        this.dataSourcePending = new MatTableDataSource(res.data);
         }, 10); 
        //this.initiationList = res.data;
        this.dataListPending = res.data;
        console.log(this.dataListPending,"Lenght")
        this.FinalArray=[];
        this.getProject;
        this.dataSourcePending.paginator = this.paginationPending;
        this.logger.log('global_transaction_edit_1',res.data)
        // console.log('qqqq',this.dataListPending[0].project)
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
    this.project_ID='';
    this.crudName = "Add";
    this.isReadonly=false;
    this.editForm.enable();
    this.editID='';

    //this.getInitiationTemplate();

    let reset = this.formGroupDirective.resetForm();
    if(reset!==null) {
      this.initForm();
    }
    

  }


  pro:any;
  editt:any;
  idd:any;
  proid:any;
  project_ID='';
  editOption(initiation) {
    console.log("initiation",initiation)
    this.editID=initiation.id;
    this.project_ID='';
    this.pro=true;
    this.editorConfig.editable= true
    this.isReadonly=false;
    this.crudName = "Submit";
    //this.global_psr1 = initiation['section'];
    this.proid=initiation.project.id;
    this.editt=initiation.project.name;
    this.project_ID=initiation.project.id;
    
    /*this.gtID.nativeElement.value = initiation.id;
    this.moduleID.nativeElement.value = initiation.module.id;*/
    

    this.fromPSR(initiation.project.id);
    this.getSSS(initiation.project.id);
    this.getProject("edit");
    setTimeout(()=>{this.project_ID=initiation.project.id;},1500);
    this.getInitiationTemplate(initiation.project.id);

    setTimeout(()=>{this.project_ID=initiation.project.id;},5000);
   
  }

  

  viewTrial:any;
  onView(initiation) {
    this.project_ID='';
    this.editID=initiation.id;
    //console.log(initiation,'Vieeeew')
    this.pro=true;
    this.proid=initiation.project.id;
    this.editt=initiation.project.name;
    this.project_ID='';
    this.project_ID=initiation.project.id;

    this.crudName = 'View';
    this.viewTrial=initiation;
    this.getProject("view");
    this.isReadonly=true;
   
    this.editorConfig.editable= false;
    this.fromPSR(initiation.project.id);
    this.getSSS(initiation.project.id);
    setTimeout(()=>{this.project_ID=initiation.project.id;},1500);
    this.getInitiationTemplate(initiation.project.id);

    setTimeout(()=>{this.project_ID=initiation.project.id;},5000);

  }


  public editFormApproval = new FormGroup({
    id: new FormControl("", [Validators.required]),
    project: new FormControl("", [Validators.required]),
    approved_status: new FormControl("", [Validators.required]),
    form: new FormControl("", [Validators.required]),
    approved_by_name: new FormControl(""),
    approved_by: new FormControl("",[Validators.required]),
    approved_on: new FormControl("",[Validators.required]),
    approved_remark: new FormControl("",[Validators.required]),
  });
approvalError = (controlName: string, errorName: string) => {
    return this.editFormApproval.controls[controlName]?this.editFormApproval.controls[controlName].hasError(errorName):false;
  };
  approval(initiation) {

    this.editorConfig.editable= true;
    //console.log('@@@@@',initiation);
    this.editFormApproval.patchValue({
      id: initiation.id,
      project: initiation.project.id,
      form: initiation.form,
      approved_status: initiation.approved_status,
      approved_by_name: this.api.userid.first_name+' '+this.api.userid.last_name,
      approved_by: this.api.userid.user_id,
      approved_remark: initiation.approved_remark,
      approved_on: formatDate(new Date(), 'yyyy-MM-dd', 'en')
    });
this.localform.submitted=false;
   this.showError = false;
  }



  onSubmitApproval() {
    this.editFormApproval.value

     this.editFormApproval.value.approve = 'yes';
     //this.editFormProject.value.status = this.editFormProject.value.status==true ? 1 : 2;
    if (this.editFormApproval.valid) {
      this.api
      .postAPI(
        environment.API_URL + "transaction/global_transaction_approve_status",
        this.editFormApproval.value
      )
      .subscribe((res) => {
        this.logger.log('response',res);
        if(res.status==environment.SUCCESS_CODE){
          this.notification.success(res.message);
          this.getListing();
          this.notification.warn('BLS Initiation notes Approval Updated');
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
        this.api.postAPI(environment.API_URL + "transaction/global/transactions/delete", {
          id: data.id,}).subscribe((res)=>{
          if(res.status==environment.SUCCESS_CODE) {
            this.logger.info('delete')
            this.getListing();
            this.notification.success(res.message);

          } else {
            this.notification.displayMessage(language[environment.DEFAULT_LANG].unableDelete);
          }
        });
      }
      dialogRef=null;
    });
  }

  changeProject(value) {
    //console.log(value);
    this.project_id = value;
    this.getInitiationTemplate(value);
    this.fromPSR(value);
    this.getSSS(value);
    this.project_ID=value;
  }



completePSR='';
  fromPSR(project_id=""){
     var desRes =  this.api.userid.designation!=null ? this.api.userid.designation[0].id : '';
      this.api
        .postAPI(environment.API_URL + "transaction/get-all-psr",{module_id:1,form_id:1,project_id:project_id,directorate_id:desRes})
        .subscribe((res) => {
          // this.api.displayLoading(false)
          //this.completePSR = res.data;
          this.completePSR = res.data[3];

          //console.log(this.completePSR1,"GGGGGGg")
          //console.log(res.data[3],"HHHHHHHH")
        });
      }


  completeSSSMapping='';
  getSSS(project_id=""){
      
      this.api
        .getAPI(environment.API_URL + "transaction/get-sss?project_id="+project_id)
        .subscribe((res) => {
         
          console.log(res.data,"SSS")
          this.completeSSSMapping = res.data;
          //this.completePSR = res.data[3];

          //console.log(this.completePSR1,"GGGGGGg")
          //console.log(res.data[3],"HHHHHHHH")
        });
  }


 projecid:any;
 onSubmitNew()
 {
  if(this.project_ID=='')
      this.notification.displayMessage("Please select project");
   else
   {
  let finalPayload=[];
    for(let i=0;i<(this.forms).length;i++)
    {
      for(let j=0;j<(this.forms[i].section).length;j++)
      {
        finalPayload.push(this.forms[i].section[j])
      }
      
    }
 
   this.transaction = finalPayload;
   // this.transaction = this.forms[0]['section'];
   this.api.displayLoading(true)
    this.api.postAPI(environment.API_URL + "transaction/global/transactions/save",{id:this.editID,module:this.PAGE_MODULE_ID,form:this.PAGE_FORM_ID,project_id: this.project_ID, psr:this.transaction, system:this.itemsSystemChild}).subscribe((res) => {
      this.api.displayLoading(false)
      if(res.status==environment.SUCCESS_CODE)
      {
        this.notification.success(res.message);
        this.getListing();
        closeModal('#crud-countries');
        this.closebutton_edit.nativeElement.click();
      }
      else
      {
        this.notification.displayMessage(res.message);
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

  Commentclose(){
    closeModal('#comments-modal');
   this.editFormComments.reset();
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


  transaction:any
  //url:any;
  global_psr: any;
  global_psr1: any;
  initiation_form: any;
  approach_paper_form: any;
  input_sr:any;
  concept_design:any;
  incorporation:any;
  rfi:any;
  forms:any;
  getInitiationTemplate(project_id='') {
    this.project_ID=project_id;
    if(this.editID!='')
      this.getProject("edit");
    else
      this.getProject("add");
    if(project_id!=""){
      this.api.displayLoading(true);
      var desRes =  this.api.userid.designation!=null ? this.api.userid.designation[0].id : '';
      this.api.postAPI(environment.API_URL + "transaction/forms-template",{"module_id":this.PAGE_MODULE_ID,"form_id":this.PAGE_FORM_ID,"project_id":project_id,"directorate_id":desRes}).subscribe((res) => {
          this.forms = res.data;
          this.api.displayLoading(false);
        });
      }
    else
    {
      this.forms=null;
      this.editID='';
    }
   }
searchForm= new FormGroup({
    project:new FormControl(""),
    
  })
 projectslist:any;

  getprojectlist() {
    this.api
      .getAPI(environment.API_URL + "master/project?status=1")
      .subscribe((res) => {
        this.projectslist = res.data;
      });
  }

   param:any;
  search(){
  let type=this.searchForm.value.project?"project="+this.searchForm.value.project:"";
    this.param=type;
    console.log('param',this.param)
    this.getListing();
  }

 clear(){
    this.searchForm.reset();
    this.param="";
    this.getListing();
  }
 chooseCountry(event) {
    this.getprojectlist();
    
  }



  public editFormComments = new FormGroup({
    id: new FormControl(""),
    project_id: new FormControl("", [Validators.required]),
    module_id: new FormControl("", [Validators.required]),
    sub_module_id: new FormControl("", [Validators.required]),
    section_id: new FormControl(""),
    sub_section_id: new FormControl(""),
    sub_sub_section_id: new FormControl(""),
    comments: new FormControl("", [Validators.required]),

    //status: new FormControl("", [Validators.required]),
    created_on: new FormControl("",[Validators.required]),
    created_by: new FormControl("",[Validators.required])
  });

  onComments(project_id, module_id, sub_module_id, section_id='',sub_section_id='',sub_sub_section_id=''){

    this.editFormComments.reset();
    //console.log(project_id, module_id, sub_module_id, section_id,sub_section_id,sub_sub_section_id,"HHHHHH")
    //return false;

    this.editFormComments.patchValue({
      id: '',
      project_id: project_id,
      module_id: module_id,
      sub_module_id: sub_module_id,
      section_id: section_id,
      sub_section_id: sub_section_id,
      sub_sub_section_id: sub_sub_section_id,
      //comments: initiation.approved_remark,
      //created_by: this.api.userid.user_id,
      //created_on: formatDate(new Date(), 'yyyy-MM-dd', 'en')
    });

  }

  onSubmitComments() {

      this.editFormComments.value.created_by = this.api.userid.user_id;
      this.editFormComments.value.created_on = formatDate(new Date(), 'yyyy-MM-dd', 'en');
      this.editFormComments.value.comments = this.editFormComments.value.comments; 
      

      // console.log(this.editFormComments.value,"Vlid")
      // console.log(this.editFormComments.valid,"Vlid")
      // return false;
      //if (this.editFormComments.valid) {

      //console.log(this.editFormComments.value,"FFFFFFFFf")
      //return false;  
        this.api
        .postAPI(
          environment.API_URL + "transaction/global/transactions_comments/save",
          this.editFormComments.value
        )
        .subscribe((res) => {
          this.logger.log('response',res);
          if(res.status==environment.SUCCESS_CODE){
            this.notification.success(res.message);
            //alert(this.project_ID);
            //this.getListing();
            //this.notification.warn('Comments added');
            this.closebuttoncomments.nativeElement.click();
            // this.closebutton.nativeElement.click();

            this.getInitiationTemplate(this.project_ID);
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
    //}

  }


  onDeleteComments(id){
    //console.log(id,"Delete")
    //return false;
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: language[environment.DEFAULT_LANG].confirmMessage
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {

      this.api
        .postAPI(
          environment.API_URL + "transaction/global/transactions_comments/delete",
          {"id":id}
        )
        .subscribe((res) => {
          this.logger.log('response',res);
          //this.error= res.status;
          if(res.status==environment.SUCCESS_CODE){
            // this.logger.log('Formvalue',this.resForm.value);
            //this.logger.info('delete')
            this.notification.success(res.message);

            //this.getGlobalTRListing(this.resForm.value.project);
            //this.getDocumentListing({id:presentation_of_approach_paper_id});
            //this.closebutton.nativeElement.click();
            this.getInitiationTemplate(this.project_ID);
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
      dialogRef=null;
    });
  }


    populateComments(data) {
      openModal('#comments-modal');
    console.log(data,"data");
    this.editFormComments.patchValue({id: data.id});
    this.editFormComments.patchValue({project_id: data.project});
    this.editFormComments.patchValue({module_id: data.module});
    this.editFormComments.patchValue({sub_module_id: data.sub_module});
    this.editFormComments.patchValue({section_id: data.section});
    this.editFormComments.patchValue({sub_section_id:data.sub_section});
    this.editFormComments.patchValue({sub_sub_section_id:data.sub_sub_section});
    this.editFormComments.patchValue({comments: data.comments});
  }


  editCommentsOption(data) {

    //console.log(data);
    //return false;
    //this.editFormComments.enable();
    this.populateComments(data);

  }


  onResponsibilityLoad(formulation){
    //console.log(formulation,"GGG")
    this.resForm.patchValue({project:formulation.project.id});
    this.getGlobalTRListing(formulation.project.id)
  }

  getGlobalTRListing(project) {
    //console.log(formulation,"ddd")
    //alert(presentation.id)
    this.api
      .getAPI(environment.API_URL + "transaction/global_transaction_responsibility?status=1&project_id="+project)
      .subscribe((res) => {
        this.GTRList = res.data;
      });
   }


  onDeleteGlobalTR(data){
    //console.log(data.id,"Delete")
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: language[environment.DEFAULT_LANG].confirmMessage
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {

      this.api
        .postAPI(
          environment.API_URL + "transaction/delete_transaction_responsibility",
          {"id":data.id}
        )
        .subscribe((res) => {
          this.logger.log('response',res);
          //this.error= res.status;
          if(res.status==environment.SUCCESS_CODE){
            // this.logger.log('Formvalue',this.resForm.value);
            //this.logger.info('delete')
            this.notification.success(res.message);

            this.getGlobalTRListing(this.resForm.value.project);
            //this.getDocumentListing({id:presentation_of_approach_paper_id});
            //this.closebutton.nativeElement.click();
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
      dialogRef=null;
    });
  }


   // **** Dynamic Part **** //


  public resForm = new FormGroup({
    id: new FormControl(""),
    directorate: new FormControl("", [Validators.required]),
    //module: new FormControl("",[Validators.required]),
    //sub_module: new FormControl("",[Validators.required]),
    //global_section: new FormControl("",[Validators.required]),
    project: new FormControl("",[Validators.required]),
    created_by: new FormControl(""),
    created_ip: new FormControl(""),
    modified_by: new FormControl(""),
    formmapping: this.formBuilder.array([]),
    //status: new FormControl("", [Validators.required]),
  });


  onSubmitRes() {
    let para = {'module':1}
     if (this.resForm.valid) {
      this.resForm.value.created_by = this.api.userid.user_id;
      this.resForm.value.status = this.resForm.value.status==true ? 1 : 2;    

     let formVal = {
      ...this.resForm.value,
      ...para
     }

      //console.log("FF",formVal);
      //return false;
      this.api
        .postAPI(
          environment.API_URL + "transaction/save_transaction_responsibility",
          formVal
        )
        .subscribe((res) => {
          this.logger.log('response',res);
          //this.error= res.status;
          if(res.status==environment.SUCCESS_CODE){
            // this.logger.log('Formvalue',this.resForm.value);
            this.notification.success(res.message);

            this.getGlobalTRListing(this.resForm.value.project);
            //this.getDocumentListing({id:presentation_of_approach_paper_id});
            //this.closebutton.nativeElement.click();
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

  onRoleAdd(){
    this.addformmapping(); 
  }

  addformmapping(data='') {
   this.formmapping.push(this.newformmapping(data));
  }

  removeformmapping(i:number){
  this.formmapping.removeAt(i);
  }

  get formmapping() : FormArray {
    return this.resForm.get("formmapping") as FormArray
  }

  selectedRoles=[];
  newformmapping(data): FormGroup {
   return this.formBuilder.group({
      //module: new FormControl((data && data.module && data.module.id?data.module.id:'')),
      // region_id: new FormControl(''),
      sub_module: new FormControl((data && data.sub_module && data.sub_module.id?data.sub_module.id:'')),
      section: new FormControl((data && data.section && data.section.id?data.section.id:'')),
      sub_section: new FormControl((data && data.sub_section && data.sub_section.id?data.sub_section.id:'')),
      sub_sub_section: new FormControl((data && data.sub_sub_section && data.sub_sub_section.id?data.sub_sub_section.id:'')),
     });
  }

  itemsSystemChild:any
  parentFunction(data){
    this.itemsSystemChild = data;
  }

  checkValue()
  {
    console.log("this.forms",this.forms)
  }


  // Ship Details //
  commands:any;
  getCommand() {
    this.api
      .getAPI(environment.API_URL + "master/command?status=1")
      .subscribe((res) => {
        this.commands = res.data;
      });
  }
  
  public editShip = this.formBuilder.group({
    id: new FormControl(""),
    form_id: new FormControl("", [Validators.required]),
    project_id: new FormControl("", [Validators.required]),
    ship: this.formBuilder.array([]),
  });

 clearShipFormArray = (formArray: FormArray) => {
    while (formArray.length !== 0) {
      formArray.removeAt(0)
    }
  }

  shipDetails(data) {
    //console.log(data)
    this.project_ID = data.project.id
    this.populateShip(data)
    // this.getforms(1)
    // this.getUser(1)
  }


  populateShip(data) {
    //console.log(form_id,"Sample")
    this.api.displayLoading(true)
     this.api
     .getAPI(environment.API_URL + "transaction/get_ship_details?form_id="+data.form+"&project_id="+data.project.id)
    .subscribe((res) => {
      this.api.displayLoading(false)

      let ship_data = res.data.ship;

      console.log(ship_data,"Ship data")

      this.showErrors=false;
      this.clearShipFormArray(this.ship);

      // //setTimeout(()=>{
        if(ship_data.length>0)
        {
          for(let i=0;i<ship_data.length;i++)
          {
            this.addShip(ship_data[i])                  
          }
        }

      // //},2000)

    });    
  }

  // Ship ///
  onShipAdd()
  { 
    this.addShip();
  }

  get ship() : FormArray {
    return this.editShip.get("ship") as FormArray
  }

  addShip(data='') {
     this.ship.push(this.newShip(data));
  }

  newShip(data): FormGroup {
   return this.formBuilder.group({
      name: new FormControl((data && data.name ? data.name : '')),
      code: new FormControl((data && data.code ? data.code : '')),
      ship_id: new FormControl((data && data.ship_id ? data.ship_id : '')),
      command: new FormControl((data && data.command_id ? data.command_id : ''))
   });
  }

 removeShip(i:number){
    this.ship.removeAt(i);
  }

  onSubmitShip() {

    this.editShip.value.id = '';
    //this.editShip.value.form_id = 9;
    this.editShip.value.project_id = this.project_ID;
    //console.log('cfcc',this.editShip.value)
    this.showErrors=true;
    //if (this.editShip.valid) {
    //console.log(this.editShip,'fdfsd')
    //return false;    
    console.log('cfcc',this.editShip.value)
    //return false;
    this.api.displayLoading(true)
      this.api
        .postAPI(
          environment.API_URL + "transaction/ship_details",
          this.editShip.value
        )
        .subscribe((res) => {

          this.api.displayLoading(false)
          if(res.status==environment.SUCCESS_CODE){
            this.notification.success(res.message);
            this.getListing();
            // this.api.displayLoading(true)
            //this.getFormmappingList();
            // this.api.displayLoading(false)
            this.closebutton_ship.nativeElement.click();
            
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
    //}
  }

}