import { Component, OnInit, ViewChild,ViewChildren, Input, ElementRef } from '@angular/core';
import { ApiService } from "src/app/service/api.service";
import { environment } from "src/environments/environment";
//import { FormGroup, FormControl, Validators, FormGroupDirective } from "@angular/forms";
import {FormBuilder, FormGroup, FormArray, FormControl, Validators, FormGroupDirective } from "@angular/forms";
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
import { of } from 'rxjs';
import {ChangeDetectorRef} from '@angular/core';

declare var moment:any;
declare var inArray;
declare var arrayColumn;
declare function openModal(selector):any;
declare function closeModal(selector):any;
declare function formSubmit(selector):any;
declare function triggerClick(selector):any;


@Component({
  selector: 'app-formulation-paper',
  templateUrl: './formulation-paper.component.html',
  styleUrls: ['./formulation-paper.component.scss']
})

export class FormulationPaperComponent implements OnInit {
 @ViewChild('localform')localform:HTMLFormElement;
 active = 1;
 isChecked = false
 finalUnits = [];
 finalCompartments = [];
 finalSystems = [];
 finalEquipments = [];
 obj = {};
 showError=false;

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
    placeholder: 'Enter comment here...',
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
    "project",
    //"intoduction",
    // "man_power",
    // "list_of_major_compartments",
    // "dimensions",
    // "remarks",
    "requested_by",
    "requested_on",
    "email",
    "approval",
    "responsibility",
    "upload",
    "view",
    "edit",
    "delete",

];


global_statuses:any;
getGlobalStatus() {
  this.api
    .getAPI(environment.API_URL + "master/status?status=1")
    .subscribe((res) => {
      this.global_statuses = res.data;
    });
}

getListing()
{
    this.api
      .getAPI(environment.API_URL + "transaction/psr/formulation_of_approach_paper")
      .subscribe((res) => {
        this.dataSourcePending = new MatTableDataSource(res.data);
        this.dataListPending = res.data;
        this.FinalArray=[];
        this.getProject;
        this.dataSourcePending.paginator = this.paginationPending;
        this.logger.log('formulation_of_approach_paper',res.data)
      });
}
getresponsiblityListing()
{
    this.api
      .getAPI(environment.API_URL + "transaction/psr/responsibility_list")
      .subscribe((res) => {
        this.dataSourcePending = new MatTableDataSource(res.data);
        this.dataListPending = res.data;
        this.dataSourcePending.paginator = this.paginationPending;
        this.logger.log('responsibility_list',res.data)
      });
}

FileUrl:any;
getDocumentListing(formulation) {

  //alert(formulation.id)
  this.api
    .getAPI(environment.API_URL + "transaction/psr/formulation_of_approach_paper_document?status=1&formulation_of_approach_paper="+formulation.id)
    .subscribe((res) => {
      this.documentList = res.data;
      console.log(this.documentList,'gfd')
    });
    var File=environment.API_URL;
        this.FileUrl = File.substring(0,File.length-1) ;

 }

 downloadFile(document){
  let url = environment.API_URL + document.file_name;
  //alert(environment.API_URL + document.file_name);
  //window.open(url, '_self');
  //e.preventDefault();

  window.location.href = url;

}

getInitiationNotes(project_id='')
{
  let filter=project_id?'?project_id='+project_id:'';
    this.api
      .getAPI(environment.API_URL + "transaction/psr/initiation_notes"+filter)
      .subscribe((res) => {

        console.log(res.data[0],'$$$$$$$$$$$$$$$');
        let initiationNotes=res.data[0];
        let introduction=`1.  Role of the Platforms.`;
        introduction+='<br><b>Primary Roles</b> <ul>';
        for(let i=0;i<initiationNotes.primary_role.length;i++)
        {
          introduction+='<li>'+initiationNotes.primary_role[i].name+'</li>';
        }
        introduction+='</ul>';

        introduction+='<br><b>Secondary Roles</b> <ul>';
        for(let i=0;i<initiationNotes.secondary_role.length;i++)
        {
          introduction+='<li>'+initiationNotes.secondary_role[i].name+'</li>';
        }
        introduction+='</ul>';
        introduction+='<br>2. Cardinal dates </b>';
        introduction+='<br>Accord Of AON : <b>'+initiationNotes.accord_of_aon+'.</b>';
        introduction+='<br>Conclusion Of Contract: <b>'+initiationNotes.conclusion_of_contract+'.</b>';
        introduction+='<br>Induction: <b>'+initiationNotes.induction+'.</b>';
        introduction+='<br>3. Plan for Manpower Induction : <b>'+initiationNotes.plan_for_manpower_induction.name+'</b>';
        introduction+='<br>4. Budgeted cost per platform : <b>'+initiationNotes.budgeted_cost_per_platform+' Cr.'+'</b>';
        introduction+='<br>5. Standards to be Used : <b>'+initiationNotes.standard.name+'</b>';

        this.editForm.patchValue({intoduction:introduction});
        this.editForm.patchValue({remarks:initiationNotes.remarks});

        console.log("res.data",res.data)
      });
}
onProjectHandler(project_id)
{
  if(project_id)
  {
    this.getInitiationNotes(project_id);
    this.editForm.patchValue({critical_design_driver:'This section is to elaborate on those aspects of the ship that are critical for it to comply with its role. During the SR development process, these would be prioritised over other requirements.'});
    this.editForm.patchValue({weapons_and_sensors:'Only broad capabilities in each domain, without specifics. Tool prepared by MDCC for quantification of combat potential is to be used to aid the process. EW inputs to be obtained from DNS. In addition, the under-preparation document ‘Standardisation of Combat Capability Architecture’ is to be referred to.'});
    this.editForm.patchValue({composite_communication_capability:'Capabilities required to mesh the ship and users within, with the IN Command and Control and NCO frameworks seamlessly, via multiple secure media layers distributed through a secure network. The system should be evolved holistically depending on the role and size of the platform and should be well integrated from antenna till user terminals. To be formulated in consultation with DNS and DNSO'});
    this.editForm.patchValue({flag_platform:'Whether the ship is envisaged to undertake functions of Flag Platform.'});
    this.editForm.patchValue({speed_and_endurance:'Max, min as well as endurance speeds. Endurance in miles, as well as speed at which this is to be achieved.'});
    this.editForm.patchValue({operations_cycle:'Time between refits. Formulated in consultation with DFM and DME.'});
    this.editForm.patchValue({stealth:'Whether stealth is needed in radar, IR, magnetic, wake and/ or acoustic signatures. To be quantified to the extent feasible. Formulated in consultation with DND.'});
    this.editForm.patchValue({redundancy:'Degree of redundancy required (in %) in weapons and sensors, propulsion, power generation etc. Formulated in consultation with DEE and DME.'});
    this.editForm.patchValue({aviation:'Types and numbers of aircraft to be operated. Special equipment required. Formulated in consultation with DNAS.'});
    this.editForm.patchValue({autonomous_systems:'Types and numbers of autonomous systems to be controlled. Formulated in consultation with DNAS.'});
    this.editForm.patchValue({unrep:'Ability to undertake as well as conduct UNREP, with number of fuelling, jackstay and heavy jackstay stations.'});
    this.editForm.patchValue({survivability:'Sea State, environmental and shock conditions in which ship is to function. Formulated in consultation with DND.'});
    this.editForm.patchValue({medical_and_hadr_facilities:'Size of sickbay. Need for additional space for HADR bricks. Formulated in consultation with DMS.'});
    this.editForm.patchValue({boats_and_landing_craft:'Numbers and approximate sizes, alongwith type of lifting mechanism. Formulated in consultation with DNA.'});
    this.editForm.patchValue({upper_deck_equipment:'Numbers and types of Capstans, winches, accommodation ladders, cranes. Formulated in consultation with DNA.'});
    this.editForm.patchValue({habitability:'Whether separate galley, dining hall and bathrooms are to be provided for Jr and Sr sailors. Whether stores and offices are to be shared between departments, along with extent of sharing (in %). Formulated in consultation with DNA, DLS and DCV.'});
    this.editForm.patchValue({nbcd_compliance:'Whether the ship should be only capable of DC and FF, or if full NBCD compliance is required. Formulated in consultation with DNBCD.'});
    this.editForm.patchValue({special_capabilities:'This would be more applicable in the case of auxiliaries or specialist craft. '});
    this.editForm.patchValue({manpower:'To be based on extant policy of manning of ships (lean manning etc), previous ships of similar class and international trends. It is to be divided as per department and include numbers of trainees and women officers. Manpower for support organisations is to be separately indicated. To be formulated in consultation with DOP. '});
    this.editForm.patchValue({project_activity_description:'A list of major compartments only, to be prepared by DSR and vetted by all Directorates.  '});
  }
  console.log('project_id',project_id);
}
onDeleteDocument(formulation) {
//alert(id.id)
//return false;
let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
  width: '350px',
  data: language[environment.DEFAULT_LANG].confirmMessage
});
dialogRef.afterClosed().subscribe(result => {
  if(result) {
    this.api.postAPI(environment.API_URL + "transaction/psr/formulation_of_approach_paper_document/crud", {
      id: formulation.id,
      status: 3,
      document_name: formulation.document_name,
      document_remark: formulation.document_remark
    }).subscribe((res)=>{
      this.logger.log('response',res);
      if(res.status==environment.SUCCESS_CODE) {
        this.logger.info('delete')
        this.notification.warn('Document '+language[environment.DEFAULT_LANG].deleteMsg);

        let formulation_of_approach_paper = this.editFormDocument.value.formulation_of_approach_paper;
        //alert(initiation_id);
        this.getDocumentListing({id:formulation_of_approach_paper});

      } else {
        this.notification.displayMessage(language[environment.DEFAULT_LANG].unableDelete);
      }
    });
  }
  dialogRef=null;
});
}



dataSource: MatTableDataSource<any>;
dataSourceApproved: MatTableDataSource<any>;
dataSourcePending: MatTableDataSource<any>;
myModel = false
country: any;
public crudName = "Add";
public countryList = [];
public dataListApproved = [];
public dataListPending = [];
public documentList = [];
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
@ViewChild("closebuttonapproved") closebuttonapproved;
@ViewChild("closebuttonemail") closebuttonemail;
@ViewChild(FormGroupDirective) formGroupDirective: FormGroupDirective;
@ViewChild('divClick') divClick: ElementRef;
@ViewChildren('sComponents') sComponents;
@ViewChildren('sEquipments') sEquipments;
@ViewChildren('sSystems') sSystems;


editFormResponsibility: FormGroup

constructor(public api: ApiService, private notification : NotificationService,
  private dialog:MatDialog, private router : Router, private elementref : ElementRef,private logger:ConsoleService,public aroute: ActivatedRoute, private fb: FormBuilder, private cd : ChangeDetectorRef) {

  // this.editFormResponsibility = this.fb.group({
  //   checkArray: this.fb.array([


  //   ])
  // })
}


public editForm = new FormGroup({

  id: new FormControl(""),
  project: new FormControl("",[Validators.required]),
  remarks: new FormControl("",[Validators.required]),
  intoduction: new FormControl("",[Validators.required]),
  critical_design_driver: new FormControl("",[Validators.required]),
  weapons_and_sensors: new FormControl("",[Validators.required]),
  composite_communication_capability: new FormControl("",[Validators.required]),
  flag_platform: new FormControl("",[Validators.required]),
  speed_and_endurance: new FormControl("",[Validators.required]),
  operations_cycle: new FormControl("",[Validators.required]),
  stealth: new FormControl("",[Validators.required]),
  redundancy: new FormControl("",[Validators.required]),
  aviation: new FormControl("",[Validators.required]),
  autonomous_systems: new FormControl("",[Validators.required]),
  unrep: new FormControl("",[Validators.required]),
  survivability: new FormControl("",[Validators.required]),
  medical_and_hadr_facilities: new FormControl("",[Validators.required]),
  boats_and_landing_craft: new FormControl("",[Validators.required]),
  upper_deck_equipment: new FormControl("",[Validators.required]),
  habitability: new FormControl("",[Validators.required]),
  nbcd_compliance: new FormControl("",[Validators.required]),
  special_capabilities: new FormControl("",[Validators.required]),
  manpower: new FormControl("",[Validators.required]),
  project_activity_description: new FormControl("",[Validators.required])

});

public editForm5= new FormGroup({
  id: new FormControl(""),
  project_id: new FormControl("",[Validators.required]),
  introduction: new FormControl("",[Validators.required]),
  primary_role: new FormControl("",[Validators.required]),
  secondary_role: new FormControl("",[Validators.required]),
  budget: new FormControl("",[Validators.required]),
  standard: new FormControl("",[Validators.required]),
  manpower_induction: new FormControl("",[Validators.required]),
  quantity: new FormControl("",[Validators.required]),
  acquisition_method: new FormControl("",[Validators.required]),
  remarks: new FormControl("",[Validators.required]),
});

public editForm1= new FormGroup({
  id: new FormControl(""),
  project_id: new FormControl("",[Validators.required]),
  introduction: new FormControl("",[Validators.required]),
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
  introduction: new FormControl("",[Validators.required]),
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
  introduction: new FormControl("",[Validators.required]),
  primary_role: new FormControl("",[Validators.required]),
  secondary_role: new FormControl("",[Validators.required]),
  budget: new FormControl("",[Validators.required]),
  standard: new FormControl("",[Validators.required]),
  manpower_induction: new FormControl("",[Validators.required]),
  quantity: new FormControl("",[Validators.required]),
  acquisition_method: new FormControl("",[Validators.required]),
  remarks: new FormControl("",[Validators.required]),
});

public editForm4 = new FormGroup({
  id: new FormControl(""),
  project_id: new FormControl("",[Validators.required]),
  introduction: new FormControl("",[Validators.required]),
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

    console.log(data,"data");
    this.editForm.patchValue(data);
    this.editForm.patchValue({project:data.project.id});

    this.logger.info(data.status)

}
responsiblity_populate(data) {

  console.log(data,"data");

  //this.editFormResponsibility1.patchValue(data);
  let compartmentss =data[0].compartments.map(function(a){return a['id'];});
  let sectionss =data[0].sections.map(function(a){return a['id'];});
  let unitss =data[0].units.map(function(a){return a['id'];});
  let systemss =data[0].units.map(function(a){return a['id'];});
  let equipmentss =data[0].equipments.map(function(a){return a['id'];});



  console.log('sec',sectionss)
  this.editFormResponsibility1.patchValue({compartment:compartmentss});
  this.editFormResponsibility1.patchValue({section:sectionss});
  this.editFormResponsibility1.patchValue({unit:unitss});
  this.editFormResponsibility1.patchValue({system:systemss});
  this.editFormResponsibility1.patchValue({equipment:equipmentss});
  //this.editFormResponsibility1.get('data0.sections..id').patchValue(section);



  this.logger.info(data.status)

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
editForm3Error = (controlName: string, errorName: string) => {
  return this.editForm3.controls[controlName]?this.editForm3.controls[controlName].hasError(errorName):false;
  
};

isEquipment=true;
isBoiler=false;

currentSection:any;
currentUnit:any;

ngOnInit(): void {
 this.getListing();
// this.getProject();
 this.getSection();
 this.getGlobalStatus();
 this.getAccess();

 this.getUnits();
 this.getCompartments();
 this.getSystems();
 this.getEquipments();

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

allCompartments:any;
getCompartments()
{
    this.api
      .getAPI(environment.API_URL + "master/compartment?&status=1")
      .subscribe((res) => {
        this.allCompartments = res.data;
      });
}

allSystems:any;
getSystems()
{
    this.api
      .getAPI(environment.API_URL + "master/system?&status=1")
      .subscribe((res) => {
        this.allSystems = res.data;
      });
}

allEquipments:any;
getEquipments()
{
    this.api
      .getAPI(environment.API_URL + "master/equipment?&status=1")
      .subscribe((res) => {
        this.allEquipments = res.data;
      });
}

sections:any;
getSection() {
  this.api
    .getAPI(environment.API_URL + "transaction/psr/sectionlist?status=1")
    .subscribe((res) => {
      this.sections = res.data;
    });
}

onClickUnit(unit)
{
  this.currentUnit=unit;
  this.getResponsibility();
  console.log('unit',unit);

}
selectAllCompartments(event)
{
  for(let i=0; i<this.sComponents._results.length;i++){
    this.sComponents._results[i].checked=event.checked;
  }
}
selectAllSystems(event)
{
  console.log('selectAllSystems',this.sSystems);
  for(let i=0; i<this.sSystems._results.length;i++){
    this.sSystems._results[i].checked=event.checked;
  }
}
selectAllEquipments(event)
{
  for(let i=0; i<this.sEquipments._results.length;i++){
    this.sEquipments._results[i].checked=event.checked;
  }
}
getResponsibility()
{
  let project_id=this.editFormResponsibility1.value.project;
  let section_unit_id=this.currentUnit?this.currentUnit.id:'';
  let formData={project_id:project_id,section_unit_id:section_unit_id}
  this.api.postAPI(environment.API_URL + "transaction/get_responsibility",formData).subscribe((res) => {
    console.log('res',res);
    if(res.status==environment.SUCCESS_CODE)
    {
      if((res.compartments && res.compartments.length>0))
      {
        this.makeCompartmentChecked(arrayColumn(res.compartments,'compartment'));
      }
      if((res.systems && res.systems.length>0))
      {
        this.makeSystemChecked(arrayColumn(res.systems,'system'));
      }
      if((res.equipments && res.equipments.length>0))
      {
        this.makeEquipmentChecked(arrayColumn(res.equipments,'equipment'));
      }
    }
  });
}
onSaveResponsibility()
{
  console.log('this.editFormResponsibility1',this.editFormResponsibility1.value);
  let project_id=this.editFormResponsibility1.value.project;
  let section_unit_id=this.currentUnit.id;
  let selectedCompartments=[];
  let selectedEquipments=[];
  let selectedSystems=[];
  for(let i=0; i<this.sComponents._results.length;i++){
    if(this.sComponents._results[i].checked==true)
      selectedCompartments.push(this.sComponents._results[i].value);
  }
  for(let i=0; i<this.sEquipments._results.length;i++){
    if(this.sEquipments._results[i].checked==true)
      selectedEquipments.push(this.sEquipments._results[i].value);
  }
  for(let i=0; i<this.sSystems._results.length;i++){
    if(this.sSystems._results[i].checked==true)
      selectedSystems.push(this.sSystems._results[i].value);
  }
  let formData={project_id:project_id,section_unit_id:section_unit_id,compartments:selectedCompartments,equipments:selectedEquipments,systems:selectedSystems}
  this.api.postAPI(environment.API_URL + "transaction/save_responsibility",formData).subscribe((res) => {
      this.logger.log('response',res);

      if(res.status==environment.SUCCESS_CODE){
        this.notification.success(res.message);
          this.getListing();
          closeModal('#responsibility-modal');
            this.closebutton.nativeElement.click();
      } else if(res.status==environment.ERROR_CODE) {
        this.notification.displayMessage(res.message);
      } else {
        this.notification.displayMessage(language[environment.DEFAULT_LANG].unableSubmit);
      }

    });


}
makeCompartmentChecked(compartments)
{
  for(let i=0; i<this.sComponents._results.length;i++){
    if(inArray(this.sComponents._results[i].value,compartments))
    {
      this.sComponents._results[i].checked=true;
    }
  }
}
makeEquipmentChecked(equipments)
{
  for(let i=0; i<this.sEquipments._results.length;i++){
    if(inArray(this.sEquipments._results[i].value,equipments))
    {
      this.sEquipments._results[i].checked=true;
    }
  }
}
makeSystemChecked(systems)
{
  for(let i=0; i<this.sSystems._results.length;i++){
    if(inArray(this.sSystems._results[i].value,systems))
    {
      this.sSystems._results[i].checked=true;
    }
  }
}
onClickSection(section)
{
  this.currentUnit=null;
  this.currentSection=section;
  console.log();
  console.log('section',section);
}

projects:any;
temp:any=[];
public FinalArray = [];

getProject(code) {
  this.api
    .getAPI(environment.API_URL + "transaction/global_master")
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



applyFilterPending(event: Event) {
  this.filterValue = (event.target as HTMLInputElement).value;
  if(this.filterValue){
    this.dataSourcePending.filter = this.filterValue.trim().toLowerCase();
  } else {
    this.getListing();
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
pro=false;
editOption(formulation) {
  this.isReadonly=false;
  this.editForm.controls['project'].disable();
  this.pro=true;
  this.editForm.enable();
  this.getProject("edit");
  this.crudName = "Submit";
  this.logger.info(formulation);
  this.populate(formulation);

}
edit(country) {
  this.projectid=country;
  console.log(country)
  this.isReadonly=false;
  this.editForm.enable();
  this.crudName = "Edit";


  this.getResponsibilities();

  this.logger.info(this.responsibility);

}

viewTrial:any;
onView(formulation) {
  this.crudName = 'View';
  this.viewTrial=formulation;
  this.isReadonly=true;
  this.getProject("view");

  this.editorConfig.editable= false;



  this.editForm.disable();
  this.populate(formulation);

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
   this.showError=true;
  if (this.editFormApproval.valid) {
    this.api
    .postAPI(
      environment.API_URL + "transaction/psr/formulation_of_approach_paper/crud",
      this.editFormApproval.value
    )
    .subscribe((res) => {
      this.logger.log('response',res);
      if(res.status==environment.SUCCESS_CODE){
        this.notification.success(res.message);
        this.getListing();
        this.notification.warn('PSR Formulation Of Approach Paper Approval Updated');

        this.closebuttonapproved.nativeElement.click();
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
    formulation_of_approach_paper: new FormControl("", [Validators.required]),
    document_name: new FormControl("", [Validators.required]),
    document_remark: new FormControl("",[Validators.required]),
    file_name: new FormControl("",[Validators.required]),

  });

  document(formulation) {
this.localform.submitted=false;
    console.log('##',formulation);
    this.getDocumentListing(formulation)

    //console.log('@@@@@',initiation);
    this.editFormDocument.patchValue({
      formulation_of_approach_paper: formulation.id,
      status: "1",
    });
  }

  onSubmitDocument() {

    this.showError=true;
    if (this.editFormDocument.valid) {

      const formData = new FormData();
      formData.append('id','');
      formData.append('formulation_of_approach_paper', this.editFormDocument.value.formulation_of_approach_paper);
      formData.append('document_name', this.editFormDocument.value.document_name);
      formData.append('document_remark', this.editFormDocument.value.document_remark);
      formData.append('file_name', this.fileToUpload);
      formData.append('status', '1')

      //console.log(formData);
      //return false;

      this.api
      .postAPI(
        environment.API_URL + "transaction/psr/formulation_of_approach_paper_document/crud",
        formData
      )
      .subscribe((res) => {
        this.logger.log('response',res);
        if(res.status==environment.SUCCESS_CODE){
          this.notification.success(res.message);
          this.localform.submitted=false;
          // this.editFormDocument.reset();
          this.editFormDocument.get('document_name').reset();
          this.editFormDocument.controls['document_remark'].reset();
          this.editFormDocument.controls['file_name'].reset();
          let reset = this.formGroupDirective.resetForm();
               if(reset!==null) {
              this.initForm();
               }
          
          let formulation_of_approach_paper_id = this.editFormDocument.value.formulation_of_approach_paper;
          this.getDocumentListing({id:formulation_of_approach_paper_id});
          
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
    formulation_of_approach_paper: new FormControl("", [Validators.required]),
    to_email: new FormControl("", [Validators.required]),
    subject: new FormControl("", [Validators.required]),
    comments: new FormControl("",[Validators.required]),
    file_name: new FormControl("",[Validators.required]),

  });

  senEmail(formulation) {

    this.editFormSendMail.patchValue({
      formulation_of_approach_paper: formulation.id,
      status: "1",
    });

  }


onSubmitSendEmail(){

  if (this.editFormSendMail.valid) {
//alert('@@@@@@@@@');
//return false;
    const formData = new FormData();
    formData.append('id','');
    formData.append('formulation_of_approach_paper', this.editFormSendMail.value.formulation_of_approach_paper);
    formData.append('to_email', this.editFormSendMail.value.to_email);
    formData.append('subject', this.editFormSendMail.value.subject);
    formData.append('comments', this.editFormSendMail.value.comments);
    formData.append('file_name', this.fileSendMailToUpload);
    formData.append('created_by', this.api.userid.user_id);
    formData.append('status', '1')

    this.api
      .postAPI(
        environment.API_URL + "transaction/psr/formulation_of_approach_paper_send_email/crud",
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
          this.closebuttonemail.nativeElement.click();
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
//alert(data)
//return false;

  let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
    width: '350px',
    data: language[environment.DEFAULT_LANG].confirmMessage
  });
  dialogRef.afterClosed().subscribe(result => {
    if(result) {

      this.api.postAPI(environment.API_URL + "transaction/psr/formulation_of_approach_paper/crud", {
        id: data.id,
        status: 3,
        project: data.project.id
      }).subscribe((res)=>{
        this.logger.log('response',res);
        if(res.status==environment.SUCCESS_CODE) {
          this.logger.info('delete')
          this.notification.warn('Formulation of approach paper '+language[environment.DEFAULT_LANG].deleteMsg);
          this.getListing();
        } else {
          this.notification.displayMessage(language[environment.DEFAULT_LANG].unableDelete);
        }
      });
    }
    dialogRef=null;
  });
}

onSubmit() {

  this.showError = true;
  console.log("#########",this.editForm.value)

   if (this.editForm.valid) {
    this.editForm.value.created_by = this.api.userid.user_id;
    this.editForm.value.status = this.editForm.value.status==true ? 1 : 2;
    this.api
      .postAPI(
        environment.API_URL + "transaction/psr/formulation_of_approach_paper/crud",
        this.editForm.value
      )
      .subscribe((res) => {
        this.logger.log('response',res);
        //this.error= res.status;
        if(res.status==environment.SUCCESS_CODE){
          // this.logger.log('Formvalue',this.editForm.value);
          this.notification.success(res.message);
          this.getListing();
          this.closebutton.nativeElement.click();
          res.data['type']='edit';
          localStorage.setItem('trial_form',this.api.encryptData(res.data));
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

onResponsibility1(a){
  console.log(a)
  //alert(a.data.id)
}


selectedItemsList = [];





  // Responsibility

  public editFormResponsibility1 = new FormGroup({
    id: new FormControl(""),
    project: new FormControl("", [Validators.required]),
    section: new FormControl("", [Validators.required]),
    unit: new FormControl("", [Validators.required]),
    compartment:this.fb.array([]),
    system:this.fb.array([]),
    equipment:this.fb.array([]),
    // unit: new FormControl("", [Validators.required]),
    // compartment: new FormControl("", [Validators.required]),
    // system: new FormControl("", [Validators.required]),
    // equipment: new FormControl("", [Validators.required]),
  });
  // get section() : FormArray {
  //   return this.editFormResponsibility1.get("section") as FormArray
  // }

  onUnit(e, a){
    const unit:FormArray=this.editFormResponsibility1.get('unit') as FormArray
    if(e.target.checked){
      unit.push(new FormControl(e.target.value))
    }else{
      var i =0
      unit.controls.forEach((item:any) => {
          if(item.value == e.target.value){
            unit.removeAt(i)
            return;
          }
          i++;
      })
    }
  }

  onCompartment(e, a){
    const compartment:FormArray=this.editFormResponsibility1.get('compartment') as FormArray
    if(e.target.checked){
      compartment.push(new FormControl(e.target.value))
    }else{
      var i =0
      compartment.controls.forEach((item:any) => {
          if(item.value == e.target.value){
            compartment.removeAt(i)
            return;
          }
          i++;
      })
    }
  }

  onSystem(e, a){
    const system:FormArray=this.editFormResponsibility1.get('system') as FormArray
    if(e.target.checked){
      system.push(new FormControl(e.target.value))
    }else{
      var i =0
      system.controls.forEach((item:any) => {
          if(item.value == e.target.value){
            system.removeAt(i)
            return;
          }
          i++;
      })
    }
  }

  onEquipment(e, a){
    const equipment:FormArray=this.editFormResponsibility1.get('equipment') as FormArray
    if(e.target.checked){
      equipment.push(new FormControl(e.target.value))
    }else{
      var i =0
      equipment.controls.forEach((item:any) => {
          if(item.value == e.target.value){
            equipment.removeAt(i)
            return;
          }
          i++;
      })
    }
  }

  onResponsibility(e, a){


    //var mo = document.getElementById('').odal.show();
    const section:FormArray = this.editFormResponsibility1.get('section') as FormArray
    const unit:FormArray = this.editFormResponsibility1.get('unit') as FormArray
    const compartment:FormArray = this.editFormResponsibility1.get('compartment') as FormArray
    const system:FormArray = this.editFormResponsibility1.get('system') as FormArray
    const equipment:FormArray = this.editFormResponsibility1.get('equipment') as FormArray

    console.log(section)
    if(e.target.checked){
      section.push(new FormControl(e.target.value))
      unit.push(new FormControl(e.target.value))
      compartment.push(new FormControl(e.target.value))
      system.push(new FormControl(e.target.value))
      equipment.push(new FormControl(e.target.value))


      //let checkboxes = document.querySelectorAll('input[name="unit"]:checked');
      //alert(checkboxes.length);

      //if(checkboxes.length>0){
        this.finalUnits = []
        this.allUnits.forEach((item_unit)=>{
          if(item_unit.section_id.id == a){

            this.finalUnits.push({
              name: item_unit.name,
              id: item_unit.id
            });
          }
        })
      //}

        console.log(this.finalUnits,"3333333333")

        this.allCompartments.forEach((item_comp)=>{
          if(item_comp.section_id.id == a){

            this.finalCompartments.push({
              name: item_comp.name,
              id: item_comp.id
            });
          }
        })

        this.allSystems.forEach((item_sys)=>{
            if(item_sys.section_id.id == a){

              this.finalSystems.push({
                name: item_sys.name,
                id: item_sys.id
              });
            }
        })

        this.allEquipments.forEach((item_eqp)=>{
          if(item_eqp.section_id.id == a){

             this.finalEquipments.push({
              name: item_eqp.name,
              id: item_eqp.id
            });
          }
      })

    }else{
      var i =0
      section.controls.forEach((item:any) => {
          if(item.value == e.target.value){
            section.removeAt(i)
            return;
          }
          i++;
      })

      var j =0
      unit.controls.forEach((item:any) => {
          if(item.value == e.target.value){
            unit.removeAt(j)
            return;
          }
          j++;
      })

      var k =0
      compartment.controls.forEach((item:any) => {
          if(item.value == e.target.value){
            compartment.removeAt(k)
            return;
          }
          k++;
      })

      var l =0
      system.controls.forEach((item:any) => {
          if(item.value == e.target.value){
            system.removeAt(l)
            return;
          }
          l++;
      })

      var m = 0
      equipment.controls.forEach((item:any) => {
          if(item.value == e.target.value){
            equipment.removeAt(m)
            return;
          }
          m++;
      })

      this.finalUnits = []
      this.finalCompartments = []
      this.finalSystems = []
      this.finalEquipments = []
    }

  }



  onResponsibilityLoad(formulation){
    console.log(formulation)
    this.currentUnit=null;
    this.editFormResponsibility1.patchValue({project:formulation.project.id});
    this.editFormResponsibility1.patchValue({formulation_of_approach_paper:formulation.id});
    this.editFormResponsibility1.patchValue({formulation_of_approach_paper:formulation.id});
    this.editLoadResponsibility(formulation.project.id)
  }


  resposibilityEdit:any;
  sectionEdit=[]
  editLoadResponsibility(id){

      this.api
        .getAPI(environment.API_URL + "transaction/psr/formulation_of_approach_paper_responsibility?project_id="+id+"&status=1")
        .subscribe((res) => {
          this.resposibilityEdit = res.data;

          var section = JSON.parse(this.resposibilityEdit[0]['section']);
          //var result = section.substring(1, section.length-1)
          //var final = result.replace(/['"]+/g, '')

          // console.log(typeof(section),section[0],"@@@@@@@@@@@@@@@@@@@@@@@222222222")

          let chSection = [5,4,6]
          this.sections.forEach((item_comp)=>{


            //chSection.forEach(h => {


              this.sectionEdit.push({

                id:item_comp.id,
                checked: chSection.findIndex((item) => item == item_comp.id ? true:false),
                name:item_comp.name,
              })


            //})

          })



          //this.subMenuItems = this.sectionEdit.filter((item, index, self) => self.indexOf(item) === index);
          //console.log(this.removeDuplicates(this.sectionEdit, "id"),'########')
          //console.log(this.sectionEdit.filter((item, index, self) => self.indexOf(item) === index),'|||||')
          console.log(this.sectionEdit,'########||||||')
        });

//console.log(this.sectionEdit.filter((item, index, self) => self.indexOf(item) === index),'|||||')
//console.log(this.removeDuplicates(this.sectionEdit, "id"),'########')
  }
  removeDuplicates(myArray, Prop) {
    return myArray.filter((obj, pos, arr) => {
      return arr.map(mapObj => mapObj[Prop]).indexOf(obj[Prop]) === pos;
    });
  }


  onSubmitResponsibility() {

    //console.log("#########",this.editFormResponsibility1.value)
    console.log("#########",this.editFormResponsibility1.value);
    //return false;
    // var end = this.editFormResponsibility1.value.section.length;
    // var unit = this.editFormResponsibility1.value.unit.splice(0, end)
    //return false;
    //alert(1)
    //console.log("#########",this.editForm.value)

     //if (this.editFormResponsibility1.valid) {

      //this.editForm.value.created_by = this.api.userid.user_id;
      //this.editForm.value.status = this.editForm.value.status==true ? 1 : 2;
      this.api
        .postAPI(
          environment.API_URL + "transaction/psr/formulation_of_approach_paper_responsibility/crud",
          {
            id: '',
            project: this.editFormResponsibility1.value.project,
            formulation_of_approach_paper: this.editFormResponsibility1.value.formulation_of_approach_paper,
            section:this.editFormResponsibility1.value.section,
            unit:this.editFormResponsibility1.value.unit,
            compartment:this.editFormResponsibility1.value.compartment,
            system: this.editFormResponsibility1.value.system,
            equipment:this.editFormResponsibility1.value.equipment
          }
        )
        .subscribe((res) => {
          this.logger.log('response',res);
          //this.error= res.status;
          if(res.status==environment.SUCCESS_CODE){
            // this.logger.log('Formvalue',this.editForm.value);
            this.notification.success(res.message);
            this.getListing();
            this.closebutton.nativeElement.click();
            res.data['type']='edit';
            localStorage.setItem('trial_form',this.api.encryptData(res.data));
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
responsibility:any;
  getResponsibilities() {
    console.log(this.projectid)
    this.api
      .getAPI(environment.API_URL + "transaction/psr/responsibility_list?project_id="+this.projectid)
      .subscribe((res) => {
        this.responsibility = res.data;
        this.responsiblity_populate(this.responsibility);

        //console.log(this.responsibility,"res")
      });
  }
  projectid:any;
  // openPopup(id) {
  //   this.projectid=id;
  //   //console.log('id',this.projectid)
  //   openModal('#responsibility-modal1');
  //   setTimeout(()=> {
  //     this.getResponsibilities();
  //    }, 2000);


  // }

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
Responsibilityclose(){
this.editFormResponsibility1.reset();
}


}
