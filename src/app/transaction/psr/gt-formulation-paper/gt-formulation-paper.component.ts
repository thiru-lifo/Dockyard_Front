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
  selector: 'app-gt-formulation-paper',
  templateUrl: './gt-formulation-paper.component.html',
  styleUrls: ['./gt-formulation-paper.component.scss']
})
export class GTFormulationPaperComponent implements OnInit {
  @ViewChild('localform')localform:HTMLFormElement;
  @ViewChild("gtID") gtID: ElementRef;
  @ViewChild("moduleID") moduleID: ElementRef;

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
  @ViewChild("closebutton_edit") closebutton_edit;

  @ViewChild("closebuttonproject") closebuttonproject;
  @ViewChild("closebuttonapproval") closebuttonapproval;
  @ViewChild("closebutton_email") closebutton_email;

  @ViewChild(FormGroupDirective) formGroupDirective: FormGroupDirective;
  @ViewChild("mySel") skillSel: MatSelect;




  currentDate = new Date();
  constructor(public api: ApiService, private notification : NotificationService,
    private dialog:MatDialog, private router : Router, private elementref : ElementRef,private logger:ConsoleService,public aroute: ActivatedRoute, 
    private formBuilder: FormBuilder) {
  }
  test:any;
  paragraphValue='';
  checkValue()
  {
    console.log("this.forms",this.forms)
    console.log("this.paragraphValue",this.paragraphValue)
  }

  paragraphValue1='';
  checkValue1()
  {
    console.log("this.global_psr1",this.global_psr1)
    console.log("this.paragraphValue",this.paragraphValue1)
  }

  paragraphValueMapping='';
  checkValueMapping()
  {
    console.log("this.initiation_form_mapping",this.initiation_form_mapping)
    console.log("this.paragraphValueMapping",this.paragraphValueMapping)
  }


  //initiation_form_mapping


  docForm!: FormGroup;
  items!: FormArray;

  public editForm = new FormGroup({
    id: new FormControl(""),
     section: new FormControl(""),
     sub_section: new FormControl(""),
     sub_sub_section: new FormControl(""),
     paragraph: new FormControl(""),
    // budgeted_cost_per_platform: new FormControl("",[Validators.required,Validators.maxLength(30)]),
    // standard: new FormControl("",[Validators.required]),
    // plan_for_manpower_induction: new FormControl("",[Validators.required]),
    // quantity: new FormControl("",[Validators.required,Validators.maxLength(5)]),
    // acquisition_method: new FormControl("",[Validators.required]),
    // remarks: new FormControl("",[Validators.required]),

    // accord_of_aon: new FormControl("",[Validators.required]),
    // conclusion_of_contract: new FormControl("moment().format('MM/DD/yyyy')"),
    // induction: new FormControl("",[Validators.required]),
  });


  primaryRole: any
  secondaryRole: any
  onPrimaryRoles()
  {
    console.log('this.editForm',this.editForm);
  }
  populate(data) {

    //console.log('data',data);
    openModal('#crud-countries-edit');
    this.global_psr1 = data['sub_module'][1]['section']


    //alert(typeof(this.castArray(data.primary_role)))
    //alert(JSON.parse(data.primary_role))
    //this.primaryRole = JSON.parse(data.primary_role);
    //this.secondaryRole = JSON.parse(data.secondary_role);
    // let primary_roles = data.primary_role.map(function(a){return a['id'];});
    // let secondary_roles = data.secondary_role.map(function(a){return a['id'];});
    // console.log('sec',primary_roles)
    // console.log(data,"data");
    // this.editForm.patchValue(data);
    // this.editForm.patchValue({project: data.project.id});
    // this.editForm.patchValue({secondary_role:secondary_roles});
    // this.editForm.patchValue({standard: data.standard.id});
    // this.editForm.patchValue({plan_for_manpower_induction: data.plan_for_manpower_induction.id});
    // this.editForm.patchValue({acquisition_method: data.acquisition_method.id});
    // this.editForm.patchValue({primary_role:primary_roles});
    // this.editForm.patchValue({budgeted_cost_per_platform: data.budgeted_cost_per_platform});
    // this.editForm.patchValue({quantity:data.quantity});
    // this.editForm.patchValue({remarks:data.remarks});




    // //this.primaryRole = ['1','3'];

    // this.logger.info(data.status)
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
// ProjectError = (controlName: string, errorName: string) => {
//     return this.editFormProject.controls[controlName]?this.editFormProject.controls[controlName].hasError(errorName):false;
//   };

  isEquipment=true;
  isBoiler=false;
  modeSelect:any;


  ngOnInit(): void {

   this.getListing();
   this.getGlobalStatus();
   this.getAccess();
   //var element = <HTMLInputElement>document.getElementById("exampleCheck1");
   //element.checked = true;``

  }


  //let role_primary_low_intensity_maritime_operations='';

  // role_primary_low_intensity_maritime_operations:any;
  // role_primary_seaward_defence_of_the_coast:any;
  // role_primary_surveillance_and_patrol:any;
  // role_primary_search_and_rescue_sar_operation_close_to_coast:any;
  

  // internalMapping1(project_id=''){

  //   var para = '?sub_module_id=1&';
  //   para += 'section_id=2&';
  //   para += 'sub_section_id=2&';
  //   //para += 'sub_sub_section_id=null&';
  //   para += 'project_id='+project_id;

  //   this.api
  //   .getAPI(environment.API_URL + "transaction/gt_internal_mapping"+para)
  //     .subscribe((res) => {

  //       this.logger.log('gt_internal_mapping',res.data)
  //       this.role_primary_low_intensity_maritime_operations = res.data[1]['paragraph'];
  //       this.role_primary_seaward_defence_of_the_coast = res.data[2]['paragraph'];
  //       this.role_primary_surveillance_and_patrol = res.data[3]['paragraph'];
  //       this.role_primary_search_and_rescue_sar_operation_close_to_coast = res.data[4]['paragraph'];
  //     });

  // }
forms:any;
  internalMapping(project_id=''){

    
    if(project_id!=""){
      this.api.displayLoading(true)
    this.api
    //.getAPI(environment.API_URL + "transaction/global_transaction_edit_1?module_id=1&sub_module_id=1&project_id="+project_id)
    .postAPI(environment.API_URL + "transaction/forms-template",{"module_id":1,"form_id":2,"project_id":project_id})
      .subscribe((res) => {
        this.api.displayLoading(false)
        // this.logger.log('gt_internal_mapping',res.data)
        // this.initiation_form_mapping = res.data[0]['sub_module'][0]['section'];
        // console.log(this.initiation_form_mapping,"HHHHHHHHHH")
        this.forms = res.data;
        console.log(this.forms)
      });
    }

  }





  public FinalArray = [];
  projects=[];

getProject(code) {
  this.api
    .getAPI(environment.API_URL + "transaction/global_transaction_edit_1?approved_status=2&sub_module_id=1")
    .subscribe((res) => {
      //console.log('dff',res.data[0].project)
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
      this.FinalArray.push(res.data[i].project);
  }
}
}
else if(code=="edit"||code=="view") {
  this.FinalArray = res.data;
}
console.log(this.FinalArray,'dsdd');


  });
}




  getListing() {
    this.api
    .getAPI(environment.API_URL + "transaction/global_transaction_edit_1?form_id=2")
      .subscribe((res) => {

        //console.log(res.data,"jjjjjjjjj")
        this.dataSourcePending = new MatTableDataSource(res.data);
        //this.initiationList = res.data;
        this.dataListPending = res.data;
        //console.log(this.dataListPending[0][],"@@@@@@@@")
        console.log(this.dataListPending.length,"Lenght")
        this.FinalArray=[];
        this.getProject;
        this.dataSourcePending.paginator = this.paginationPending;
        this.logger.log('global_transaction_edit_1',res.data)
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


    //this.genInitiationTemplate();

    let reset = this.formGroupDirective.resetForm();
    if(reset!==null) {
      this.initForm();
    }
    // var element = <HTMLInputElement>document.getElementById("");
    // element.checked = true;

    // this.items = this.docForm.get('items') as FormArray;
    //this.clearFormArray(this.items);
    /*this.items.push(this.formBuilder.group({
        section:'',
        sub_section:'',
        sub_sub_section:'',

    }));*/

  }


  editt:any;
  pro:any;
  proid:any;
  editOption(initiation) {
    this.pro=true;
    this.isReadonly=false;

    // this.editForm.enable();

    //this.editForm.project.disable();
    this.crudName = "Submit";
    this.editt=initiation.project.name;
    this.proid=initiation.project.id;
     this.getProject("edit");
    this.global_psr1 = initiation['sub_module'][1]['section']
    // console.log("wwww", initiation);
    // console.log("AAAA", this.global_psr1);
    // console.log("id", initiation.id);
    // console.log("module", initiation.module.id);


    this.gtID.nativeElement.value = initiation.id
    this.moduleID.nativeElement.value = initiation.module.id

    //alert(this.proid)
    this.internalMapping(this.proid);
  }



  viewTrial:any;
  onView(initiation) {

    this.pro=true;
    this.proid=initiation.project.id;
    this.editt=initiation.project.name;

    this.crudName = 'View';
    this.viewTrial=initiation;
    this.getProject("view");
    this.isReadonly=true;
    this.editForm.disable();
    this.populate(initiation);
    this.editorConfig.editable= false;

  }


  onDelete(data) {

    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: language[environment.DEFAULT_LANG].confirmMessage
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.api.postAPI(environment.API_URL + "transaction/global_transaction_details_delete", {
          id: data.id,
          status: 3,
          project: data.project.id,
          created_by : this.api.userid.user_id,
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


  
  public editFormApproval = new FormGroup({
    id: new FormControl("", [Validators.required]),
    project: new FormControl("", [Validators.required]),
    approved_status: new FormControl("", [Validators.required]),
    approved_by_name: new FormControl(""),
    approved_by: new FormControl("",[Validators.required]),
    approved_on: new FormControl("",[Validators.required]),
    approved_remark: new FormControl("",[Validators.required]),
  });

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
          this.notification.warn('PSR Formulation Approval Updated');
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

  Approvalclose(){
   this.editFormApproval.reset();
  }


  approval(initiation) {

    this.editorConfig.editable= true;
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


  global_statuses:any;
  getGlobalStatus() {
    this.api
      .getAPI(environment.API_URL + "master/status?status=1")
      .subscribe((res) => {
        this.global_statuses = res.data;
      });
  }
 projecid:any;
  onSubmit(type='') {

    var url;
    if(type=="add"){
      this.transaction = this.forms;
      this.projecid = this.project_id;
      url = 'global_transaction_details';

    }else{
      this.transaction = this.global_psr1;
      this.projecid = this.proid;
      url = 'global_transaction_details_edit';
    }

    console.log(this.transaction, url)
    //return false;
     //if (this.editForm.valid) {
     if (this.projecid!=null) { 
     console.log(this.projecid,"projectID")
      console.log(this.approach_paper_form,"YYYYYYYYYy")
      this.api
        .postAPI(
          environment.API_URL + "transaction/"+url,
          {
            id:Number(this.gtID.nativeElement.value),
            module:1,
            sub_module:2,
            created_by:this.api.userid.user_id,
            project_id: Number(this.projecid),
            psr:this.transaction,
            sub_module_mapping:1,
            mapping: this.initiation_form_mapping,

          }
        )
        .subscribe((res) => {
          this.logger.log('response',res);
          //alert(res.status)
          //this.error= res.status;
          if(res.status==environment.SUCCESS_CODE){
            // this.logger.log('Formvalue',this.editForm.value);
            this.notification.success(res.message);
            closeModal('#crud-countries');
            closeModal('crud-countries-edit');
            this.getListing();
            if(type=="add"){
            
            }else if(type=="edit"){
              this.closebutton_edit.nativeElement.click();
              
            }
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
    
    this.pro=true;

  }

  // number input only
numberOnly(event:any): boolean {
  const charCode = (event.which) ? event.which : event.keyCode;
  if (charCode > 31 && (charCode < 48 || charCode > 57)) {
    return false;
  }
  return true;

}


  project_id:any;
  transaction:any
  //url:any;
  global_psr: any;
  global_psr1: any;
  initiation_form_mapping: any;
  approach_paper_form: any;
  input_sr:any;
  concept_design:any;
  incorporation:any;
  rfi:any;
  genInitiationTemplate() {
    this.getProject("add");
    // this.api
    //   .getAPI(environment.API_URL + "master/generate_psr_template")
    //   .subscribe((res) => {
    //     this.global_psr = res.data;
    //     console.log(this.global_psr,"GGGGGGGGGGGGGgg");
    //     //this.initiation_form = res.data[0]['section'];
    //     this.approach_paper_form = res.data[1]['section'];
       
    //   });
   }
   changeProject(value) {
    //console.log(value);
    this.project_id = value;

    this.internalMapping(value)
  }



  genRandom(){
    return Math.round(Math.random() * 10000);
  }

}



