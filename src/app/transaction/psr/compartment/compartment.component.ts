import { Component, OnInit, ViewChild,ViewChildren, Input, Output, ElementRef, Renderer2, EventEmitter } from '@angular/core';
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

@Component({
  selector: 'app-compartment',
  templateUrl: './compartment.component.html',
  styleUrls: ['./compartment.component.scss']
})
export class CompartmentComponent implements OnInit {

  constructor(public api: ApiService, private notification : NotificationService,
    private dialog:MatDialog, private router : Router, private elementref : ElementRef,private logger:ConsoleService,public aroute: ActivatedRoute, 
    private formBuilder: FormBuilder, private renderer: Renderer2) {
  }

  @Input() fromParent: any;
  @Input() fromParentValue: any;
  @Input() fromParentProjectId: any;
  @Input() pType: any;
  
  @Output() parentFunction:EventEmitter<any> = new EventEmitter()

  //System
  docFormSystem1!: FormGroup;
  itemsSystem1!: FormArray;
  title:string

  ngOnInit(): void {

    if(this.pType==1){
      this.title = "System"
    }else if(this.pType==2){
      this.title = "Equipment"
    }else if(this.pType==3){
      this.title = "Compartment"
    }

   this.getProcess1();
   if(this.fromParentValue!=""){
      this.loadValues(this.fromParentValue, this.fromParentProjectId);
   }
  }
  
  clearFormArray = (formArray: FormArray) => {
    while (formArray.length !== 0) {
      formArray.removeAt(0)
    }
  }

  loadValues(data, projectId) {

    //console.log(data, "DATA", projectId)
    this.itemsSystem1 = this.docFormSystem1.get('itemsSystem1') as FormArray;
    this.clearFormArray(this.itemsSystem1);

    //console.log(this.editForm.value.user_role_id);
    //console.log(data.length,"GGGG")
    if(data.length>0)
    {

      //console.log(data,"ddd")
      //let form_id = '';

      let project_id = '';
      let global_section_id = '';
      let global_sub_section_id = '';
      let global_sub_sub_section_id = '';
      let s_ser = '';
      let s_name = '';
      let s_numbers = '';
      let s_location = '';
      let s_equipment = '';
      let s_features = '';
      let s_layout = '';
      let s_special_requirements = '';
      let s_standards = '';

      for(let i=0;i<data.length;i++)
      {
         project_id = projectId;
         global_section_id = data[i].section_id;
         global_sub_section_id = data[i].sub_section_id;
         global_sub_sub_section_id = data[i].sub_sub_section_id;
         s_ser = data[i].ser;
         s_name = data[i].name;
         s_numbers = data[i].numbers;
         s_location = data[i].location;
         s_equipment = data[i].equipment;
         s_features = data[i].features;
         s_layout = data[i].layout;
         s_special_requirements = data[i].special_requirements;
         s_standards = data[i].standards;

        this.itemsSystem1.push(this.formBuilder.group({
          project_id: project_id,
          global_section_id: global_section_id,
          global_sub_section_id: global_sub_section_id,
          global_sub_sub_section_id: global_sub_sub_section_id,
          s_ser: s_ser,
          s_name: s_name,
          s_numbers: s_numbers,
          s_location: s_location,
          s_equipment: s_equipment,
          s_features: s_features,
          s_layout: s_layout,
          s_special_requirements: s_special_requirements,
          s_standards: s_standards
        }));
      }
    }
    else
    {
      this.itemsSystem1 = this.docFormSystem1.get('itemsSystem1') as FormArray;
      this.itemsSystem1.push(this.formBuilder.group({
          project_id: '',
          global_section_id: '',
          global_sub_section_id: '',
          global_sub_sub_section_id: '',
          s_ser: '',
          s_name: '',
          s_numbers: '',
          s_location: '',
          s_equipment: '',
          s_features: '',
          s_layout: '',
          s_special_requirements: '',
          s_standards: ''
      }));
    }
  }

  getProcess1() {
      this.docFormSystem1 = new FormGroup({
          itemsSystem1: new FormArray([]),
          //ship_id :new FormArray([]),
      });
  }

  addMoreSystem1(fromParent, fromParentProjectId): void {
    //alert(fromParentProjectId)

    //openModal('#sec-modal');
    this.itemsSystem1 = this.docFormSystem1.get('itemsSystem1') as FormArray;
    this.itemsSystem1.push(this.createItemSystem1(fromParent, fromParentProjectId));
    //console.log(this.items)
  }

  removeItemSystem1(i): void {

    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: language[environment.DEFAULT_LANG].confirmMessage
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {

    this.itemsSystem1.removeAt(i);
    /*delete this.items.value[i];
    delete this.items.controls[i];*/
    console.log(this.itemsSystem1)
    this.parentFunction.emit(this.itemsSystem1.value)
    this.apiCall();
          }
      dialogRef=null;
    });
  }

    createItemSystem1(fromParent, fromParentProjectId): FormGroup {
    return this.formBuilder.group({

       project_id : fromParentProjectId,
       global_section_id: fromParent[0].global_section_id,
       global_sub_section_id: fromParent[0].global_sub_section_id,
       global_sub_sub_section_id: fromParent[0].global_sub_sub_section_id,
       s_ser:'',
       s_name:'',
       s_numbers:'',
       s_location:'',
       s_equipment:'',
       s_features:'',
       s_layout:'',
       s_special_requirements:'',
       s_standards:''
    });
  }

  itemsSystemFinal:any
  keyPress(){
    this.apiCall()
  }

  onSelectCh(){
    this.apiCall()
  }

  apiCall(){
      this.api.postAPI(environment.API_URL + "transaction/global/system_equipment_compartment_temp/save",{system_equ_comp:this.itemsSystem1.value, p_type:this.pType}).subscribe((res) => {
      this.api.displayLoading(false)
      if(res.status==environment.SUCCESS_CODE)
      {
        console.log(res.status)
      }
      else
      {
      }
    });
  }

}