import { Component, OnInit, ViewChild, Input, ElementRef } from '@angular/core';
import { ApiService } from "src/app/service/api.service";
import { environment } from "src/environments/environment";
import { FormGroup, FormControl, Validators, FormGroupDirective, FormArray } from "@angular/forms";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { NotificationService } from "src/app/service/notification.service";
import { ConfirmationDialogComponent } from "src/app/confirmation-dialog/confirmation-dialog.component";
import { MatDialog } from "@angular/material/dialog";
import { language } from "src/environments/language";
import { Router, ActivatedRoute } from '@angular/router';
import { ConsoleService } from "src/app/service/console.service";
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { of } from 'rxjs';
import { formatDate } from '@angular/common';
declare var moment: any;
declare function openModal(selector): any;
declare function closeModal(selector): any;
declare function formSubmit(selector): any;
declare function triggerClick(selector): any;

export interface PeriodicElement {
  name: string;
  //position: number;
  remarks: string;
  actions: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { name: 'test', remarks: 'test', actions: 'test' },
  { name: 'test', remarks: 'test', actions: 'test' },
  { name: 'test', remarks: 'test', actions: 'test' },
  { name: 'test', remarks: 'test', actions: 'test' },
];


@Component({
  selector: 'app-initiation',
  templateUrl: './initiation.component.html',
  styleUrls: ['./initiation.component.scss']
})
export class InitiationComponent implements OnInit {
  startDate:any;
  closeDate:any;
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
      { class: 'arial', name: 'Arial' },
      { class: 'times-new-roman', name: 'Times New Roman' },
      { class: 'calibri', name: 'Calibri' },
      { class: 'comic-sans-ms', name: 'Comic Sans MS' }
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
      ['fontSize', 'toggleEditorMode', 'customClasses']
    ]
  };

  editorConfig2: AngularEditorConfig = {
    editable: false,
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

  country: any;
  public crudName = "Add";
  public countryList = [];
  public dataListApproved = [];
  public dataListPending = [];
  public documentList = [];
  filterValue: any;
  isReadonly = false;
  moduleAccess: any;
  ErrorMsg: any;
  error_msg = false;
  moment = moment;
  showError=false;

  public permission = {
    add: false,
    edit: false,
    view: false,
    delete: false,
    recommend: false,
    approve: false,
    print: false,
  };

  @ViewChild(MatPaginator) pagination: MatPaginator;
  @ViewChild('paginationApproved') paginationApproved: MatPaginator;
  @ViewChild('paginationPending') paginationPending: MatPaginator;
  @ViewChild("closebutton") closebutton;
  @ViewChild(FormGroupDirective) formGroupDirective: FormGroupDirective;

  @ViewChild("closebuttonapproved") closebuttonapproved;
  @ViewChild("closebuttonemail") closebuttonemail;
  @ViewChild("localform") localform:HTMLFormElement

  constructor(public api: ApiService, private notification: NotificationService,
    private dialog: MatDialog, private router: Router, private elementref: ElementRef, private logger: ConsoleService, public aroute: ActivatedRoute) {
  }


  public editForm = new FormGroup({
    id: new FormControl(""),
    project: new FormControl("", [Validators.required]),
    type_name: new FormControl("",[Validators.required]),
    sections1: new FormArray([])
  });


  newSection(section:any): FormGroup {
    console.log('section',section);
    return new FormGroup({
      document_sections: new FormControl((section.document_sections?(typeof(section.document_sections)=='object'?section.document_sections.id:section.document_sections):''),[Validators.required]),
      document_sub_sections: new FormControl((section.document_sub_sections?(typeof(section.document_sub_sections)=='object'?section.document_sub_sections.id:section.document_sub_sections):''),[Validators.required]),
      document_sub_sections2: new FormControl((section.document_sub_sections2?(typeof(section.document_sub_sections)=='object'?section.document_sub_sections2.id:section.document_sub_sections2):'')),
      paragraph_title: new FormControl((section.paragraph_title?section.paragraph_title:''),[Validators.required]),
      paragraph: new FormControl((section.paragraph?section.paragraph:''),[Validators.required]),
      primary: new FormControl((section.primary?section.primary:''),[Validators.required]),
      secondary1: new FormControl((section.secondary1?section.secondary1:''),[Validators.required]),
      secondary2: new FormControl((section.secondary2?section.secondary2:''),[Validators.required]),
      secondary3: new FormControl((section.secondary3?section.secondary3:''),[Validators.required]),
    });
  }

  sections(): FormArray {
    return this.editForm.get("sections1") as FormArray
  }
  clearSections()
  {
    this.editForm = new FormGroup({
      id: new FormControl(""),
      project: new FormControl("", [Validators.required]),
      type_name: new FormControl("",[Validators.required]),
      sections1: new FormArray([])
    });
  }
  addSection(section='') {
    this.sections().push(this.newSection(section));
  }

  removeSection(sectionIndex:number) {
    this.sections().removeAt(sectionIndex);
  }


  // glsList:any;
  // onProjectHandler(project_id=''){
  //   //alert(project_id)

  //       this.api
  //       .getAPI(environment.API_URL + "transaction/ssr_list?project_id="+project_id+"")
  //       .subscribe((res) => {
  //         this.SSRValues = res.data_ssr;
  //           this.api.getAPI(environment.API_URL + "transaction/bls/get_gls_initiation_notes?project_id="+project_id+"")
  //               .subscribe((res) => {
  //                 this.glsList = res.data;
  //                 //this.clearSections();
  //                 for(let k=0;k<this.glsList.length;k++)
  //                 {
  //                   let loadData={document_sections:this.glsList[k].document_sections,document_sub_sections:this.glsList[k].document_sub_sections,document_sub_sections2:this.glsList[k].document_sub_sections2,paragraph:this.glsList[k].paragraph,paragraph_title:this.glsList[k].paragraph_title,primary:this.glsList[k].primary,secondary1:this.glsList[k].secondary1,secondary2:this.glsList[k].secondary2,secondary3:this.glsList[k].secondary3};
  //                   this.addSection(this.glsList[k]);
  //                 }
  //                 console.log('this.glsList',this.glsList);
  //           });
  //       });


  //           setTimeout(() => {
            
  //           }, 5000);

    
  //       console.log(this.SSRValues,"SSRR++++88888888")
  //       console.log(this.glsList,"GLS++++88888888")

  // }

generalRef="";
  completeGLS='';
  glsList:any;
  onProjectHandler(project_id=''){
      if(project_id!=""){
        this.getReponsibilitySections(project_id);
          this.api
            .getAPI(environment.API_URL + "transaction/get_complete_psr?project_id="+project_id)
            .subscribe((res) => {
              this.completeGLS = res.data;
            });
          this.api.getAPI(environment.API_URL + "transaction/bls/get_gls_initiation_notes?project_id="+project_id+"").subscribe((res) => {
                this.glsList = res.data;
                this.clearSections();
                for(let k=0;k<this.glsList.length;k++)
                {
                  let loadData={document_sections:this.glsList[k].document_sections,document_sub_sections:this.glsList[k].document_sub_sections,document_sub_sections2:this.glsList[k].document_sub_sections2,paragraph:this.glsList[k].paragraph,paragraph_title:this.glsList[k].paragraph_title,primary:this.glsList[k].primary,secondary1:this.glsList[k].secondary1,secondary2:this.glsList[k].secondary2,secondary3:this.glsList[k].secondary3};
                  this.addSection(this.glsList[k]);
                }
                console.log('this.glsList',this.glsList);
                
                this.editForm.patchValue({project:this.glsList[0]['project'],type_name:(this.glsList[0]['type_name']).toString()});
          });


      }

      // Ref for Input Sr General
      this.api
        .getAPI(environment.API_URL + "transaction/get_section_general?project_id="+project_id)
        .subscribe((res) => {


          console.log(res,"RRRRRRRRRRR")
          this.generalRef = res.data['general_section'];
          this.crudForm.patchValue({
            roles : this.generalRef['roles'],
            critical_design_drivers : this.generalRef['critical_design_drivers'],
            operating_philosophy : this.generalRef['operating_philosophy'],
            area_of_operations : this.generalRef['area_of_operations'],
            rules_and_regulations : this.generalRef['rules_and_regulations'],
            general_remarks : this.generalRef['general_remarks'],
            displacement : this.generalRef['displacement'],

            dimensions : this.generalRef['dimensions'],
            speed : this.generalRef['speed'],
            endurance_and_range : this.generalRef['endurance_and_range'],
            sea_worthiness : this.generalRef['sea_worthiness'],
            propulsion : this.generalRef['propulsion'],
            operating_conditions : this.generalRef['operating_conditions'],
            design_and_construction_standards : this.generalRef['design_and_construction_standards'],

            stealth : this.generalRef['stealth'],
            ergonomics : this.generalRef['ergonomics'],
            complement : this.generalRef['complement'],
            cots_technology : this.generalRef['cots_technology'],
            protection : this.generalRef['protection'],
            unrep : this.generalRef['unrep'],
            boats_and_usvs : this.generalRef['boats_and_usvs'],

            noise_reduction : this.generalRef['noise_reduction'],
            op_logistic_management_information_system : this.generalRef['op_logistic_management_information_system'],
            ipms : this.generalRef['ipms'],
            surveillance_and_security_arrangement : this.generalRef['surveillance_and_security_arrangement'],
            cim : this.generalRef['cim'],
            green_warship : this.generalRef['green_warship'],
            construction : this.generalRef['construction'],

            automation_and_redundancy : this.generalRef['automation_and_redundancy'],
            workshops : this.generalRef['workshops'],
          })
        });

        console.log(this.generalRef,"generalRef@@@@@@")
  }

  viewList:any;
  vProject:any;
  vTypeName:any;
  
  SSRValues=[];
  populate(data) {
    console.log('data',data);
    this.clearSections();
    
    this.viewList = data.details;
    this.completeGLS='';
    this.onProjectHandler(data.project.id);
    setTimeout(()=>{
      this.editForm.patchValue({project:data.project.id,type_name:(data.type_name).toString()});
    },1000);
    /*for(let k=0;k<data.details.length;k++)
    {
      this.addSection(data.details[k]);
    }*/

    openModal('#crud-countries-add');

    
  }

  initForm() {
    this.editForm.patchValue({
      status: "1",
    });
  }

  formdoc(){
    this.editFormDocument.patchValue({
      status: "1",
    })
  }

  selectedTrial: any;
  openCurrentStatus(trial) {
    this.selectedTrial = trial;
    openModal('#trial-status-modal');
  }


  Error = (controlName: string, errorName: string) => {
    return this.editForm.controls[controlName] ? this.editForm.controls[controlName].hasError(errorName) : false;
  };


  isEquipment = true;
  isBoiler = false;
FileUrl:any;
  roleForm!: FormGroup;
  sectionsForm!: FormGroup;
  ngOnInit(): void {
    this.sectionsForm = new FormGroup({
      sections: new FormArray([])
    });

    this.getListing();
    this.getProject;
    this.getDocumentSections();
    this.getDocumentSubSections();
    this.getDocumentSubSections2();
    this.getUnits();
    this.getGlobalStatus();

    var File = environment.API_URL;
    this.FileUrl = File.substring(0,File.length-1);
  }

  

  isRequiredField(obj,controlName)
  {
    return obj.controls[controlName].hasError('required');
  }

  

  selectedSections=[];
  
  


  global_statuses: any;
  getGlobalStatus() {
    this.api
      .getAPI(environment.API_URL + "master/status?status=1")
      .subscribe((res) => {
        this.global_statuses = res.data;
      });
  }

  getListing() {
    this.api
      .getAPI(environment.API_URL + "transaction/bls/initiation_notes_master")
      .subscribe((res) => {
        // this.dataSource = new MatTableDataSource(res.data);
        // this.countryList = res.data;
        // this.dataSource.paginator = this.pagination;
        // this.logger.log('country',this.countryList)

        this.dataSourcePending = new MatTableDataSource(res.data);
        this.dataListPending = res.data;
        this.getProject;
        this.dataSourcePending.paginator = this.paginationPending;
        this.logger.log('country', this.dataListPending)
      });
  }

  getListing1() {
    let userDet = { first_name: "Manivannan", last_name: "VC" };
    let sampleData = [{ project_name: "Test Project", primary_role: "Seaward defense of the coast", numof_section: "2", numof_annexure: "3", secondary_role: "Maritime Interdiction Operations", budget: 500000, manpower_induction: "ACCRETION", quantity: 5, acquisition_method: "SECTION B", remarks: 'test', requested_by: userDet, created_on: new Date(), standard: "Naval" }];
    this.dataSourcePending = new MatTableDataSource(sampleData);
    this.dataListPending = sampleData;
    this.dataSourcePending.paginator = this.paginationPending;
  }

  units: any;
  getUnits() {
    this.api
      .getAPI(environment.API_URL + "master/unit?status=1")
      .subscribe((res) => {
        this.units = res.data;
      });
  }

  

  projects: any;

  

public FinalArray = [];
getProject(code) {
    this.api
      .getAPI(environment.API_URL + "transaction/gls/initiation/global_master")
      .subscribe((res) => {
        console.log('dff',res.data[0].project__id)
  if(code=="add"){
    console.log('dffadd')
  for (var i = 0; i < res.data.length; ++i) {
     res.data[i].project__id;
    var found = false;

    for (var j = 0; j < this.dataListPending.length; ++j) {
        if (this.dataListPending[j].project.id == res.data[i].project__id) {
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
    let filter='?status=1';
    filter+=document_sections_id?'&document_sections_id='+document_sections_id:'';
    this.api
      .getAPI(environment.API_URL + "transaction/gls/document_sub_sections"+filter)
      .subscribe((res) => {
        this.documentSubSections = res.data;
      });
  }

  documentSubSections2:any;
  getDocumentSubSections2(document_sections_id='',document_sub_sections_id='') {
    let filter='?status=1';
    filter+=document_sections_id?'&document_sections_id='+document_sections_id:'';
    filter+=document_sub_sections_id?'&document_sub_sections_id='+document_sub_sections_id:'';
    this.api
      .getAPI(environment.API_URL + "transaction/gls/document_sub_sections2"+filter)
      .subscribe((res) => {
        this.documentSubSections2 = res.data;
      });
  }

  applyFilterPending(event: Event) {
    this.filterValue = (event.target as HTMLInputElement).value;
    if (this.filterValue) {
      this.dataSourcePending.filter = this.filterValue.trim().toLowerCase();
    } else {
      this.getListing();
    }
  }

  create() {
    this.crudName = "Initiate";
    this.isReadonly = false;
    this.editForm.enable();
    let reset = this.formGroupDirective.resetForm();
    if (reset !== null) {
      this.initForm();
    }
    // var element = <HTMLInputElement>document.getElementById("exampleCheck1");
    // element.checked = true;
  }

  pro=false;
  editOption(country) {
    this.isReadonly=false;
    this.editForm.enable();
    this.getProject("edit");
    this.pro=true;
    this.crudName = "Submit";
   
    this.logger.info(country);
    this.populate(country);
    this.editForm.controls['project'].disable();
    
  }
  viewTrial: any;
  onView(country) {
    this.crudName = 'View';
    this.editorConfig.editable=false;
    this.viewTrial = country;
    this.isReadonly = true;
    this.editForm.disable();
    this.populate(country);

  }


  public editFormApproval = new FormGroup({
    id: new FormControl("", [Validators.required]),
    project: new FormControl("", [Validators.required]),
    approved_status: new FormControl("", [Validators.required]),
    approved_by_name: new FormControl(""),
    approved_by: new FormControl("", [Validators.required]),
    approved_on: new FormControl("", [Validators.required]),
    approved_remark: new FormControl("", [Validators.required]),
  });

  approval(initiation) {

    this.editFormApproval.patchValue({
      id: initiation.id,
      project: initiation.project.id,
      approved_status: initiation.approved_status,
      approved_by_name: initiation.created_by.first_name + ' ' + initiation.created_by.last_name,
      approved_by: initiation.created_by.id,
      approved_remark: initiation.approved_remark,
      approved_on: formatDate(new Date(), 'yyyy-MM-dd', 'en')
    });

  }

  onSubmitApproval() {
    console.log(this.editFormApproval,"####22222222")
    if (this.editFormApproval.valid) {
      this.editFormApproval.value.created_by = this.api.userid.user_id;
      this.api
        .postAPI(
          environment.API_URL + "transaction/bls/initiation_notes/master_crud",
          this.editFormApproval.value
        )
        .subscribe((res) => {
          this.logger.log('response', res);
          if (res.status == environment.SUCCESS_CODE) {
            this.notification.success(res.message);
            this.notification.warn('BLS Initiation Approval Updated');
            this.getListing();
            this.closebuttonapproved.nativeElement.click();
            //res.data['type']='edit';
          } else if (res.status == environment.ERROR_CODE) {
            this.error_msg = true;
            this.ErrorMsg = res.message;
            setTimeout(() => {
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
      if (result) {
        this.api.postAPI(environment.API_URL + "transaction/bls/initiation_notes/crud/delete", {
          id: id,
          status: 3,
        }).subscribe((res) => {
          this.logger.log('response', res);
          if (res.status == environment.SUCCESS_CODE) {
            this.logger.info('delete')
            this.notification.warn('BLS Initiation Notes ' + language[environment.DEFAULT_LANG].deleteMsg);
            this.getListing();
          } else {
            this.notification.displayMessage(language[environment.DEFAULT_LANG].unableDelete);
          }
        });
      }
      dialogRef = null;
    });
  }


  


  onSubmit() {
    this.showError=true;
    console.log("#######", this.editForm);
    //return false;
    if (this.editForm.valid) {
      this.editForm.value.created_by = this.api.userid.user_id;
      this.editForm.value.status = this.editForm.value.status == true ? 1 : 2;
      this.api
        .postAPI(
          environment.API_URL + "transaction/bls/initiation_notes/crud",
          this.editForm.value
        )
        .subscribe((res) => {
          this.logger.log('response', res);
          //this.error= res.status;
          if (res.status == environment.SUCCESS_CODE) {
            // this.logger.log('Formvalue',this.editForm.value);
            this.notification.success(res.message);
            this.closebutton.nativeElement.click();
            this.getListing();
            //res.data['type']='edit';
            //localStorage.setItem('trial_form',this.api.encryptData(res.data));
          } else if (res.status == environment.ERROR_CODE) {
            this.error_msg = true;
            this.ErrorMsg = res.message;
            setTimeout(() => {
              this.error_msg = false;
            }, 2000);
          } else {
            this.notification.displayMessage(language[environment.DEFAULT_LANG].unableSubmit);
          }

        });
    }
  }

  public editFormImport = new FormGroup({
    file_name: new FormControl("", [Validators.required]),
    project: new FormControl("", [Validators.required]),
    start_date: new FormControl("", [Validators.required]),
    close_date: new FormControl("", [Validators.required]),
    type_name: new FormControl("", [Validators.required]),
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

  onSubmitImport() {
    //alert(this.api.userid.user_id)

    let start_date = moment(this.editFormImport.value.start_date, "MM/DD/YYYY").format('YYYY-MM-DD');
    let close_date = moment(this.editFormImport.value.close_date, "MM/DD/YYYY").format('YYYY-MM-DD');
    const formData = new FormData();
    formData.append('excel_file_upload', this.fileToUpload);
    formData.append('project', this.editFormImport.value.project);
    // formData.append('start_date', this.editFormImport.value.start_date);
    // formData.append('close_date', this.editFormImport.value.close_date);
    formData.append('start_date', start_date);
    formData.append('close_date', close_date);
    formData.append('type_name', this.editFormImport.value.type_name);
    formData.append('created_by', this.api.userid.user_id);
    this.api
      .postAPI(
        environment.API_URL + "transaction/bls/excel",
        formData
      )
      .subscribe((res) => {
        this.logger.log('response', res);
        //alert(res.status)
        //this.error= res.status;
        if (res.status == environment.SUCCESS_CODE) {
          // this.logger.log('Formvalue',this.editForm.value);
          this.clearEditFormImport()
          this.notification.success(res.message);

          this.closebutton.nativeElement.click();
          this.getListing();
          //res.data['type']='edit';

          //localStorage.setItem('trial_form',this.api.encryptData(res.data));
        } else if (res.status == environment.ERROR_CODE) {
          this.error_msg = true;
          this.ErrorMsg = res.message;
          setTimeout(() => {
            this.error_msg = false;
          }, 2000);
        } else {
          this.notification.displayMessage(language[environment.DEFAULT_LANG].unableSubmit);
        }

      });
  }


  fileToUpload: File | null = null;
  onFileHandler(event) {
    console.log(event, event.target.files[0])
    if (event.target.files.length > 0) {
      this.fileToUpload = event.target.files[0];
      // console.log("ghjgjhri",file);
      // this.form.patchValue({files:file});
    };

  }

  trialPage: any;
  getAccess() {
    this.moduleAccess = this.api.getPageAction();
    if (this.moduleAccess) {
      let addPermission = (this.moduleAccess).filter(function (access) { if (access.code == 'INI') return access.status; }).map(function (obj) { return obj.status; });
      let editPermission = (this.moduleAccess).filter(function (access) { if (access.code == 'EDIT') { return access.status; } }).map(function (obj) { return obj.status; });
      let viewPermission = (this.moduleAccess).filter(function (access) { if (access.code == 'VIW') { return access.status; } }).map(function (obj) { return obj.status; });
      let deletePermission = (this.moduleAccess).filter(function (access) { if (access.code == 'DEL') { return access.status; } }).map(function (obj) { return obj.status; });
      let recommendPermission = (this.moduleAccess).filter(function (access) { if (access.code == 'REC') { return access.status; } }).map(function (obj) { return obj.status; });
      let approvePermission = (this.moduleAccess).filter(function (access) { if (access.code == 'APR') { return access.status; } }).map(function (obj) { return obj.status; });
      let printPermission = (this.moduleAccess).filter(function (access) { if (access.code == 'PRI') { return access.status; } }).map(function (obj) { return obj.status; });
      this.permission.add = addPermission.length > 0 ? addPermission[0] : false;
      this.permission.edit = editPermission.length > 0 ? editPermission[0] : false;
      this.permission.view = viewPermission.length > 0 ? viewPermission[0] : false;
      this.permission.delete = deletePermission.length > 0 ? deletePermission[0] : false;
      this.permission.recommend = recommendPermission.length > 0 ? recommendPermission[0] : false;
      this.permission.approve = approvePermission.length > 0 ? approvePermission[0] : false;
      this.permission.print = printPermission.length > 0 ? printPermission[0] : false;
    }

    this.logger.log('this.permission', this.permission);
  }

  disableDate(){
    return false;
  }

  public crudForm = new FormGroup({
    id: new FormControl(""),
    project_id: new FormControl("",[Validators.required]),


    roles: new FormControl(""),
      critical_design_drivers: new FormControl(""),
      operating_philosophy: new FormControl(""),
      area_of_operations: new FormControl(""),
      rules_and_regulations: new FormControl(""),
      general_remarks: new FormControl(""),
      displacement: new FormControl(""),
      dimensions: new FormControl(""),
      speed: new FormControl(""),
      endurance_and_range: new FormControl(""),
      sea_worthiness: new FormControl(""),
      propulsion: new FormControl(""),
      operating_conditions: new FormControl(""),
      design_and_construction_standards: new FormControl(""),
      stealth: new FormControl(""),
      ergonomics: new FormControl(""),
      complement: new FormControl(""),
      cots_technology: new FormControl(""),
      protection: new FormControl(""),
      unrep: new FormControl(""),
      boats_and_usvs: new FormControl(""),
      noise_reduction: new FormControl(""),
      op_logistic_management_information_system: new FormControl(""),
      ipms: new FormControl(""),
      surveillance_and_security_arrangement: new FormControl(""),
      cim: new FormControl(""),
      green_warship: new FormControl(""),
      construction: new FormControl(""),
      automation_and_redundancy: new FormControl(""),
      workshops: new FormControl(""),


    sections: new FormArray([])
  });
  sectionList=[];
  getReponsibilitySections(project_id)
  {
    this.api.postAPI(environment.API_URL + "transaction/get_responsibility_section",{project_id:project_id}).subscribe((res) => {
        let sections=res.sections;
        for(let i=0;i<sections.length;i++)
        {
          this.addSectionPsr(sections[i]);
          for(let j=0;j<sections[i].units.length;j++)
          {
            this.addSectionUnit(i,sections[i].units[j].unit)
            for(let x=0;x<sections[i].units[j].compartments.length;x++)
            {
              this.addCompartment(i,j,{compartment_id:sections[i].units[j].compartments[x].id,compartment_name:sections[i].units[j].compartments[x].name});
              if(sections[i].units[j].compartments[x].compartments.length>0)
              {
                for(let y=0;y<sections[i].units[j].compartments[x].compartments.length;y++)
                  this.addSpecificCompartments(i,j,x,sections[i].units[j].compartments[x].compartments[y]);
              }
              else
                this.addSpecificCompartments(i,j,x,'');
            }
            for(let x=0;x<sections[i].units[j].equipments.length;x++)
            {
              this.addEquipment(i,j,{equipment_id:sections[i].units[j].equipments[x].id,equipment_name:sections[i].units[j].equipments[x].name});
              if(sections[i].units[j].equipments[x].equipments.length>0)
              {
                for(let y=0;y<sections[i].units[j].equipments[x].equipments.length;y++)
                  this.addSpecificEquipments(i,j,x,sections[i].units[j].equipments[x].equipments[y]);
              }
              else
                this.addSpecificEquipments(i,j,x,'');
            }
            for(let x=0;x<sections[i].units[j].systems.length;x++)
            {
              this.addSystem(i,j,{system_id:sections[i].units[j].systems[x].id,system_name:sections[i].units[j].systems[x].name});
              if(sections[i].units[j].systems[x].systems.length>0)
              {
                for(let y=0;y<sections[i].units[j].systems[x].systems.length;y++)
                  this.addSpecificSystems(i,j,x,sections[i].units[j].systems[x].systems[y]);
              }
              else
                this.addSpecificSystems(i,j,x,'');
            }
          }
        }
        this.crudForm.disable();
        console.log('crudForm',this.crudForm);
        // this.sections=res.sections;
    });
  }
  sections_psr(): FormArray {
    return this.crudForm.get("sections") as FormArray
  }

  newSectionPsr(section:any): FormGroup {
    return new FormGroup({
      id: new FormControl((section.id?(section.id):'')),
      name: new FormControl((section.name?(section.name):'')),
      standards: new FormControl((section.standards?(section.standards):'')),
      whole_ship_features: new FormControl((section.whole_ship_features?section.whole_ship_features:'')),
      man_power: new FormControl((section.man_power?section.man_power:'')),
      units:new FormArray([])
    });
  }
  addSectionPsr(section='') {
    this.sections_psr().push(this.newSectionPsr(section));
  }

  removeSectionPsr(sectionIndex:number) {
    this.sections_psr().removeAt(sectionIndex);
  }

  sectionUnit(sectionIndex:number) : FormArray {
    return this.sections_psr().at(sectionIndex).get("units") as FormArray
  }

  newSectionUnit(unitDet:any): FormGroup {
    return new FormGroup({
        id: new FormControl((unitDet.id?(unitDet.id):'')),
        name: new FormControl((unitDet.name?(unitDet.name):'')),
        compartments: new FormArray([]),
        equipments: new FormArray([]),
        systems: new FormArray([])
    })
  }

  addSectionUnit(sectionIndex:number,unitDet:any) {
    this.sectionUnit(sectionIndex).push(this.newSectionUnit(unitDet));
  }

  removeSectionUnit(sectionIndex:number,unitIndex:number) {
    this.sectionUnit(sectionIndex).removeAt(unitIndex);
  }

  compartments(sectionIndex:number,unitIndex:number) : FormArray {
    return this.sectionUnit(sectionIndex).at(unitIndex).get("compartments") as FormArray
  }
  newCompartment(compartment:any): FormGroup {
    return new FormGroup({
      compartment_id: new FormControl((compartment.compartment_id?(compartment.compartment_id):'')),
      compartment_name: new FormControl((compartment.compartment_name?(compartment.compartment_name):'')),
      compartments: new FormArray([]),
    });
  }
  addCompartment(sectionIndex:number,unitIndex:number,compartment:any) {
    this.compartments(sectionIndex,unitIndex).push(this.newCompartment(compartment));
  }

  removeCompartment(sectionIndex:number,unitIndex:number,compartmentIndex:number) {
    this.compartments(sectionIndex,unitIndex).removeAt(compartmentIndex);
  }

  specificCompartments(sectionIndex:number,unitIndex:number,compartmentIndex:number) : FormArray {
    return this.compartments(sectionIndex,unitIndex).at(compartmentIndex).get("compartments") as FormArray
  }
  newSpecificCompartments(compartment:any): FormGroup {
    return new FormGroup({
      ser: new FormControl((compartment.ser?(compartment.ser):'')),
      name: new FormControl((compartment.name?(compartment.name):'')),
      numbers: new FormControl((compartment.numbers?(compartment.numbers):'')),
      location: new FormControl((compartment.location?(compartment.location):'')),
      equipment: new FormControl((compartment.equipment?(compartment.equipment):'')),
      features: new FormControl((compartment.features?(compartment.features):'')),
      layout: new FormControl((compartment.layout?(compartment.layout):'')),
      special_requirements: new FormControl((compartment.special_requirements?(compartment.special_requirements):'')),
      standards: new FormControl((compartment.standards?(compartment.standards):'')),
      recommendations: new FormControl((compartment.recommendations?(compartment.recommendations):'')),
    });
  }
  addSpecificCompartments(sectionIndex:number,unitIndex:number,compartmentIndex:number,compartment:any) {
    console.log('sectionIndex',sectionIndex);
    console.log('unitIndex',unitIndex);
    console.log('compartmentIndex',compartmentIndex);
    this.specificCompartments(sectionIndex,unitIndex,compartmentIndex).push(this.newSpecificCompartments(compartment));
  }

  removeSpecificCompartments(sectionIndex:number,unitIndex:number,compartmentIndex:number,compartmentSpecificIndex:number) {
    this.specificCompartments(sectionIndex,unitIndex,compartmentIndex).removeAt(compartmentSpecificIndex);
  }

  equipments(sectionIndex:number,unitIndex:number) : FormArray {
    return this.sectionUnit(sectionIndex).at(unitIndex).get("equipments") as FormArray
  }
  newEquipment(equipment:any): FormGroup {
    return new FormGroup({
      equipment_id: new FormControl((equipment.equipment_id?(equipment.equipment_id):'')),
      equipment_name: new FormControl((equipment.equipment_name?(equipment.equipment_name):'')),
      equipments: new FormArray([]),
    });
  }
  addEquipment(sectionIndex:number,unitIndex:number,equipment:any) {
    this.equipments(sectionIndex,unitIndex).push(this.newEquipment(equipment));
  }

  removeEquipment(sectionIndex:number,unitIndex:number,equipmentIndex:number) {
    this.equipments(sectionIndex,unitIndex).removeAt(equipmentIndex);
  }

  specificEquipments(sectionIndex:number,unitIndex:number,equipmentIndex:number) : FormArray {
    return this.equipments(sectionIndex,unitIndex).at(equipmentIndex).get("equipments") as FormArray
  }
  newSpecificEquipments(equipment:any): FormGroup {
    return new FormGroup({
      ser: new FormControl((equipment.ser?(equipment.ser):'')),
      name: new FormControl((equipment.name?(equipment.name):'')),
      numbers: new FormControl((equipment.numbers?(equipment.numbers):'')),
      capabilities: new FormControl((equipment.capabilities?(equipment.capabilities):'')),
      weight: new FormControl((equipment.weight?(equipment.weight):'')),
      location: new FormControl((equipment.location?(equipment.location):'')),
      interface: new FormControl((equipment.interface?(equipment.interface):'')),
      procurement: new FormControl((equipment.procurement?(equipment.procurement):'')),
      vendor: new FormControl((equipment.vendor?(equipment.vendor):'')),
      cost: new FormControl((equipment.cost?(equipment.cost):'')),
      standards: new FormControl((equipment.standards?(equipment.standards):'')),
      sustence: new FormControl((equipment.sustence?(equipment.sustence):'')),
      recommendations: new FormControl((equipment.recommendations?(equipment.recommendations):'')),
    });
  }
  addSpecificEquipments(sectionIndex:number,unitIndex:number,equipmentIndex:number,equipment:any) {
    this.specificEquipments(sectionIndex,unitIndex,equipmentIndex).push(this.newSpecificEquipments(equipment));
  }

  removeSpecificEquipments(sectionIndex:number,unitIndex:number,equipmentIndex:number,equipmentSpecificIndex:number) {
    this.specificEquipments(sectionIndex,unitIndex,equipmentIndex).removeAt(equipmentSpecificIndex);
  }


  systems(sectionIndex:number,unitIndex:number) : FormArray {
    return this.sectionUnit(sectionIndex).at(unitIndex).get("systems") as FormArray
  }
  newSystem(system:any): FormGroup {
    return new FormGroup({
      system_id: new FormControl((system.system_id?(system.system_id):'')),
      system_name: new FormControl((system.system_name?(system.system_name):'')),
      systems: new FormArray([]),
    });
  }
  addSystem(sectionIndex:number,unitIndex:number,system:any) {
    this.systems(sectionIndex,unitIndex).push(this.newSystem(system));
  }

  removeSystem(sectionIndex:number,unitIndex:number,systemIndex:number) {
    this.systems(sectionIndex,unitIndex).removeAt(systemIndex);
  }

  specificSystems(sectionIndex:number,unitIndex:number,systemIndex:number) : FormArray {
    return this.systems(sectionIndex,unitIndex).at(systemIndex).get("systems") as FormArray
  }
  newSpecificSystems(system:any): FormGroup {
    return new FormGroup({
      ser: new FormControl((system.ser?(system.ser):'')),
      name: new FormControl((system.name?(system.name):'')),
      numbers: new FormControl((system.numbers?(system.numbers):'')),
      capabilities: new FormControl((system.capabilities?(system.capabilities):'')),
      weight: new FormControl((system.weight?(system.weight):'')),
      location: new FormControl((system.location?(system.location):'')),
      interface: new FormControl((system.interface?(system.interface):'')),
      procurement: new FormControl((system.procurement?(system.procurement):'')),
      vendor: new FormControl((system.vendor?(system.vendor):'')),
      cost: new FormControl((system.cost?(system.cost):'')),
      standards: new FormControl((system.standards?(system.standards):'')),
      sustence: new FormControl((system.sustence?(system.sustence):'')),
      recommendations: new FormControl((system.recommendations?(system.recommendations):'')),
    });
  }
  addSpecificSystems(sectionIndex:number,unitIndex:number,systemIndex:number,equipment:any) {
    this.specificSystems(sectionIndex,unitIndex,systemIndex).push(this.newSpecificSystems(equipment));
  }

  removeSpecificSystems(sectionIndex:number,unitIndex:number,systemIndex:number,systemSpecificIndex:number) {
    this.specificSystems(sectionIndex,unitIndex,systemIndex).removeAt(systemSpecificIndex);
  }

  public editFormSendMail = new FormGroup({
    id: new FormControl(""),
    bls_initiation_notes: new FormControl("", [Validators.required]),
    to_email: new FormControl("", [Validators.required]),
    subject: new FormControl("", [Validators.required]),
    comments: new FormControl("",[Validators.required]),
    file_name: new FormControl("",[Validators.required]),

  });

  senEmail(input) {
    console.log(input,'WWWWWWw')
    this.editFormSendMail.patchValue({
      bls_initiation_notes: input.id,
      status: "1",
    });

  }


  onSubmitSendEmail(){


    if (this.editFormSendMail.valid) {

      const formData = new FormData();
      formData.append('id','');
      formData.append('bls_initiation_notes_master',this.editFormSendMail.value.bls_initiation_notes);
      formData.append('to_email', this.editFormSendMail.value.to_email);
      formData.append('subject', this.editFormSendMail.value.subject);
      formData.append('comments', this.editFormSendMail.value.comments);
      formData.append('file_name', this.fileSendMailToUpload);
      formData.append('created_by', this.api.userid.user_id);
      formData.append('status', '1')

      this.api
        .postAPI(
          environment.API_URL + "transaction/bls/initiation_notes_send_email/crud",
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
        this.closebutton.nativeElement.click();
        //res.data['type']='edit';

      this.editFormSendMail.get('to_email').reset();
      this.editFormSendMail.controls['subject'].reset();
      this.editFormSendMail.controls['comments'].reset();
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
  getDocumentListing(initiation) {

    //alert(initiation.id)
    this.api
      .getAPI(environment.API_URL + "transaction/bls/initiation_notes_document?status=1&initiation_notes_bls_master="+initiation.id)
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

   onDeleteDocument(input) {
    //alert(id)
    //return false;
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: language[environment.DEFAULT_LANG].confirmMessage
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.api.postAPI(environment.API_URL + "transaction/bls/initiation_notes_document/crud", {
          id: input.id,
          status: 3,
          document_name: input.document_name,
          document_remark: input.document_remark
        }).subscribe((res)=>{
          this.logger.log('response',res);
          if(res.status==environment.SUCCESS_CODE) {
            this.logger.info('delete')
            this.notification.warn('Document '+language[environment.DEFAULT_LANG].deleteMsg);

            
            let input_id = this.editFormDocument.value.bls_initiation_notes;
            //alert(initiation_id);
            this.getDocumentListing({id:input_id});

          } else {
            this.notification.displayMessage(language[environment.DEFAULT_LANG].unableDelete);
          }
        });
      }
      dialogRef=null;
    });
  }


  public editFormDocument = new FormGroup({
    id: new FormControl(""),
    bls_initiation_notes: new FormControl("", [Validators.required]),
    document_name: new FormControl("", [Validators.required]),
    document_remark: new FormControl("",[Validators.required]),
    file_name: new FormControl("",[Validators.required]),

  });

  document(input) {
    this.localform.submitted=false;
    this.showError = false;

    //console.log('##',initiation);
    this.getDocumentListing(input)

    //console.log('@@@@@',initiation);
    this.editFormDocument.patchValue({
      bls_initiation_notes: input.id,
      status: "1",
    });
  }

  onSubmitDocument() {
    this.showError = true;

    if (this.editFormDocument.valid) {

      const formData = new FormData();
      formData.append('id','');
      formData.append('initiation_notes_bls_master', this.editFormDocument.value.bls_initiation_notes);
      formData.append('document_name', this.editFormDocument.value.document_name);
      formData.append('document_remark', this.editFormDocument.value.document_remark);
      formData.append('file_name', this.fileToUpload);
      formData.append('status', '1')

      //console.log(formData);
      //return false;

      this.api
      .postAPI(
        environment.API_URL + "transaction/bls/initiation_notes_document/crud",
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

           let input_id = this.editFormDocument.value.bls_initiation_notes;
          this.getDocumentListing({id:input_id});

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
Emailclose(){
    this.editFormSendMail.reset();
  }
  Approvalclose(){
   this.editFormApproval.reset();
  }
  Documentclose(){
    this.showError = false;
    let reset = this.formGroupDirective.resetForm();
    if(reset!==null) {
      this.formdoc();
    }
    this.editFormDocument.reset();
  }
   onclose(){
    this.FinalArray=[];
    let reset = this.formGroupDirective.resetForm();
    if(reset!==null) {
      this.initForm();
    }
    this.editForm.reset();
  }
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

}
