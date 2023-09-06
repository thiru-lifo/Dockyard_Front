import { Component, OnInit, ViewChild, Input, ElementRef } from "@angular/core";
import { ApiService } from "src/app/service/api.service";
import { environment } from "src/environments/environment";
import { FormGroup, FormControl, Validators, FormBuilder, FormGroupDirective, FormArray } from "@angular/forms";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { NotificationService } from "src/app/service/notification.service";
import { ConfirmationDialogComponent } from "src/app/confirmation-dialog/confirmation-dialog.component";
import { MatDialog } from "@angular/material/dialog";
import { language } from "src/environments/language";
import { Router } from '@angular/router';
import { ConsoleService } from "src/app/service/console.service";
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem
} from "@angular/cdk/drag-drop";
import { moveItemInFormArray } from "./move-item-in-form-array";
declare var arrayColumn:any;
declare var inArray:any;
declare var moment;
@Component({
  selector: 'app-form-mapping',
  templateUrl: './form-mapping.component.html',
  styleUrls: ['./form-mapping.component.scss']
})
export class FormMappingComponent implements OnInit {

 displayedColumns: string[] = [
    "Formname",
    "hierarchy",
    // "hospital",
    "status",
    "view",
    "edit",
    "delete",

  ];
  dataSource: MatTableDataSource<any>;
  moment=moment;
  environment=environment;
  inArray=inArray;
  user: any;
  users:any;
  user_recommender:any;
  user_approver:any;
  crudName = "Add";
  UserList = [];
  trials = [];
  satellite = [];
  ships=[];
  trial_unit:any;
  filterValue:any;
  isReadonly=false;
  moduleAccess:any;
  ErrorMsg:any;
  error_msg=false;
  allSelected=false;
  allSelectedSAT=false;
  isPassword=false;
  form_id_hierarchy:any
  dataCount:boolean

  public permission={
    add:false,
    edit:false,
    view:false,
    delete:false,
  };

  @ViewChild(MatPaginator) pagination: MatPaginator;
  @ViewChild('select') select: MatSelect;
  @ViewChild('selectSAT') selectSAT: MatSelect;
  @ViewChild("closebutton") closebutton;
  @ViewChild("closebutton_recommender") closebutton_recommender;
  @ViewChild("closebutton_approver") closebutton_approver;
  @ViewChild("closebutton_hierarchy") closebutton_hierarchy;  

  @ViewChild(FormGroupDirective) formGroupDirective: FormGroupDirective;
  @ViewChild('userRoleOption') userRoleOption: MatSelect;

  constructor(public api: ApiService, private notification : NotificationService,
    private dialog:MatDialog, private router : Router, private elementref : ElementRef,private logger:ConsoleService,
    private formBuilder: FormBuilder
    ,) {

  }
  docForm!: FormGroup;
  items!: FormArray;

  public editForm =this.formBuilder.group({
    id: new FormControl(""),
    form: new FormControl("", [
      Validators.required]),
    created_by: new FormControl(""),
    modified_by: new FormControl(""),
    status: new FormControl(""),
    formmapping: this.formBuilder.array([]),
  });


   status = this.editForm.value.status;
  
  roleForm!: FormGroup;
  ngOnInit(): void {
   
    this.getFormsMap();
    this.getModule();
    this.getSubmodule();
    this.getSection();
    this.getSubSection();
    this.getSubSubSection();
    this.getAccess();
    this.getFormmappingList();
    this.getClass();
    //this.getUser();
    this.showErrors=false;

  }

  populate(form_id) {

    this.api.displayLoading(true)
     this.api
     .getAPI(environment.API_URL + "transaction/get_form_mapping?form_id="+form_id)
    .subscribe((res) => {
      this.api.displayLoading(false)
      //console.log(res.data,"GEET");

      let data = res.data;

      this.showErrors=false;
      this.clearFormArray(this.formmapping);
      this.editForm.patchValue({form:form_id});
      //this.editForm.patchValue({id:data.id,form:data.form,created_by:data.created_by,modified_by:this.api.userid.user_id,status:data.status});
      //let data_access = data.formmapping.length
      //console.log('fdsfd',data)

      //setTimeout(()=>{
        if(data.length>0)
        {
          for(let i=0;i<data.length;i++)
          {
            this.addformmapping(data[i])                  
          }
        }
      //},2000)

    });    
  }

  // populateOLD(data) {
  //   this.showErrors=false;
  //   this.clearFormArray(this.formmapping);
  //    this.editForm.patchValue({form:data.id});
  //   //this.editForm.patchValue({id:data.id,form:data.form,created_by:data.created_by,modified_by:this.api.userid.user_id,status:data.status});
  //    //let data_access = data.formmapping.length
  //    console.log('fdsfd',data)
  //   if(data.form_mapping.length>0)
  //   {
  //     for(let i=0;i<data.form_mapping.length;i++)
  //     {
  //       this.addformmapping(data.form_mapping[i])
          
                
  //     }
  //   }
    
  // }


  onRoleAdd()
  {
    
      this.addformmapping();
    
  }
  isRequiredField(obj,controlName)
  {
    return obj.controls[controlName].hasError('required');
  }
  
  isCenterSpecific(obj)
  {
    return obj.controls['centreSpecific'].value==1;
  }

  get formmapping() : FormArray {
  return this.editForm.get("formmapping") as FormArray
}
  selectedRoles=[];
 //  newformmapping_OLD(data): FormGroup {
 //   return this.formBuilder.group({
 //      //order: new FormControl((data && data.order && data.order?data.order:'')),
 //      Class: new FormControl((data && data.Class && data.Class.id?data.Class.id:'')),
 //      module: new FormControl((data && data.module && data.module.id?data.module.id:'')),
 //      // region_id: new FormControl(''),
 //      sub_module: new FormControl((data && data.sub_module && data.sub_module.id?data.sub_module.id:'')),
 //      section: new FormControl((data && data.section && data.section.id?data.section.id:'')),
 //      sub_section: new FormControl((data && data.sub_section && data.sub_section.id?data.sub_section.id:'')),
 //      sub_sub_section: new FormControl((data && data.sub_sub_section && data.sub_sub_section.id?data.sub_sub_section.id:'')),
 //   });
 // }

  newformmapping(data): FormGroup {
   return this.formBuilder.group({
      //order: new FormControl((data && data.order && data.order?data.order:'')),
      Class: new FormControl((data && data.Class_id?data.Class_id:'')),
      module: new FormControl((data && data.module_id?data.module_id:'')),
      // region_id: new FormControl(''),
      sub_module: new FormControl((data  && data.sub_module_id?data.sub_module_id:'')),
      section: new FormControl((data && data.section_id?data.section_id:'')),
      sub_section: new FormControl((data && data.sub_section_id?data.sub_section_id:'')),
      sub_sub_section: new FormControl((data && data.sub_sub_section_id?data.sub_sub_section_id:'')),
   });
 }
 clearFormArray = (formArray: FormArray) => {
    while (formArray.length !== 0) {
      formArray.removeAt(0)
    }
  }
  clearHospital()
  {

    this.editForm = new FormGroup({
      roles: new FormArray([])
    });
  }
  addformmapping(data='') {

    // setTimeout(()=>{

    //   this.formmapping.push(this.newformmapping(data));
    // },5)
   this.formmapping.push(this.newformmapping(data));
}

  removeformmapping(i:number){
  this.formmapping.removeAt(i);
}
  

  

  initForm() {
    this.editForm.patchValue({
      status: "1",
    });
  }

  
  Error = (controlName: string, errorName: string) => {
    return this.editForm.controls[controlName].hasError(errorName);
  };

  ErrorHierarchy = (controlName: string, errorName: string) => {
    return this.editHierarchy.controls[controlName].hasError(errorName);
  };

  
  getFormmappingList_OLD() {
    this.api.displayLoading(true)
     this.api
    .getAPI(environment.API_URL + "transaction/forms_mapping")
    .subscribe((res) => {
       this.api.displayLoading(false)
      this.user = res.data;
      console.log('list',this.user)
    });
  }

  getFormmappingList() {
    //this.api.displayLoading(true)
     this.api
     .getAPI(environment.API_URL + "transaction/all_forms?status=1")
    //.getAPI(environment.API_URL + "transaction/forms_mapping")
    .subscribe((res) => {
       //this.api.displayLoading(false)
      this.user = res.data;
      //console.log('list',this.user)
      this.dataSource = new MatTableDataSource(res.data);
      this.dataSource.paginator = this.pagination;
    });
  }

  // getUserRoles(process_id='') {
  //   let searchString='?status=1';
  //   searchString+=process_id?'&process_id='+process_id:'';
  //  this.api
  //   .getAPI(environment.API_URL + "access/access_user_roles"+searchString)
  //   .subscribe((res) => {
  //     this.UserList = res.data;
  //   });
    
  // }

 

  createItem(): FormGroup {
    return this.formBuilder.group({
      //order:'',
      Class:'',
      module: '',
      sub_module:'',
      section:'',
      sub_section:'',
      sub_sub_section:'',
    });
  }

  addMore(): void {
    this.items = this.docForm.get('items') as FormArray;
    this.items.push(this.createItem());
  }

  removeItem(i): void {
    this.items.removeAt(i);
    /*delete this.items.value[i];
    delete this.items.controls[i];*/
  }



  create() {
    this.selectedRoles=[];
    
    this.crudName = "Add";
    this.isPassword = true;
    this.isReadonly=false;
    this.editForm.enable();
    let reset = this.formGroupDirective.resetForm();
    if(reset!==null) {
      this.initForm();
    }
    var element = <HTMLInputElement>document.getElementById("exampleCheck1");
    element.checked = true;
   
  }

  editOption(country) {

    //console.log(country,"editOption")
    //return false;

    this.isReadonly=false
    this.editForm.enable();
    this.isPassword = false;
    this.crudName = "Edit";
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
    this.populate(country);
    var element = <HTMLInputElement> document.getElementById("exampleCheck1");
    if(this.editForm.value.status == 1) {
     element.checked = true;
    }
    else {
     element.checked = false;
    }
  }

  onDelete(id) {
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: language[environment.DEFAULT_LANG].confirmMessage
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.api.postAPI(environment.API_URL + "transaction/forms_mapping_details", {
          id: id,
          status: 3,
        }).subscribe((res)=>{
          if(res.status==environment.SUCCESS_CODE) {
            this.notification.warn('User '+language[environment.DEFAULT_LANG].deleteMsg);
            this.getFormmappingList();
          } else {
            this.notification.displayMessage(language[environment.DEFAULT_LANG].unableDelete);
          }
        });
      }
      dialogRef=null;
    });
  }
  accessArr=[];
  showErrors=false;
  onSubmit() {
    //console.log(this.editForm,'fdfsd')
    this.showErrors=true;
    if (this.editForm.valid) {
    /*console.log('this.editForm',this.editForm);
    console.log('this.roleForm',this.roleForm);*/

    // let data_access =this.roles().value
   
      // this.editForm.value.created_by = this.api.userid.user_id;
      //this.editForm.value.status = this.editForm.value.status==true ? 1 : 2;
      this.editForm.value.status = 1;
    //console.log('cfcc',this.editForm.value)
    //return false;
    this.api.displayLoading(true)
      this.api
        .postAPI(
          environment.API_URL + "transaction/forms_mapping_details",
          this.editForm.value
        )
        .subscribe((res) => {

          this.api.displayLoading(false)

          if(res.status==environment.SUCCESS_CODE){
            this.notification.success(res.message);
            // this.api.displayLoading(true)
            this.getFormmappingList();
            // this.api.displayLoading(false)
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
      this.getFormmappingList();
    }
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

   toggleAllSelectionSAT() {
    if (this.allSelectedSAT) {
      this.selectSAT.options.forEach((item: MatOption) => item.select());
    } else {
      this.selectSAT.options.forEach((item: MatOption) => item.deselect());
    }
  }
  optionClickSAT() {
    let newStatus = true;
    this.selectSAT.options.forEach((item: MatOption) => {
      if (!item.selected) {
        newStatus = false;
      }
    });
    this.allSelectedSAT = newStatus;
  }
  forms=[];
  forms_map=[];
  module=[];
  submodule=[];
  section=[];
  subsection=[];
  subsubsection=[];
  classes=[];
  getClass() {
    this.api
      .getAPI(environment.API_URL + "master/class")
      .subscribe((res) => {
        
        this.classes = res.data;
        
      });
  
  }
  getSubmodule(module_id='') {
    let searchString='?status=1';
    searchString+=module_id?'&module_id='+module_id:'&order_type=asc';
    // searchString+=region_id?'&region_id='+region_id:'';
      let id=event;
      //this.api.getAPI(environment.API_URL + "master/sub_module"+searchString).subscribe((res)=> {
      this.api.getAPI(environment.API_URL + "master/sub_module_form_mapping"+searchString).subscribe((res)=> {
      
        this.submodule = res.data;
    });

  }
  

 
  getSection(module_id='') {
    let searchString='?status=1';
    searchString+=module_id?'&module_id='+module_id:'&order_type=asc';
    // searchString+=region_id?'&region_id='+region_id:'';
    //this.api.getAPI(environment.API_URL + "master/global_section"+searchString).subscribe((res)=> {
    this.api.getAPI(environment.API_URL + "master/global_section_form_mapping"+searchString).subscribe((res)=> {
      
        this.section = res.data;
    });

  }
  getSubSection(module_id='') {
    let searchString='?status=1';
    searchString+=module_id?'&module_id='+module_id:'&order_type=asc';
    // searchString+=region_id?'&region_id='+region_id:'';
    //this.api.getAPI(environment.API_URL + "master/global_sub_section"+searchString).subscribe((res)=> {
    this.api.getAPI(environment.API_URL + "master/global_sub_section_form_mapping"+searchString).subscribe((res)=> {
      
        this.subsection = res.data;
        console.log(this.subsection,'dddddddd')
    });

  }
  getSubSubSection(module_id='') {
    let searchString='?status=1';
    searchString+=module_id?'&module_id='+module_id:'&order_type=asc';
    // searchString+=region_id?'&region_id='+region_id:'';
    //this.api.getAPI(environment.API_URL + "master/global_sub_sub_section"+searchString).subscribe((res)=> {
    this.api.getAPI(environment.API_URL + "master/global_sub_sub_section_form_mapping"+searchString).subscribe((res)=> {
      
      this.subsubsection = res.data;
       console.log(this.subsubsection,'dd1111d')
    });
  } 

  getModule() {
      this.api
      //.getAPI(environment.API_URL + "master/module?status=1")
      .getAPI(environment.API_URL + "master/module_form_mapping")
      .subscribe((res)=> {
        this.module = res.data;
    });

   }
getforms_OLD() {
      this.api
      .getAPI(environment.API_URL + "transaction/forms?status=1")
      .subscribe((res)=> {
        this.forms = res.data;
        this.dataSource = new MatTableDataSource(res.data);
        this.dataSource.paginator = this.pagination;
    });

   }

getforms(form_id) {
  this.api
  .getAPI(environment.API_URL + "transaction/all_forms?status=1&id="+form_id)
  .subscribe((res)=> {
    this.forms = res.data;
  });

}

getFormsMap() {
  this.api
  .getAPI(environment.API_URL + "transaction/all_forms?status=1")
  .subscribe((res)=> {
    this.forms_map = res.data;
  });

}



  drop(event: CdkDragDrop<string[]>) {
    moveItemInFormArray(
      this.formmapping,
      event.previousIndex,
      event.currentIndex
    );
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


  getUser(form) {
    let form_id = form
     this.api
    //.getAPI(environment.API_URL + "api/auth/users_hierarchy?status=1")
     .getAPI(environment.API_URL + "api/auth/users_hierarchy?form_id="+form_id)
    .subscribe((res) => {
      //this.users = res.data;
      this.user_recommender = res.data.user_recommender;
      this.user_approver = res.data.user_approver;
      //console.log('user',this.user)
    });
  }


  
  public editHierarchy = this.formBuilder.group({
    id: new FormControl(""),
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
    //console.log(user,"USER")
    this.populateHierarchy(form.id)
    this.getforms(form.id)
    this.getUser(form.id)
  }


  populateHierarchy(form_id) {

    //console.log(form_id,"Sample")

    this.api.displayLoading(true)
     this.api
     .getAPI(environment.API_URL + "transaction/get_form_level_hierarchy?form_id="+form_id)
    .subscribe((res) => {
      this.api.displayLoading(false)

      let recommender_data = res.data.recommender;
      let approver_data = res.data.approver;

      console.log(recommender_data,"Form level recommender_data")
      console.log(approver_data,"Form level approver_data")

      this.showErrors=false;
      this.clearHierarchyFormArray(this.recommender);
      this.clearHierarchyFormArray(this.approver);
      this.editHierarchy.patchValue({form_hierarchy:form_id});
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

  // Recommender ///
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
    //console.log(this.editHierarchy,'fdfsd')
    //return false;
    this.showErrors=true;
    if (this.editHierarchy.valid) {
    //console.log(this.editHierarchy,'fdfsd')
    //return false;
    /*console.log('this.editForm',this.editForm);
    console.log('this.roleForm',this.roleForm);*/

    // let data_access =this.roles().value
   
    // this.editForm.value.created_by = this.api.userid.user_id;
    //this.editForm.value.status = this.editForm.value.status==true ? 1 : 2;
    this.editHierarchy.value.status = 1;
    //console.log('cfcc',this.editRecommenderHierarchy.value)
    //return false;
    this.api.displayLoading(true)
      this.api
        .postAPI(
          environment.API_URL + "transaction/forms_level_hierarchy_details",
          this.editHierarchy.value
        )
        .subscribe((res) => {

          this.api.displayLoading(false)
          if(res.status==environment.SUCCESS_CODE){
            this.notification.success(res.message);
            // this.api.displayLoading(true)
            this.getFormmappingList();
            // this.api.displayLoading(false)
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
    //this.addApprover();
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

}