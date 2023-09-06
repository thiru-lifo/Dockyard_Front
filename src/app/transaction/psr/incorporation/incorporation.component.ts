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

export interface PeriodicElement3 {
  ser: string;
  name: string;
  numbers: number;
  location: string;
  equipment: string;
  features: string;
  layout: string;
  specrequr: string;
  standards: string;
  actions: string;
}


const ELEMENT_DATA3: PeriodicElement3[] = [
  {ser: 'test', name: 'Hydrogen', numbers: 10000, location: 'test', equipment: 'test', features: 'test', layout: 'test', specrequr: 'test', standards: 'test',actions:''},
];

// System Table

export interface PeriodicElement2 {
  sysser: string;
  sysnumber: string;
  syscapability: string;
  syspower: string;
  syslocation: string;
  sysinterface: string;
  sysprocurement: string;
  sysvendor: string;
  syscost: string;
  sysstandard: string;
  syssustenance: string;
  //position: number;
  remarks: string;
}

const ELEMENT_DATA2: PeriodicElement2[] = [
  {sysser: 'test',sysnumber: 'test',syscapability: 'test',syspower: 'test',syslocation: 'test',sysinterface: 'test',sysprocurement: 'test',sysvendor: 'test',syscost: 'test',sysstandard: 'test',syssustenance: 'test',remarks:'test'},
];


@Component({
  selector: 'app-incorporation',
  templateUrl: './incorporation.component.html',
  styleUrls: ['./incorporation.component.scss']
})
export class IncorporationComponent implements OnInit {

  displayedColumns: string[] = ['name', 'remarks', 'actions'];
    dataSource2 = ELEMENT_DATA;

    displayedColumnsSystems: string[] = ['sysser', 'sysnumber', 'syscapability','syspower','syslocation','sysinterface','sysprocurement','sysvendor','syscost','sysstandard','syssustenance'];
    dataSystems = ELEMENT_DATA2;

    displayedColumns3: string[] = ['ser','name','numbers','symbol','equipment','features','layout','specrequr','standards','actions'];
    dataSource3 = ELEMENT_DATA3;

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
    "cost_estimation",
    "requested_by",
    "requested_on",
    "email",
    "approval",
    "upload",
    "responsibility",
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
  filterValue:any;
  isReadonly=false;
  moduleAccess:any;
  ErrorMsg:any;
  error_msg=false;
  moment=moment;
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

  @ViewChild(MatPaginator) pagination: MatPaginator;
  @ViewChild('paginationApproved') paginationApproved: MatPaginator;
  @ViewChild('paginationPending') paginationPending: MatPaginator;
  @ViewChild("closebutton") closebutton;
  @ViewChild(FormGroupDirective) formGroupDirective: FormGroupDirective;
  @ViewChild("closebuttonapproved") closebuttonapproved;
  @ViewChild("closebuttonemail") closebuttonemail;
  @ViewChild("closebutton_email") closebutton_email;
  @ViewChild('localform')localform:HTMLFormElement;


  constructor(public api: ApiService, private notification : NotificationService,
    private dialog:MatDialog, private router : Router, private elementref : ElementRef,private logger:ConsoleService,public aroute: ActivatedRoute) {
  }


  public editForm = new FormGroup({
    id: new FormControl(""),
    project: new FormControl("",[Validators.required]),
    cost_estimation: new FormControl("",[Validators.required]),
    // secondary_role: new FormControl("",[Validators.required]),
    // budget: new FormControl("",[Validators.required]),
    // standard: new FormControl("",[Validators.required]),
    // manpower_induction: new FormControl("",[Validators.required]),
    // quantity: new FormControl("",[Validators.required]),
    // acquisition_method: new FormControl("",[Validators.required]),
    // remarks: new FormControl("",[Validators.required]),
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

  populate(data) {
    this.clearSections();
    this.crudForm.patchValue({project_id:data.project.id,cost_estimation:data.cost_estimation});
    this.onProjectHandler(data.project.id);
  }

  clearSections()
  {

    this.crudForm = new FormGroup({
      id: new FormControl(""),
      project_id: new FormControl("",[Validators.required]),
      cost_estimation: new FormControl("",[Validators.required]),

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
docError = (controlName: string, errorName: string) => {
    return this.editFormDocument.controls[controlName]?this.editFormDocument.controls[controlName].hasError(errorName):false;
  };


  isEquipment=true;
  isBoiler=false;


  ngOnInit(): void {
   this.getListing();
   //this.getProject();
   this.getGlobalStatus();
   this.getSection();
  }

  projects:any;
  // getProject() {
  //   this.api
  //     .getAPI(environment.API_URL + "transaction/psr/concept_design/global_master")
  //     .subscribe((res) => {
  //       this.projects = res.data;
  //       console.log(this.projects,"#######")
  //     });
  // }
  public FinalArray = [];

  getProject(code) {
    this.api
      .getAPI(environment.API_URL + "transaction/psr/concept_design/global_master")
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
    .getAPI(environment.API_URL + "transaction/psr/incorporation_of_design_inputs")
    .subscribe((res) => {
      this.dataSourcePending = new MatTableDataSource(res.data);
      this.dataListPending = res.data;
      this.getProject;
      this.dataSourcePending.paginator = this.paginationPending;
      this.logger.log('incorporation_of_design_inputs',res.data)
    });
  }

  responsibilities:any;
  compartmentsList:any
  equipmentsList:any
  systemsList:any
   currentProject='';
  public crudForm = new FormGroup({
    id: new FormControl(""),
    project_id: new FormControl("",[Validators.required]),
    cost_estimation: new FormControl("",[Validators.required]),


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

  saveIncorporation()
  {
    console.log(this.crudForm);
    if(this.crudForm.valid)
    {
      this.api.postAPI(environment.API_URL + "transaction/save_incorporation",this.crudForm.value).subscribe((res) => {
        if(res.status==environment.SUCCESS_CODE){
            this.notification.success(res.message);
            closeModal('#crud-countries');
            this.getListing();
          } else if(res.status==environment.ERROR_CODE) {
            this.notification.displayMessage(res.message);
          } else {
            this.notification.displayMessage(language[environment.DEFAULT_LANG].unableSubmit);
          }
      });
    }

  }
  generalRef=""
  onProjectHandler(project_id=''){
    if(project_id!='')
    {
      this.currentProject=project_id;
      console.log('this.currentProject',this.currentProject);
      this.api.postAPI(environment.API_URL + "transaction/get_responsibility_section",{project_id:project_id}).subscribe((res) => {
          let sections=res.sections;
          for(let i=0;i<sections.length;i++)
          {
            this.addSection(sections[i]);
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
          console.log('crudForm',this.crudForm);
          // this.sections=res.sections;
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

  sections(): FormArray {
    return this.crudForm.get("sections") as FormArray
  }

  newSection(section:any): FormGroup {
    return new FormGroup({
      id: new FormControl((section.id?(section.id):'')),
      name: new FormControl((section.name?(section.name):'')),
      standards: new FormControl((section.standards?(section.standards):'')),
      whole_ship_features: new FormControl((section.whole_ship_features?section.whole_ship_features:'')),
      man_power: new FormControl((section.man_power?section.man_power:'')),
      units:new FormArray([])
    });
  }
  addSection(section='') {
    this.sections().push(this.newSection(section));
  }

  removeSection(sectionIndex:number) {
    this.sections().removeAt(sectionIndex);
  }

  sectionUnit(sectionIndex:number) : FormArray {
    return this.sections().at(sectionIndex).get("units") as FormArray
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
    console.log('compartment',compartment);
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
  editOption(country) {
    this.isReadonly=false;
    this.editForm.enable();
    this.getProject("edit");
    this.editForm.controls['project'].disable();
    this.pro=true;
    this.crudName = "Submit";
    this.logger.info(country);
    this.populate(country);
    this.editorConfig.editable=true;

  }
  viewTrial:any;
  onView(country) {
    
    this.isReadonly=true;
    this.crudName = 'View';
    this.getProject("view");
    this.viewTrial=country;
    this.isReadonly=true;
    this.crudForm.disable();
    this.populate(country);
    this.editorConfig.editable=false;
   

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

  approval(conceptDesign) {

    this.editFormApproval.patchValue({
      id: conceptDesign.id,
      project: conceptDesign.project.id,
      approved_status: conceptDesign.approved_status,
      approved_by_name: conceptDesign.created_by.first_name+' '+conceptDesign.created_by.last_name,
      approved_by: conceptDesign.created_by.id,
      approved_remark: conceptDesign.approved_remark,
      approved_on: formatDate(new Date(), 'yyyy-MM-dd', 'en')
    });

  }

  onSubmitApproval() {
    if (this.editFormApproval.valid) {
      this.api
      .postAPI(
        environment.API_URL + "transaction/psr/incorporation_of_design_inputs/crud",
        this.editFormApproval.value
      )
      .subscribe((res) => {
        this.logger.log('response',res);
        if(res.status==environment.SUCCESS_CODE){
          this.notification.success(res.message);
          this.notification.warn('PSR Incorporation Of Design Inputs Approval Updated');
          this.getListing();
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



  onDelete(data) {
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: language[environment.DEFAULT_LANG].confirmMessage
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.api.postAPI(environment.API_URL + "transaction/psr/incorporation_of_design_inputs/crud", {
          id: data.id,
          status: 3,
          project:data.project.id
        }).subscribe((res)=>{
          this.logger.log('response',res);
          if(res.status==environment.SUCCESS_CODE) {
            this.logger.info('delete')
            this.notification.warn('Psr incorporation of design inputs '+language[environment.DEFAULT_LANG].deleteMsg);
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

    console.log("#########",this.editForm.value)

     if (this.editForm.valid) {
      this.editForm.value.created_by = this.api.userid.user_id;
      this.editForm.value.status = this.editForm.value.status==true ? 1 : 2;
      this.api
        .postAPI(
          environment.API_URL + "transaction/psr/incorporation_of_design_inputs/crud",
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
    this.api
      .getAPI(environment.API_URL + "transaction/psr/responsibility_list?project_id="+this.projectid)
      .subscribe((res) => {
        this.responsibility = res.data;
        //console.log(this.responsibility,"res")
      });
  }
  projectid:any;
  openPopup(id) {
    this.projectid=id;
    //console.log('id',this.projectid)
    openModal('#responsibility-modal');
    setTimeout(()=> {
      this.getResponsibilities();
     }, 2000);


  }
  public editFormSendMail = new FormGroup({
    id: new FormControl(""),
    incorporation_of_design_inputs: new FormControl("", [Validators.required]),
    to_email: new FormControl("", [Validators.required]),
    subject: new FormControl("", [Validators.required]),
    comments: new FormControl("",[Validators.required]),
    file_name: new FormControl("",[Validators.required]),

  });

  senEmail(incorporation) {
    console.log(incorporation,'WWWWWWw')
    this.editFormSendMail.patchValue({
      incorporation_of_design_inputs: incorporation.id,
      status: "1",
    });

  }


  onSubmitSendEmail(){


    if (this.editFormSendMail.valid) {

      const formData = new FormData();
      formData.append('id','');
      formData.append('incorporation_of_design_inputs',this.editFormSendMail.value.incorporation_of_design_inputs);
      formData.append('to_email', this.editFormSendMail.value.to_email);
      formData.append('subject', this.editFormSendMail.value.subject);
      formData.append('comments', this.editFormSendMail.value.comments);
      formData.append('file_name', this.fileSendMailToUpload);
      formData.append('created_by', this.api.userid.user_id);
      formData.append('status', '1')

      this.api
        .postAPI(
          environment.API_URL + "transaction/psr/incorporation_of_design_inputs_send_email/crud",
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
  getDocumentListing(incorporation) {

    //alert(initiation.id)
    this.api
      .getAPI(environment.API_URL + "transaction/psr/incorporation_of_design_inputs_document?status=1&incorporation_of_design_inputs="+incorporation.id)
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

   onDeleteDocument(incorporation) {
    //alert(id)
    //return false;
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: language[environment.DEFAULT_LANG].confirmMessage
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.api.postAPI(environment.API_URL + "transaction/psr/incorporation_of_design_inputs_document/crud", {
          id: incorporation.id,
          status: 3,
          document_name: incorporation.document_name,
          document_remark: incorporation.document_remark
        }).subscribe((res)=>{
          this.logger.log('response',res);
          if(res.status==environment.SUCCESS_CODE) {
            this.logger.info('delete')
            this.notification.warn('Document '+language[environment.DEFAULT_LANG].deleteMsg);

            let incorporation_id = this.editFormDocument.value.incorporation_of_design_inputs;
            //alert(initiation_id);
            this.getDocumentListing({id:incorporation_id});

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
    incorporation_of_design_inputs: new FormControl("", [Validators.required]),
    document_name: new FormControl("", [Validators.required]),
    document_remark: new FormControl("",[Validators.required]),
    file_name: new FormControl("",[Validators.required]),

  });

  document(incorporation) {
    this.localform.submitted=false;
    this.showError = false;
    this.getDocumentListing(incorporation)


    this.editFormDocument.patchValue({
      incorporation_of_design_inputs: incorporation.id,
      status: "1",
    });
  }

  onSubmitDocument() {
    this.showError = true ;
    if (this.editFormDocument.valid) {

      const formData = new FormData();
      formData.append('id','');
      formData.append('incorporation_of_design_inputs', this.editFormDocument.value.incorporation_of_design_inputs);
      formData.append('document_name', this.editFormDocument.value.document_name);
      formData.append('document_remark', this.editFormDocument.value.document_remark);
      formData.append('file_name', this.fileToUpload);
      formData.append('status', '1')

      //console.log(formData);
      //return false;

      this.api
      .postAPI(
        environment.API_URL + "transaction/psr/incorporation_of_design_inputs_document/crud",
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

          let incorporation_id = this.editFormDocument.value.incorporation_of_design_inputs;
          this.getDocumentListing({id:incorporation_id});

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

  currentSection:any;
  currentUnit:any;
  currentProjectResponsibility:any;


  openResponsibility(data)
  {
    this.currentProjectResponsibility=data.project.id;
    openModal('#responsibility-modal');
  }

  onClickSection(section)
  {
    this.currentUnit=null;
    this.currentSection=section;
    console.log();
    console.log('section',section);
  }
  onClickUnit(unit)
  {
    this.currentUnit=unit;
    this.getResponsibility();
    console.log('unit',unit);

  }
  psr_sections:any;
  getSection() {
    this.api
      .getAPI(environment.API_URL + "transaction/psr/sectionlist?status=1")
      .subscribe((res) => {
        this.psr_sections = res.data;
      });
  }
  cCompartments=[];
  cEquipments=[];
  cSystems=[];
  getResponsibility()
  {
    let project_id=this.currentProjectResponsibility;
    let section_unit_id=this.currentUnit?this.currentUnit.id:'';
    let formData={project_id:project_id,section_unit_id:section_unit_id}
    this.api.postAPI(environment.API_URL + "transaction/get_responsibility_other",formData).subscribe((res) => {
      console.log('res',res);
      if(res.status==environment.SUCCESS_CODE)
      {
        this.cCompartments=res.compartments;
        this.cEquipments=res.equipments;
        this.cSystems=res.systems;
      }
    });
  }
  close(){
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

  Emailclose(){
    this.editFormSendMail.reset();
  }
  Approvalclose(){
   this.editFormApproval.reset();
  }
  Documentclose(){
     closeModal('#upload-modal');
    this.editFormDocument.reset();
    this.showError=false;
    let reset = this.formGroupDirective.resetForm();
      if(reset!==null) {
        this.initForm();
      }
  }
}