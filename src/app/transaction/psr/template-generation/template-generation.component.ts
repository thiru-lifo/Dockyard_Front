import { Component, OnInit, ViewChild,ViewChildren, Input, ElementRef, Renderer2 } from '@angular/core';
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

import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem
} from "@angular/cdk/drag-drop";
import { moveItemInFormArray } from "./move-item-in-form-array";

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
  @ViewChild("gtID") gtID: ElementRef;
  @ViewChild("moduleID") moduleID: ElementRef;
  @ViewChild('div') div: ElementRef;

  @ViewChild("closebutton_recommender") closebutton_recommender;
  @ViewChild("closebutton_approver") closebutton_approver;
  @ViewChild("closebutton_hierarchy") closebutton_hierarchy;
  
  PAGE_MODULE_ID=1;
  PAGE_FORM_ID:any;

  

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
      ['fontSize','customClasses']
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
    "recommend",
    "approvals",
    "status",
    "hierarchy",
    "responsibility",
    //"upload",
    "download",
    "view",
    "edit",
    "delete",

  ];

  displayedColumnsApproved: string[] = [
    "project_name",
    "requested_on",
    "view",

  ];


  dataSource: MatTableDataSource<any>;
  dataSourceApproved: MatTableDataSource<any>;
  dataSourcePending: MatTableDataSource<any>;

  initiation: any;
  public crudName = "Add";
  public crudNameRes = "Add";
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
  //allSelected = false;
  allSelectedsecondary=false;
  environment=environment;
  showError = false;
  editID='';
  allSelected = false;
  users:any;
  user_recommender:any;
  user_approver:any;
  formsList:any;
  dataCount:boolean
  tran_id:any


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
  @ViewChildren("view")  view:any;
  @ViewChildren("view2")  view2:any;
  @ViewChildren("view3")  view3:any;


  currentDate = new Date();
  constructor(public api: ApiService, private notification : NotificationService,
    private dialog:MatDialog, private router : Router, private elementref : ElementRef,private logger:ConsoleService,public aroute: ActivatedRoute, 
    private formBuilder: FormBuilder, private renderer: Renderer2) {

    this.aroute.params.subscribe(routeParams => {
        this.PAGE_FORM_ID = routeParams.id;
        this.getFormName();
        //console.log(routeParams,"routeParamsrouteParamsrouteParamsrouteParams")
        this.tran_id = this.aroute.snapshot.queryParamMap.get('pid');
        //console.log(this.tran_id,"datedatedate")
    });


    
  }
  test:any;

  // Compartment
  docForm!: FormGroup;
  items!: FormArray;

  //System
  docFormSystem!: FormGroup;
  itemsSystem!: FormArray;

  //Equipment
  docFormEquipment!: FormGroup;
  itemsEquipment!: FormArray;


  public editForm = new FormGroup({
    id: new FormControl(""),
     section: new FormControl(""),
     sub_section: new FormControl(""),
     sub_sub_section: new FormControl(""),
     paragraph: new FormControl(""),
     view:new FormControl(""),
  });

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

  public approvalForm = new FormGroup({
    approved_level: new FormControl(""),
    form_id: new FormControl("", [Validators.required]),
    transaction_id: new FormControl("", [Validators.required]),
    comments: new FormControl("", [Validators.required]),
    status: new FormControl("", [Validators.required]),    
    type: new FormControl("", [Validators.required]),
    project_id: new FormControl(""),
    approved_role_id: new FormControl(this.api.userid.role_id, [Validators.required]),
  });



  public editFormSystem = new FormGroup({
    system: new FormControl("", [Validators.required]),
  });

  public editFormEquipment = new FormGroup({
    equipment: new FormControl("", [Validators.required]),
  });

  public editFormCompartment = new FormGroup({
    compartment: new FormControl("", [Validators.required]),
  });

  populate(data) {
    openModal('#crud-countries-edit');
    this.global_psr1 = data['sub_module'][0]['section']

  }

  initForm() {
    this.editForm.patchValue({
      status: "1",
      view:"1",
      primary_role: "",
    });
  }

  selectedTransaction:any;
  approvalHistory: any;
  openCurrentStatus(country){
    this.selectedTransaction = country;
    console.log(this.selectedTransaction,"HHH")

    this.api.postAPI(environment.API_URL + "transaction/approved_history", {
      transaction_id: this.selectedTransaction.id,
    }).subscribe((res) => {
     this.approvalHistory = res.data;


     console.log(this.approvalHistory,"approvalHistory")
    })

    openModal('#transaction-status-modal');
  }

  Error = (controlName: string, errorName: string) => {
    return this.editForm.controls[controlName]?this.editForm.controls[controlName].hasError(errorName):false;
  };
  ProjectError = (controlName: string, errorName: string) => {
    return this.editFormProject.controls[controlName]?this.editFormProject.controls[controlName].hasError(errorName):false;
  };
  ErrorApproval = (controlName: string, errorName: string) => {
    return this.approvalForm.controls[controlName].hasError(errorName);
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
  subModuleSelected:any
  ngOnInit(): void {
   
  this.subModuleSelected = Number(this.PAGE_FORM_ID);
  
    
   this.getUnits();
   this.getListing();
   this.getAccess();
   this.getGlobalStatus();
   this.getprojectlist();
   //this.getSection(this.PAGE_FORM_ID)
   //this.getModule();
   ///this.getSubModule('1');
   this.getProcess();

    this.getModule();
    this.getSubmodule();
    this.getSection();
    this.getSubSection();
    this.getSubSubSection();
    //this.getUser();
    this.getforms();
    this.editID='';

  
    // if(this.tran_id!=null){
    //   setTimeout(()=>{
    //     //openModal('#crud-countries');
        
    //     this.project_ID=this.tran_id;
    //     this.getInitiationTemplate(this.tran_id);
    //     openModal('#crud-countries');
    //     this.getProject("edit");
    //   },5000);
    // }


    if(this.tran_id!=null){
        setTimeout(()=>{
          
          openModal('#crud-countries');
          this.editOption(parseInt(this.tran_id),'d')
        },5000);
    }

  }

// module:any;
//   getModule() {
//     this.api
//       .getAPI(environment.API_URL + "master/module?status=1")
//       .subscribe((res) => {
//         this.module = res.data;
//       });
//   }


// submodules:any;
//   getSubModule(module='') {
//     this.api
//       .getAPI(environment.API_URL + "master/sub_module?module="+module+"&status=1")
//       .subscribe((res) => {
//         this.submodules = res.data;

//       });
//   }


  // sections:any;
  // getSection(sub_module=1) {
  //   this.api
  //     .getAPI(environment.API_URL + "master/global_section?sub_module="+sub_module+"&status=1")
  //     .subscribe((res) => {
  //       this.sections = res.data;

  //     });
  // }


  module=[];
  submodule=[];
  section=[];
  subsection=[];
  subsubsection=[];
  getSubmodule(module_id='') {
    let searchString='?status=1&module_id=1&order_type=asc';
    //let searchString='?status=1&id='+Number(this.PAGE_FORM_ID);
    //searchString+=module_id?'&module_id='+module_id:'&order_type=asc';
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


  public FinalArray = [];
  projects=[];



  getProject1(code) {
    this.api.getAPI(environment.API_URL + "master/project?status=1").subscribe((res) => {
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
    });
  }

getProject(code) {


  //console.log(this.PAGE_FORM_ID,"JJJJJJJJ") 
  var proURL:any;
  //console.log(this.dataListPending,"ffffff")

  if(this.PAGE_FORM_ID==1){
    proURL = 'master/project?status=1';
  }else{
    proURL = 'transaction/global_transaction_edit_1?approved_status=2&form_id='+(this.PAGE_FORM_ID-1);
  }


  //console.log(proURL);
  //return false;
  this.api
    //.getAPI(environment.API_URL + "transaction/global_transaction_edit_1?approved_status=2&form_id=5")
  .getAPI(environment.API_URL + proURL)
    .subscribe((res) => {
      //console.log('dff',res.data[0].project)

      //console.log(res.data,"GGGGGGg")

      if(this.PAGE_FORM_ID==1){


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


      }else{
        
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
            this.FinalArray = this.FinalArray = arrayColumn(res.data,'project');
          }
          console.log('this.FinalArray1',this.FinalArray);
      }
      console.log('this.FinalArray',this.FinalArray);

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

  
 param1:any;
  getListing() {


    //let searchString = 'approved_level=-2';
    let searchString = '';
    let data=[];
     this.dataSourcePending =new MatTableDataSource(data);
    let type1=this.PAGE_FORM_ID?"form_id="+this.PAGE_FORM_ID:"";
    this.param1=type1;
    if(this.param==undefined) this.param=""; else this.param;
     this.api.displayLoading(true)
    this.api.getAPI(environment.API_URL + "transaction/global/transactions?form_id="+this.PAGE_FORM_ID+'&'+this.param + searchString+'&order_type=desc').subscribe((res) => {
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
  editOption(initiation,type) {
    
    console.log(initiation,"Edit")
    this.editID=initiation.id;
    this.project_ID='';
    this.pro=true;
    this.editorConfig.editable= true
    this.isReadonly=false;
    this.crudName = "Submit";
    //this.global_psr1 = initiation['section'];
    if(type!='d'){
    this.proid=initiation.project.id;
        this.editt=initiation.project.name;
    this.project_ID=initiation.project.id;
  }else{

        this.proid=initiation;
        
    this.project_ID=initiation;

  }
  console.log(this.project_ID,"this.project_IDthis.project_IDthis.project_ID")
    
    
    /*this.gtID.nativeElement.value = initiation.id;
    this.moduleID.nativeElement.value = initiation.module.id;*/
    
    this.getProject("edit");

    if(type!='d'){
    setTimeout(()=>{this.project_ID=initiation.project.id;},1500);
    this.getInitiationTemplate(initiation.project.id);
  }else{
    setTimeout(()=>{this.project_ID=initiation;},1500);
    this.getInitiationTemplate(initiation);
  }
  

    // Dynamic //
    this.items = this.docForm.get('items') as FormArray;
    this.clearFormArray(this.items);
    //this.items.push(this.formBuilder.group({form_id: ''}));


    // Dynamic System //
    this.itemsSystem = this.docFormSystem.get('itemsSystem') as FormArray;
    this.clearFormArray(this.itemsSystem);
    //this.itemsSystem.push(this.formBuilder.group({form_id: ''}));
   
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
    this.editForm.disable();
    // this.populate(initiation);
    this.editorConfig.editable= false;

    setTimeout(()=>{this.project_ID=initiation.project.id;},1500);
    this.getInitiationTemplate(initiation.project.id);
    
  }






  public editFormApproval = new FormGroup({
    id: new FormControl("", [Validators.required]),
    project: new FormControl("", [Validators.required]),
    form: new FormControl("", [Validators.required]),
    approved_status: new FormControl("", [Validators.required]),
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
    console.log('@@@@@',initiation);
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
    console.log('dada',this.editFormApproval.value)
    this.showError = true;
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
          this.showError = false;
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
          id: data.id}).subscribe((res)=>{
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
    this.project_ID=value;
  }
 projecid:any;
 onSubmitNew()
 {
  console.log(this.view,'111');
  console.log('this.forms',this.forms);
    let finalPayload=[];
    for(let i=0;i<(this.forms).length;i++)
    {
      for(let j=0;j<(this.forms[i].section).length;j++)
      {
        finalPayload.push(this.forms[i].section[j])
      }
      
    }
 
   this.transaction = finalPayload;
   console.log('finalPayload',this.transaction);

   //console.log("Compartment",this.items.value)
   //console.log("System",this.itemsSystem.value)
   //console.log("Equipment",this.itemsEquipment.value)

   //console.log("SSSssss",docFormSystem1)
   console.log("onSubmit",this.itemsSystemChild);
   console.log(localStorage.getItem('system'))
  //return false;
   if(this.project_ID=='')
      this.notification.displayMessage("Please select project");
   else
   {
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
    var element = <HTMLInputElement>document.getElementById("exampleCheck1");
    element.checked = true;
   
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
    //console.log(this.api.userid.designation[0].code,"DDDD");
    this.project_ID=project_id;
    //alert(this.editID)
    if(this.editID!='')
      this.getProject("edit");
    else
      this.getProject("add");
    if(project_id!=""){

      var desRes =  this.api.userid.designation!=null ? this.api.userid.designation[0].id : '';
      //console.log(this.api.userid.designation, desRes);
      //return false;
      this.api.displayLoading(true);
      this.api.postAPI(environment.API_URL + "transaction/forms-template",{"module_id":this.PAGE_MODULE_ID,"form_id":this.PAGE_FORM_ID,"project_id":project_id,"directorate_id":desRes}).subscribe((res) => {
          this.api.displayLoading(false);
          this.forms = res.data;
        });



    // Dynamic
    // this.items = this.docForm.get('items') as FormArray;
    // this.clearFormArray(this.items);
    // //this.items.push(this.formBuilder.group({module_id: '',sub_module_id:''}));
    // this.items.push(this.formBuilder.group({form_id: ''}));

    // // System.
    // this.itemsSystem = this.docFormSystem.get('itemsSystem') as FormArray;
    // this.clearFormArray(this.itemsSystem);
    // this.itemsSystem.push(this.formBuilder.group({form_id: ''}));

      
      }
    else
    {
      this.forms=null;
      this.editID='';
    }
     
   }
genRandom(){
 return Math.round(Math.random() * 10000);
 }

  onResponsibilityLoad(formulation){

    console.log(formulation,"GGG")


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
downloadsection(country) {
    //let para = {"country":country,"form_id":this.PAGE_FORM_ID}
    window.open(environment.API_URL+'transaction/global_transaction_submodule/report/'+country+'/'+this.PAGE_FORM_ID)

  }

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


  toggleAllSelection() {
    if (this.allSelected) {
      this.select2.options.forEach((item: MatOption) => item.select());
    } else {
      this.select2.options.forEach((item: MatOption) => item.deselect());
    }
  }


  onEditGlobalTR(data){
    console.log(data,"ggg")
    this.getSection(data.details[0].sub_module.id);
    //this.resForm.patchValue(data);
    this.resForm.patchValue({directorate: data.directorate.id});
    this.resForm.patchValue({sub_module:data.details[0].sub_module.id});
    this.resForm.patchValue({global_section:[1,2]});
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
      dialogRef=null;
    });
  }


  /// Dynamic Section ///

  getProcess() {
      this.docForm = new FormGroup({
          items: new FormArray([]),
          //ship_id :new FormArray([]),
      });

      this.docFormSystem = new FormGroup({
          itemsSystem: new FormArray([]),
          //ship_id :new FormArray([]),
      });

      this.docFormEquipment = new FormGroup({
          itemsEquipment: new FormArray([]),
          //ship_id :new FormArray([]),
      });
  }
  // Compartment //
  createItem(val=''): FormGroup {
    return this.formBuilder.group({
       c_name:val,
       // global_section:'',
        //sub_section:'',
        //sub_sub_section:'',
    });
  }

  compartmentList: any;
  addMoreLoadList(compartment): void {

    console.log(compartment);

      this.api
        .postAPI(
          environment.API_URL + "master/section_compartment",
          {
            "global_section_id":compartment.global_section_id,
            "global_sub_section_id":compartment.global_sub_section_id!=null?compartment.global_sub_section_id:'',
            "global_sub_sub_section_id":compartment.global_sub_sub_section_id!=null?compartment.global_sub_sub_section_id:''
          }
        )
        .subscribe((res) => {
          //this.logger.log('response',res);
          //this.error= res.status;
          if(res.status==environment.SUCCESS_CODE){

            console.log(res.data)
            this.compartmentList = res.data;
            openModal('#compartment-modal');
            //addMore();
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

  addMore(val): void {
    //alert(val)
    //console.log(val)
    this.items = this.docForm.get('items') as FormArray;
    this.items.push(this.createItem());
  }

  removeItem(i): void {
    this.items.removeAt(i);
    /*delete this.items.value[i];
    delete this.items.controls[i];*/
    console.log(this.items)
  }

  addMore1(): void {
    //alert(val)
    //console.log(val)
    this.items = this.docForm.get('items') as FormArray;
    this.items.push(this.createItem1());
  }

  createItem1(): FormGroup {
    return this.formBuilder.group({
       c_name:'',
       // global_section:'',
        //sub_section:'',
        //sub_sub_section:'',
    });
  }

  // System //
  createItemSystem(val): FormGroup {
    return this.formBuilder.group({
       s_name:val,
       // global_section:'',
        //sub_section:'',
        //sub_sub_section:'',
    });
  }

  systemList: any;
  addMoreSystemLoadList(system): void {

    console.log(system);

      this.api
        .postAPI(
          environment.API_URL + "master/section_system",
          {
            "global_section_id":system.global_section_id,
            "global_sub_section_id":system.global_sub_section_id!=null?system.global_sub_section_id:'',
            "global_sub_sub_section_id":system.global_sub_sub_section_id!=null?system.global_sub_sub_section_id:''
          }
        )
        .subscribe((res) => {
          //this.logger.log('response',res);
          //this.error= res.status;
          if(res.status==environment.SUCCESS_CODE){

            console.log(res.data,"WWWWWWW")
            this.systemList = res.data;
            openModal('#system-modal');
            //addMore();
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

  addMoreSystem(val): void {

    //openModal('#sec-modal');
    this.itemsSystem = this.docFormSystem.get('itemsSystem') as FormArray;
    this.itemsSystem.push(this.createItemSystem(val));
    //console.log(this.items)
  }

  removeItemSystem(i): void {
    this.itemsSystem.removeAt(i);
    /*delete this.items.value[i];
    delete this.items.controls[i];*/
    console.log(this.itemsSystem)
  }

  addMoreSystem1(): void {
    //alert('dd')

    //openModal('#sec-modal');
    this.itemsSystem = this.docFormSystem.get('itemsSystem') as FormArray;
    this.itemsSystem.push(this.createItemSystem1());
    //console.log(this.items)
  }

  createItemSystem1(): FormGroup {
    return this.formBuilder.group({
       s_ser:'',
       s_name:'',
       s_numbers:'',
       s_capabilities_feature:'',
       s_weight_volume_power_consumption:'',
       s_location:'',
       s_interface:'',
       s_procurement_router:'',
       s_vendor:'',
       s_cost:'',
       s_standards:'',
       s_sustenance:'',
    });
  }


  // Equipment
  createItemEquipment(val): FormGroup {
    return this.formBuilder.group({
       e_name:val,
       // global_section:'',
        //sub_section:'',
        //sub_sub_section:'',
    });
  }

  equipmentList: any;
  addMoreEquipmentLoadList(equipment): void {

    console.log(equipment);

      this.api
        .postAPI(
          environment.API_URL + "master/section_equipment",
          {
            "global_section_id":equipment.global_section_id,
            "global_sub_section_id":equipment.global_sub_section_id!=null?equipment.global_sub_section_id:'',
            "global_sub_sub_section_id":equipment.global_sub_sub_section_id!=null?equipment.global_sub_sub_section_id:''
          }
        )
        .subscribe((res) => {
          //this.logger.log('response',res);
          //this.error= res.status;
          if(res.status==environment.SUCCESS_CODE){

            //console.log(res.data,"WWWWWWW")
            this.equipmentList = res.data;
            openModal('#equipment-modal');
            //addMore();
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

  addMoreEquipment(val): void {

    //console.log(val,"dddddd")
    //openModal('#sec-modal');
    this.itemsEquipment = this.docFormEquipment.get('itemsEquipment') as FormArray;
    this.itemsEquipment.push(this.createItemEquipment(val));
    //console.log(this.items)

  }

  removeItemEquipment(i): void {
    this.itemsEquipment.removeAt(i);
    /*delete this.items.value[i];
    delete this.items.controls[i];*/
    console.log(this.itemsEquipment)
  }

  addMoreEquipment1(): void {

    //console.log(val,"dddddd")
    //openModal('#sec-modal');
    this.itemsEquipment = this.docFormEquipment.get('itemsEquipment') as FormArray;
    this.itemsEquipment.push(this.createItemEquipment1());
    //console.log(this.items)

  }

  createItemEquipment1(): FormGroup {
    return this.formBuilder.group({
       e_ser:'',
       e_name:'',
       e_numbers:'',
       e_capabilities_feature:'',
       e_weight_volume_power_consumption:'',
       e_location:'',
       e_interface:'',
       e_procurement_router:'',
       e_vendor:'',
       e_cost:'',
       e_standards:'',
       e_sustenance:'',
    });
  }


  clearFormArray = (formArray: FormArray) => {
    while (formArray.length !== 0) {
      formArray.removeAt(0)
    }
  }

  /// ******* ////
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

      console.log(this.editFormComments.value,"FFFFFFFFf")
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


  // Init, recom, approver

  approvalType = 'Recommendation';
  approvalButton = 'Recommend';
  aTrial: any;
  openApprovalForm(gTrans, type, project='') {
    console.log(gTrans,"gTransgTransgTransgTrans")
    //return false;
    this.aTrial = gTrans;
    console.log(gTrans)
    //return false;
    this.approvalType = type == 1 ? 'Recommendation' : '';
    this.approvalButton = type == 1 ? 'Recommend' : 'Approve';
    //alert(project)
    // if(project=="p")
    // {

    //   // alert(gTrans.project.id)
    //   // return false;

    //  this.approvalForm.patchValue({ 
    //   transaction_id: gTrans.id, 
    //   approved_level: (gTrans.approved_level), 
    //   form_id: gTrans.form, 
    //   approved_role_id: this.api.userid.role_id, 
    //   type: type, 
    //   project_id:gTrans.project.id });


    // }else{

    //  this.approvalForm.patchValue({ 
    //   transaction_id: gTrans.id, 
    //   approved_level: (gTrans.approved_level), 
    //   form_id: gTrans.form, 
    //   approved_role_id: this.api.userid.role_id, 
    //   type: type});

    // }

   this.approvalForm.patchValue({ 
    transaction_id: gTrans.id, 
    approved_level: (gTrans.approved_level), 
    form_id: gTrans.form, 
    approved_role_id: this.api.userid.role_id, 
    type: type, 
    project_id:gTrans.project.id });

    openModal('#approval-modal');
    //this.trialPage = trial.trial_type;
  }


  openApprovalHistory(history = '') {
    // this.approvalHistory = history;
    openModal('#approval-history');
  }
  onApproval() {
    this.approvalForm.patchValue({ status: 1 });
    triggerClick('#approvalSubmit');
  }
  onReject() {
    this.approvalForm.patchValue({ status: 2 });
    triggerClick('#approvalSubmit');
  }
  onApprovalSubmit() {
    console.log('onApprovalSubmit', this.approvalForm.value);
    //return false;
    if (this.approvalForm.valid) {
      console.log(this.approvalForm.value);
     //return false;
      this.api.postAPI(environment.API_URL + "transaction/global/approval", this.approvalForm.value).subscribe((res) => {
        closeModal('#approval-modal');
        this.approvalForm.patchValue({ comments: '' });
        if (res.status == environment.SUCCESS_CODE) {
          this.notification.success(res.message);
          //this.getTrials();
          this.getListing();
        } else if (res.status == environment.ERROR_CODE) {
          this.notification.displayMessage(res.message);
        } else {
          this.notification.displayMessage(language[environment.DEFAULT_LANG].unableSubmit);
        }

      });
    }
  }

    onViewTemp() {
    closeModal('#approval-modal');
    //this.goToTrialForm1(this.trialPage);
  }


  systemClose(){
   closeModal('#system-modal');
   this.editFormSystem.reset();
  }

  equipmentClose(){
   closeModal('#equipment-modal');
   this.editFormEquipment.reset();
  }

  compartmentClose(){
   closeModal('#compartment-modal');
   this.editFormCompartment.reset();
  }


  checkValue()
  {
    console.log("this.forms",this.forms)
  }

  /// Test ///
fruit='';
  // checkValue1()
  // {
  //   console.log("this.fruit",this.fruit)
  // }

  value='';
  checkValue1()
  {
    //console.log("this.global_psr1",this.global_psr1)
    console.log("this.paragraphValue",this.value)
  }


fruits: any[] = [
    { name: 'Apple' },
    { name: 'Pear' }
]

    addNewInput() {
    this.myArray = [
      ...this.myArray,
      {
        id:3,
        name: 'Mango'
      }
    ];
  }


removeInput(id) {
  //alert(id)
    this.fruits = this.fruits.filter(item => item.id !== id);
    //this.addNewInput();
    console.log(this.fruits)
}
  /// Test ///

  myArray = [
    { id:1, name:'Hardik'},
    { id:2, name:'Paresh'},
    { id:3, name:'Rakesh'},
    { id:3, name:'Mahesh'},
  ];
  
  removeItems(obj){
     this.myArray = this.myArray.filter(item => item !== obj);
  }


  // System //

  system_equipment = [
    { 
      ser:'', 
      name:'', 
      capabilities_feature:'',
      weight_volume_power_consumption:'',
      location:'',
      interface:'',
      procurement_router:'',
      vendor:'',
      cost:'',
      standards:'',
      sustenance:''
    }
  ];

    addNewSystemEquipment(data) {
      alert(data)
    //this.system_equipment+'_'+data = [
      this.system_equipment = [
      ...this.system_equipment,
      {
        ser:'', 
        name:'', 
        capabilities_feature:'',
        weight_volume_power_consumption:'',
        location:'',
        interface:'',
        procurement_router:'',
        vendor:'',
        cost:'',
        standards:'',
        sustenance:''
      }
    ];
  }

  // removeItems(obj){
  //    this.myArray = this.myArray.filter(item => item !== obj);
  // }

  /// Tessss ////

  addMoreSystem2(a){
    console.log(a)
  }

  addElement() {


        let element = '<tr><td><div class="form-group"><input matInput name="s_ser" id="s_ser"></div></td>'
                      +'<td><div class="form-group"><mat-select placeholder="Select list"><mat-option [value]="1">One</mat-option><mat-option [value]="2">Two</mat-option><mat-option [value]="3">Three</mat-option></mat-select></div></td>'
                      +'<td><div class="form-group"><input matInput name="s_numbers" ib="s_numbers"></div></td>'
                      +'<td><div class="form-group"><input matInput name="s_location" ib="s_location"></div></td>'
                      +'<td><div class="form-group"><input matInput name="s_equipment" ib="s_equipment"></div></td>'
                      +'<td><div class="form-group"><input matInput name="s_features" ib="s_features"></div></td>'
                      +'<td><div class="form-group"><input matInput name="s_layout" ib="s_layout"></div></td>'
                      +'<td><div class="form-group"><input matInput name="s_special_requirements" ib="s_special_requirements"></div></td>'
                      +'<td><div class="form-group"><input matInput name="s_standards" ib="s_standards"></div></td>'
                      +'<td><div class="form-group"><input matInput name="s_special_requirements" ib="s_special_requirements"></div></td>'
                      +'<td><div class="form-group"><input matInput name="s_standards" ib="s_standards"></div></td>'
                      +'<td><div class="form-group"><input matInput name="s_standards" ib="s_standards"></div></td>'
                      +'<td></td></tr>'


    console.log(element,"JJJJJJJJJJ")
    const p = this.renderer.createElement('tr');
    p.innerHTML = element

    console.log(p.innerHTML,'EEEEEE')
      //setTimeout(() => {
        this.renderer.appendChild(this.div.nativeElement, p)
        //console.log(this.renderer.appendChild(this.div.nativeElement, p))
        //}, 1000);

    
  }

  addMoreSystem100(a){
    console.log(a)

    a = [
      { 
        ser:'', 
        name:'', 
        capabilities_feature:'',
        weight_volume_power_consumption:'',
        location:'',
        interface:'',
        procurement_router:'',
        vendor:'',
        cost:'',
        standards:'',
        sustenance:''
      }
    ];

  }

  itemsSystemChild:any
  parentFunction(data){
    this.itemsSystemChild = data;
    
    //console.log('from child',this.itemsSystemChild)
    //console.log('FFF Child',localStorage.getItem("userFormValues"));
    //console.log('ffffff',localStorage.getItem("studentsInfo"))
  }



  typeOf(value) {
  //return typeof value;
    let temp = '"'+value+'"'
    console.log(temp)
    return JSON.parse(temp)
}

  typeOf1(value) {

  return typeof value;
    //return JSON.parse(value)
}



  dropRecommender(event: CdkDragDrop<string[]>) {
    moveItemInFormArray(
      this.recommender,
      event.previousIndex,
      event.currentIndex
    );
  }

  dropApprover(event: CdkDragDrop<string[]>) {
    moveItemInFormArray(
      this.approver,
      event.previousIndex,
      event.currentIndex
    );
  }

  /////// *** Hierarchy *** ///////

  getforms() {
    this.api
    .getAPI(environment.API_URL + "transaction/all_forms?status=1&id="+this.PAGE_FORM_ID)
    .subscribe((res)=> {
      this.formsList = res.data;
    });
  }

  getUser(form) {
    let form_id = form.form
     this.api
    //.getAPI(environment.API_URL + "api/auth/users_hierarchy?status=1")
    .getAPI(environment.API_URL + "api/auth/users_hierarchy?form_id="+form_id)
    .subscribe((res) => {
      this.user_recommender = res.data.user_recommender;
      this.user_approver = res.data.user_approver;
    //   setTimeout(()=>{
    //   this.onApproverAdd()  
    // },2000)
      
      console.log('users123',this.user_recommender)
    });
  }


  public editHierarchy = this.formBuilder.group({
    id: new FormControl(""),
    project_id: new FormControl("", [Validators.required]),
    form_hierarchy: new FormControl("", [Validators.required]),
    recommender: this.formBuilder.array([]),
    approver: this.formBuilder.array([]),
  });

 clearHierarchyFormArray = (formArray: FormArray) => {
    while (formArray.length !== 0) {
      formArray.removeAt(0)
    }
  }


  hierarchy(form) {
    //this.form_id_hierarchy = user
    //console.log(form,"Form")
    //this.getRecommenderUser(form)
    this.getUser(form)
    this.populateHierarchy(form)
  }


  populateHierarchy(form) {

    let form_id = form.form
    let project_id = form.project.id

    //console.log(form_id,"Form_Id")
    //console.log(project_id,"project_id")
    //return false;

    this.api.displayLoading(true)
     this.api
     .getAPI(environment.API_URL + "transaction/get_project_level_hierarchy?form_id="+form_id+"&project_id="+project_id)
    .subscribe((res) => {
      this.api.displayLoading(false)
      //console.log(res.data,"GEET");

      let recommender_data = res.data.recommender;
      let approver_data = res.data.approver;

      //console.log(data,"Form level hierarachy")
      //this.showErrors=false;
      this.clearHierarchyFormArray(this.recommender);
      this.clearHierarchyFormArray(this.approver);
      this.editHierarchy.patchValue({form_hierarchy:form_id});
      this.editHierarchy.patchValue({project_id:project_id});
      // //this.editForm.patchValue({id:data.id,form:data.form,created_by:data.created_by,modified_by:this.api.userid.user_id,status:data.status});
      // //let data_access = data.formmapping.length
      // //console.log('fdsfd',data)

      // //setTimeout(()=>{
        if(recommender_data.length>0)
        {
          for(let i=0;i<recommender_data.length;i++)
          {
            this.addRecommender(recommender_data[i])                  
          }
        }
        if(approver_data.length>0)
        {
          for(let i=0;i<approver_data.length;i++)
          {
            this.addApprover(approver_data[i])                  
          }
        }
      // //},2000)

    });    
  }

  // Recommender //
  onRecommenderAdd()
  { 
    this.addRecommender();
  }

  get recommender() : FormArray {
    return this.editHierarchy.get("recommender") as FormArray
  }

  addRecommender(data='') {
     this.recommender.push(this.newRecommender(data));
  }

  newRecommender(data): FormGroup {
   return this.formBuilder.group({
      //recommender_level: new FormControl((data && data.recommender_level ? data.recommender_level : '')),
      recommender: new FormControl((data && data.recommender_id ? data.recommender_id : ''))
   });
  }

 removeRecommender(i:number){
    this.recommender.removeAt(i);
  }

  onSubmitHierarchy() {
    //console.log(this.editForm,'fdfsd')
    //this.showErrors=true;
    if (this.editHierarchy.valid) {
    /*console.log('this.editForm',this.editForm);
    console.log('this.roleForm',this.roleForm);*/

    // let data_access =this.roles().value

    // this.editForm.value.created_by = this.api.userid.user_id;
    //this.editForm.value.status = this.editForm.value.status==true ? 1 : 2;

    //console.log(this.editHierarchy,"editHierarchy")
    //return false;
    this.editHierarchy.value.status = 1;
    //console.log('cfcc',this.editRecommenderHierarchy.value)
    //return false;
    this.api.displayLoading(true)
      this.api
        .postAPI(
          environment.API_URL + "transaction/project_level_hierarchy_details",
          this.editHierarchy.value
        )
        .subscribe((res) => {

          this.api.displayLoading(false)
          if(res.status==environment.SUCCESS_CODE){
            this.notification.success(res.message);
            // this.api.displayLoading(true)
            // this.getprojectlist();
            // this.api.displayLoading(false)
            this.getListing();
            this.closebutton_hierarchy.nativeElement.click();
            
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


  // Approver ///

 // clearApproverFormArray = (formArray: FormArray) => {
 //    while (formArray.length !== 0) {
 //      formArray.removeAt(0)
 //    }
 //  }

  onApproverAdd()
  { 
    //console.log(this.approver.length,"this.approver.lenght")
    if(this.approver.length<1){
      this.addApprover();  
    }else{
      return false;
    }
  }

  get approver() : FormArray {
    return this.editHierarchy.get("approver") as FormArray
  }

  addApprover(data='') {
    //console.log(data,"GGGGGGGGGG")
     this.approver.push(this.newApprover(data));
  }

  newApprover(data): FormGroup {
   return this.formBuilder.group({
      //recommender_level: new FormControl((data && data.recommender_level ? data.recommender_level : '')),
      approver: new FormControl((data && data.approver_id ? data.approver_id : ''))
   });
  }

 removeApprover(i:number){
    this.approver.removeAt(i);
  }


  // onRecommenderLevel //

  onRecommenderLevel(data){
    console.log(data, 'Data')
    //return false;


    let transaction_id = data.id
    let form_id = data.form
    let project_id = data.project.id

    this.api.displayLoading(true)
      this.api
        .postAPI(
          environment.API_URL + "transaction/save_hierarchy_level",
          {
            transaction_id : transaction_id,
            form_id : form_id,
            project_id : project_id
          }
        )
        .subscribe((res) => {

          this.api.displayLoading(false)

          console.log(res,"resss")
          if(res.status==environment.SUCCESS_CODE){
            this.notification.success(res.message);
            // this.api.displayLoading(true)
            this.getListing();
            // this.api.displayLoading(false)
            //this.closebutton_hierarchy.nativeElement.click();
            
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



  // Tab ********** Tab //

  showApproved() {
    this.getTransactionApproved();
  }
  showPending() {
    this.getTransactionPending();
  }
  getTransactionApproved() {

    let searchString = 'approved_level=4';
    this.api.displayLoading(true)
    this.api
      .getAPI(environment.API_URL + "transaction/global/transactions?form_id="+this.PAGE_FORM_ID+'&'+this.param + searchString+'&order_type=desc')
      .subscribe((res) => {
        this.api.displayLoading(false)
        this.dataSourceApproved = new MatTableDataSource(res.data);
        this.dataListApproved = res.data;
        this.dataSourceApproved.paginator = this.paginationApproved;
        //console.log('this.dataSourceApproved', this.dataSourceApproved);
      });
  }
  getTransactionPending() {
    let searchString = 'approved_level=2';
    this.api.displayLoading(true)
    this.api
      .getAPI(environment.API_URL + "transaction/global/transactions?form_id="+this.PAGE_FORM_ID+'&'+this.param + searchString+'&order_type=desc')
      .subscribe((res) => {
         this.api.displayLoading(false)
        this.dataSourcePending = new MatTableDataSource(res.data);
        this.dataListPending = res.data;
        this.dataSourcePending.paginator = this.paginationPending;
        console.log(res.data)
      });
  }

}