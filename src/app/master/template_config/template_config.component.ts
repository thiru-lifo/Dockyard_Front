import { Component, OnInit, ViewChild, ViewChildren, Input, ElementRef } from "@angular/core";
import { ApiService } from "src/app/service/api.service";
import { environment } from "src/environments/environment";
//import { FormGroup, FormControl, Validators, FormGroupDirective } from "@angular/forms";

import { FormGroup, FormControl, Validators, FormBuilder, FormGroupDirective, FormArray } from "@angular/forms";

import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { NotificationService } from "src/app/service/notification.service";
import { ConfirmationDialogComponent } from "src/app/confirmation-dialog/confirmation-dialog.component";
import { MatDialog } from "@angular/material/dialog";
import { language } from "src/environments/language";
import { Router } from '@angular/router';
import { ConsoleService } from "src/app/service/console.service";
import { of } from 'rxjs';
declare var arrayColumn:any;
declare var inArray:any;

@Component({
  selector: 'app-template-config',
  templateUrl: './template_config.component.html',
  styleUrls: ['./template_config.component.scss']
})
export class TemplateConfigComponent implements OnInit {

  displayedColumns: string[] = [
    "template",
    //"module",
    //"sub_module",
    //"status",
    "view",
    "edit",
    "delete",

  ];
  dataSource: MatTableDataSource<any>;

  country: any;
  public crudName = "Add";
  public countryList = [];
  filterValue:any;
  filterValue1:any;
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
  
  compartment_value;
  sub_compartment_value;
  sub_sub_compartment_value;

  constructor(public api: ApiService, private notification : NotificationService,
    private dialog:MatDialog, private router : Router, private elementref : ElementRef,private logger:ConsoleService, 
    private formBuilder: FormBuilder) {


    this.compartment_value = "-1";
    // this.sub_compartment_value; = "-1";
    // this.sub_sub_compartment_value = "-1";
  }

  docForm!: FormGroup;
  items!: FormArray;

  public editForm = new FormGroup({
    id: new FormControl(""),
    template: new FormControl("", [
      Validators.required,
    ]),
    // module: new FormControl("", [
    //   Validators.required,
    // ]),
    // sub_module: new FormControl("", [
    //   Validators.required,
    // ]),
    // section: new FormControl(""),
    // sub_section: new FormControl(""),
    // sub_sub_section: new FormControl(""),
    created_by: new FormControl(""),
    created_ip: new FormControl(""),
    modified_by: new FormControl(""),
    //sequence : new FormControl("", [Validators.pattern("^[0-9]*$")]),
    status: new FormControl("", [Validators.required]),
  });
   searchForm= new FormGroup({
    department:new FormControl(""),
    
  })
   status = this.editForm.value.status;

  populate222(data) {
    console.log(data,"data");

    this.editForm.patchValue(data);
    //this.editForm.patchValue({department_id:data.department_id.id});
    //this.editForm.patchValue({department_id:data.department.id});
    /*this.editForm.patchValue({trial_unit:data.trial_unit.id});

    setTimeout(()=>{
      this.editForm.patchValue({command:data.command?data.command.id:''});
    },500);
    let list = data.satellite_units.map(function(a){return a['satellite_unit']['id'];});
    this.editForm.patchValue({satellite_unit:list});*/
    this.editForm.patchValue({modified_by:this.api.userid.user_id});
    this.logger.info(data.status)
  }

  populate(data) {

    this.items = this.docForm.get('items') as FormArray;
    this.clearFormArray(this.items);

    this.editForm.patchValue({
          id:data.id,
          template:data.template.id,
          created_by:data.created_by,
          modified_by:this.api.userid.user_id,
          status:data.status
    });

    
    if(data.details.length>0)
    {
      let module = '';
      let sub_module ='';

      let section_type = '';
      let section_value = '';
      let compartment_value = '';
      let selection_from = '';
      let selection_to = '';

      let sub_section_type = '';
      let sub_section_value = '';
      let sub_compartment_value = '';
      let sub_selection_from = '';
      let sub_selection_to = '';

      let sub_sub_section_type = '';
      let sub_sub_section_value = '';
      let sub_sub_compartment_value = '';
      let sub_sub_selection_from = '';
      let sub_sub_selection_to = '';


      for(let i=0;i<data.details.length;i++)
      {

        module = data.details[i].module.id;
        sub_module = data.details[i].sub_module.id;
        section_type = data.details[i].section_type;
        sub_section_type = data.details[i].sub_section_type;
        sub_sub_section_type = data.details[i].sub_sub_section_type;


        this.getSection(sub_module);

        //console.log(this.getSection(sub_module),"RRRRRRR");
        if(section_type=="1"){
          section_value = data.details[i].section_value;
        }
        if(section_type=="2"){
          compartment_value = data.details[i].compartment_value;
        }
        if(section_type=="3"){
          selection_from = data.details[i].selection_from;
          selection_to = data.details[i].selection_to;
        }

        if(sub_section_type=="1"){
          sub_section_value = data.details[i].sub_section_value;
        }
        if(sub_section_type=="2"){
          sub_compartment_value = data.details[i].sub_compartment_value;
        }
        if(sub_section_type=="3"){
          sub_selection_from = data.details[i].sub_selection_from;
          sub_selection_to = data.details[i].sub_selection_to;
        }

        if(sub_sub_section_type=="1"){
          sub_sub_section_value = data.details[i].sub_sub_section_value;
        }
        if(sub_sub_section_type=="2"){
          sub_sub_compartment_value = data.details[i].sub_sub_compartment_value;
        }
        if(sub_sub_section_type=="3"){
          sub_sub_selection_from = data.details[i].sub_sub_selection_from;
          sub_sub_selection_to = data.details[i].sub_sub_selection_to;
        }


        //  itemDet=this.formBuilder.group({
        // trial_unit_id: data.data_access[i].trial_unit.id,
        //    satellite_unit_id: data.data_access[i].satellite_unit.id,

        //  });
        //trial_unit_id: data.data_access[i].trial_unit.id,
        //console.log('data.data_access[i]',data.data_access[i]);
        // ship_id=[];
        // for(let j=0;j< data.data_access[i].ships.length;j++)
        // {
        //   let sId = data.data_access[i].ships[j].ship['id'];
        //   ship_id.push(sId);
        // }

        // let list = data.data_access[i].ships.map(function(s){console.log("dava",s.ship['id']);return s.ship['id'];})
        // this.docForm.get('ship_id').patchValue({list})
        this.items.push(this.formBuilder.group(
        {
          module: module, 
          sub_module: sub_module,
          section_type: parseInt(section_type),
          sub_section_type: parseInt(sub_section_type),
          sub_sub_section_type: parseInt(sub_sub_section_type),
          
          section_value: section_value,
          compartment_value: compartment_value,
          selection_from: selection_from,
          selection_to: selection_to,

          sub_section_value: sub_section_value,
          sub_compartment_value: sub_compartment_value,
          sub_selection_from: sub_selection_from,
          sub_selection_to: sub_selection_to,

          sub_sub_section_value: sub_sub_section_value,
          sub_sub_compartment_value: sub_sub_compartment_value,
          sub_sub_selection_from: sub_sub_selection_from,
          sub_sub_selection_to: sub_sub_selection_to,
        }));

        // console.log(this.items)
      }
    }
    else
    {
      this.items = this.docForm.get('items') as FormArray;
      this.items.push(this.formBuilder.group(
              {
                module: '', 
                sub_module: '',
                section_type: '',
                sub_section_type: '',
                sub_sub_section_type: '',
              }));
    }
  }



  initForm() {
    this.editForm.patchValue({
      status: "1",
    });
  }

  displaySatelliteUnit(units)
  {
    let satelliteUnits='';
    for(let i=0;i<units.length;i++)
      satelliteUnits+=units[i].satellite_unit.name+' & ';

    return satelliteUnits.substring(0,(satelliteUnits.length)-3);
  }

  Error = (controlName: string, errorName: string) => {
    return this.editForm.controls[controlName].hasError(errorName);
  };

  ngOnInit(): void {
     this.getTemplateConfig();
     this.getAccess();
     //this.getTemplate('add');
     this.getModule();
     this.getSubModule();
     this.getProcess();
     //console.log('asdsd',this.dataSource)
     
  }


  sections:any;
  getSection(sub_module='') {
    //console.log(sub_module,"OOOOOOO")
    this.api
      .getAPI(environment.API_URL + "master/global_section?sub_module="+sub_module+"&status=1")
      .subscribe((res) => {
        this.sections = res.data;
        console.log(this.sections)
      });
  }


//this.countryList
public FinalArray = [];
  templates:any;
  getTemplate(code) {
    this.api
      .getAPI(environment.API_URL + "master/template?status=1")
      .subscribe((res) => {
        this.FinalArray=[]
        this.templates = res.data;

        console.log(this.templates,"##########")
        if(code=="add"){
            console.log('dffadd')
          for (var i = 0; i < res.data.length; ++i) {
             res.data[i].id;
             //alert(this.countryList.length)
            var found = false;

            for (var j = 0; j < this.countryList.length; ++j) {
                if (this.countryList[j].template.id == res.data[i].id) {
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

  modules:any;
  getModule() {
    this.api
      .getAPI(environment.API_URL + "master/module?status=1")
      .subscribe((res) => {
        this.modules = res.data;
      });
  }

  sub_modules:any;
  getSubModule() {
    this.api
      .getAPI(environment.API_URL + "master/sub_module?status=1")
      .subscribe((res) => {
        this.sub_modules = res.data;
      });
  }


  getTemplateConfig() {
    if(this.param==undefined) this.param=""; else this.param;
    this.api
      .getAPI(environment.API_URL + "master/template_config_master?"+this.param)
      .subscribe((res) => {
        this.dataSource = new MatTableDataSource(res.data);
        this.countryList = res.data;
        this.dataSource.paginator = this.pagination;
        this.logger.log('country',this.countryList)
        
        
      });
  }

   //status = this.editForm.value.status;
   clearFormArray = (formArray: FormArray) => {
    while (formArray.length !== 0) {
      formArray.removeAt(0)
    }
  }

  create() {
    this.crudName = "Add";
    this.isReadonly=false;
    this.editForm.enable();
    this.editForm.reset();
    this.getTemplate('add');

    let reset = this.formGroupDirective.resetForm();
    if(reset!==null) {
      this.initForm();
    }
    var element = <HTMLInputElement>document.getElementById("exampleCheck1");
    element.checked = true;

    this.items = this.docForm.get('items') as FormArray;
    this.clearFormArray(this.items);
    this.items.push(this.formBuilder.group({
        module: '',
        sub_module:'',
        
        section_type:'',
        section_value:'',
        compartment_value:'',
        selection_from:'',
        selection_to:'',

        sub_section_type:'',
        sub_section_value:'',
        sub_compartment_value:'',
        sub_selection_from:'',
        sub_selection_to:'',

        sub_sub_section_type:'',
        sub_sub_section_value:'',
        sub_sub_compartment_value:'',
        sub_sub_selection_from:'',
        sub_sub_selection_to:'',
    }));



  }

  editOption(country) {

    console.log(country,"ggggggggg")
    this.isReadonly=false;
    this.editForm.enable();
    this.getTemplate("edit");
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
    this.getTemplate("view");
    this.populate(country);
    var element = <HTMLInputElement> document.getElementById("exampleCheck1");
    if(this.editForm.value.status == 1) {
     element.checked = true;
    }
    else {
     element.checked = false;
    }

    this.docForm.controls['items'].disable();
  }

  onDelete(id) {
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: language[environment.DEFAULT_LANG].confirmMessage
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.api.postAPI(environment.API_URL + "master/template_config_master/delete", {
          id: id,
          status: 3,
        }).subscribe((res)=>{
          this.logger.log('response',res);
          if(res.status==environment.SUCCESS_CODE) {
            this.logger.info('delete')
            this.notification.warn('Template config '+language[environment.DEFAULT_LANG].deleteMsg);
            this.getTemplateConfig();
          } else {
            this.notification.displayMessage(language[environment.DEFAULT_LANG].unableDelete);
          }
        });
      }
      dialogRef=null;
    });
  }




  onSubmit() {

    //console.log(this.editForm)
    //return false;
    let data_access ={'data_access':this.items.value}
     if (this.editForm.valid) {
      this.editForm.value.created_by = this.api.userid.user_id;
      this.editForm.value.status = this.editForm.value.status==true ? 1 : 2;

       let formVal={
        ...this.editForm.value,
        ...data_access

       }

        console.log(formVal);
        //return false;


      this.api
        .postAPI(
          environment.API_URL + "master/template_config/details",
          formVal
        )
        .subscribe((res) => {
          this.logger.log('response',res);
          //this.error= res.status;
          if(res.status==environment.SUCCESS_CODE){
            // this.logger.log('Formvalue',this.editForm.value);
            this.notification.success(res.message);
            this.getTemplateConfig();
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

public dropDownValue = "";

isShown: boolean = false ; // hidden by default

getSectionType(val,i){
  this.isShown = ! this.isShown;
  //alert(i)
  //console.log(this.sComponents)
  // alert(val.value);
  // if(val.value==2){
    
  //   //this.editForm.patchValue({section_value:'1'});
  //   //this.items.patchValue({section_value:'1'});

  // }

      //this.dropDownValue = val.target.value;

}

getSubSectionType(val){}
getSubSubSectionType(val){}



  getProcess() {
      this.docForm = new FormGroup({
          items: new FormArray([]),
          //ship_id :new FormArray([]),

      });
  }

  createItem(): FormGroup {
    return this.formBuilder.group({
      module: '',
       sub_module:'',

        section_type:'',
        section_value:'',
        compartment_value:'',
        selection_from:'',
        selection_to:'',

        sub_section_type:'',
        sub_section_value:'',
        sub_compartment_value:'',
        sub_selection_from:'',
        sub_selection_to:'',

        sub_sub_section_type:'',
        sub_sub_section_value:'',
        sub_sub_compartment_value:'',
        sub_sub_selection_from:'',
        sub_sub_selection_to:'',
    });
  }

  addMore(): void {
    this.items = this.docForm.get('items') as FormArray;
    this.items.push(this.createItem());
    console.log(this.items)
  }

  removeItem(i): void {
    this.items.removeAt(i);
    /*delete this.items.value[i];
    delete this.items.controls[i];*/
    console.log(this.items)
  }






param:any;
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
      this.getTemplateConfig();
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
    search(){
    let type=this.searchForm.value.department?"department_id="+this.searchForm.value.department:"";
    this.param=type;
    this.getTemplateConfig();
  }

 clear(){
    this.searchForm.reset();
    this.param="";
    this.getTemplateConfig();
  }
 chooseCountry(event) {
    //this.getDepartments();
    
  }
}
