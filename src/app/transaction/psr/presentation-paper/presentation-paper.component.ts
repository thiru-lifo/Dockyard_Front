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
import { of } from 'rxjs';
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
  selector: 'app-presentation-paper',
  templateUrl: './presentation-paper.component.html',
  styleUrls: ['./presentation-paper.component.scss']
})
export class PresentationPaperComponent implements OnInit {

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
    "project_url",
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
  filterValue:any;
  isReadonly=false;
  moduleAccess:any;
  ErrorMsg:any;
  error_msg=false;
  moment=moment;
  showError=false;

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
  @ViewChild('localform')localform:HTMLFormElement;
  constructor(public api: ApiService, private notification : NotificationService,
    private dialog:MatDialog, private router : Router, private elementref : ElementRef,private logger:ConsoleService,public aroute: ActivatedRoute) {
  }




  public editForm1 = new FormGroup({
    id: new FormControl(""),
    //project: new FormControl("",[Validators.required]),
    primary_role: new FormControl("",[Validators.required]),
    secondary_role: new FormControl("",[Validators.required]),
    budget: new FormControl("",[Validators.required]),
    standard: new FormControl("",[Validators.required]),
    manpower_induction: new FormControl("",[Validators.required]),
    quantity: new FormControl("",[Validators.required]),
    acquisition_method: new FormControl("",[Validators.required]),
    remarks: new FormControl("",[Validators.required]),
  });

  public editForm = new FormGroup({
    id: new FormControl(""),
    project: new FormControl("",[Validators.required]),
    file_name: new FormControl("",[Validators.required])
});

file_url : any;
  populate(data) {
    console.log(data,"data111");
    //this.editForm.patchValue(data);
    this.editForm.patchValue({project:data.project.id});
    this.editForm.patchValue({id:data.id});
    this.file_url =data.file_name;

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


  isEquipment=true;
  isBoiler=false;


  ngOnInit(): void {
   this.getListing();
   //this.getProject();
   this.getGlobalStatus();
   this.getAccess();
  }


  global_statuses:any;
  getGlobalStatus() {
    this.api
      .getAPI(environment.API_URL + "master/status?status=1")
      .subscribe((res) => {
        this.global_statuses = res.data;
      });
  }

  projects:any;
 public FinalArray = [];

getProject(code) {
  this.api
    .getAPI(environment.API_URL + "transaction/psr/formulation_of_approach_paper/global_master")
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

  FileUrl:any;
  filenameurl:any;
  getListing()
  {
    this.api
      .getAPI(environment.API_URL + "transaction/psr/presentation_of_approach_paper")
      .subscribe((res) => {
        this.dataSourcePending = new MatTableDataSource(res.data);
        this.dataListPending = res.data;
      this.FinalArray=[];
        this.getProject;
        for (let i=0;i<this.dataListPending.length;i++){
             var file=this.dataListPending[i].file_name;
            //  console.log('dfd',file)
           var file1= file.split('/').pop();
          //  console.log('dfd',file1)
            }
          // console.log('dsf',file1)
        this.dataSourcePending.paginator = this.paginationPending;
        this.logger.log('presentation_of_approach_paper',res.data)
        var File=environment.API_URL;
        this.FileUrl = File.substring(0,File.length-1) ;
            // console.log(this.FileUrl);


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
  editOption(presentation) {
    this.isReadonly=false;
    this.pro=true;
    this.editForm.enable();
    this.getProject("edit");
    this.crudName = "Submit";
    this.logger.info(presentation);
    this.populate(presentation);
    this.editForm.controls['project'].disable();

  }
  viewTrial:any;
  onView(presentation) {
    this.crudName = 'View';
    this.getProject("view");
    this.viewTrial=presentation;
    this.isReadonly=true;
    this.editForm.disable();
    this.populate(presentation);
    this.editorConfig.editable=true;

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

  approval(presentation) {

    //console.log('@@@@@',presentation);
    this.editFormApproval.patchValue({
      id: presentation.id,
      project: presentation.project.id,
      approved_status: presentation.approved_status,
      approved_by_name: presentation.created_by.first_name+' '+presentation.created_by.last_name,
      approved_by: presentation.created_by.id,
      approved_remark: presentation.approved_remark,
      approved_on: formatDate(new Date(), 'yyyy-MM-dd', 'en')
    });

  }


  onSubmitApproval() {
    if(this.editFormApproval.value.approved_remark==null){
       this.notification.displayMessage(language[environment.DEFAULT_LANG].Remark);
    }else{
    if (this.editFormApproval.valid) {
      this.api
      .postAPI(
        environment.API_URL + "transaction/psr/presentation_of_approach_paper/crud",
        this.editFormApproval.value
      )
      .subscribe((res) => {
        this.logger.log('response',res);
        if(res.status==environment.SUCCESS_CODE){
          this.notification.success(res.message);
          this.notification.warn('PSR Presentation Of Approach Paper Approval Updated');
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
}

  // Upload Part


  getDocumentListing(presentation) {

    //alert(presentation.id)
    this.api
      .getAPI(environment.API_URL + "transaction/psr/presentation_of_approach_paper_document?status=1&presentation_of_approach_paper="+presentation.id)
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

  onDeleteDocument(presentation) {
  //alert(id.id)
  //return false;
  let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
    width: '350px',
    data: language[environment.DEFAULT_LANG].confirmMessage
  });
  dialogRef.afterClosed().subscribe(result => {
    if(result) {
      this.api.postAPI(environment.API_URL + "transaction/psr/presentation_of_approach_paper_document/crud", {
        id: presentation.id,
        status: 3,
        document_name: presentation.document_name,
        document_remark: presentation.document_remark
      }).subscribe((res)=>{
        this.logger.log('response',res);
        if(res.status==environment.SUCCESS_CODE) {
          this.logger.info('delete')
          this.notification.warn('Document '+language[environment.DEFAULT_LANG].deleteMsg);

          let presentation_of_approach_paper = this.editFormDocument.value.presentation_of_approach_paper;
          //alert(initiation_id);
          this.getDocumentListing({id:presentation_of_approach_paper});

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
    presentation_of_approach_paper: new FormControl("", [Validators.required]),
    document_name: new FormControl("", [Validators.required]),
    document_remark: new FormControl("",[Validators.required]),
    file_name: new FormControl("",[Validators.required]),

  });

  document(presentation) {
    this.localform.submitted=false;
    this.showError = false;

    console.log('##',presentation);
    this.getDocumentListing(presentation)

    //console.log('@@@@@',initiation);
    this.editFormDocument.patchValue({
      presentation_of_approach_paper: presentation.id,
      status: "1",
    });
  }

  onSubmitDocument() {

    this.showError = true;
    if (this.editFormDocument.valid) {

      const formData = new FormData();
      formData.append('id','');
      formData.append('presentation_of_approach_paper', this.editFormDocument.value.presentation_of_approach_paper);
      formData.append('document_name', this.editFormDocument.value.document_name);
      formData.append('document_remark', this.editFormDocument.value.document_remark);
      formData.append('file_name', this.fileToUploadDocument);
      //formData.append('created_by', this.api.userid.user_id)
      formData.append('status', '1')

      //console.log(formData);
      //return false;

      this.api
      .postAPI(
        environment.API_URL + "transaction/psr/presentation_of_approach_paper_document/crud",
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

          let presentation_of_approach_paper_id = this.editFormDocument.value.presentation_of_approach_paper;
          this.getDocumentListing({id:presentation_of_approach_paper_id});

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
  presentation_of_approach_paper: new FormControl("", [Validators.required]),
  to_email: new FormControl("", [Validators.required]),
  subject: new FormControl("", [Validators.required]),
  comments: new FormControl("",[Validators.required]),
  file_name: new FormControl("",[Validators.required]),

});

senEmail(presentation) {
  console.log(presentation,'WWWWWWw')

  this.editFormSendMail.patchValue({
    presentation_of_approach_paper: presentation.id,
    status: "1",
  });

}


onSubmitSendEmail(){

if (this.editFormSendMail.valid) {
//alert('@@@@@@@@@');
//return false;
  const formData = new FormData();
  formData.append('id','');
  formData.append('presentation_of_approach_paper', this.editFormSendMail.value.presentation_of_approach_paper);
  formData.append('to_email', this.editFormSendMail.value.to_email);
  formData.append('subject', this.editFormSendMail.value.subject);
  formData.append('comments', this.editFormSendMail.value.comments);
  formData.append('file_name', this.fileSendMailToUpload);
  formData.append('created_by', this.api.userid.user_id);
  formData.append('status', '1')

  this.api
    .postAPI(
      environment.API_URL + "transaction/psr/presentation_of_approach_paper_send_email/crud",
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

        //res.data['type']='edit';

      this.editFormSendMail.get('to_email').reset();
      this.editFormSendMail.controls['subject'].reset();
      this.editFormSendMail.controls['comments'].reset();
      this.editFormSendMail.controls['file_name'].reset();
      this.closebuttonemail.nativeElement.click();
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
        this.api.postAPI(environment.API_URL + "transaction/psr/presentation_of_approach_paper/crud", {
          id: data.id,
          status: 3,
          project: data.project.id
        }).subscribe((res)=>{
          this.logger.log('response',res);
          if(res.status==environment.SUCCESS_CODE) {
            this.logger.info('delete')
            this.getListing();
            this.notification.warn('Presentation Of Approach Paper '+language[environment.DEFAULT_LANG].deleteMsg);

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
this.editForm.value.file_name==''
    console.log("#########",this.editForm.value)

     if (this.editForm.valid) {
      // this.editForm.value.created_by = this.api.userid.user_id;
      // this.editForm.value.status = this.editForm.value.status==true ? 1 : 2;

      const formData = new FormData();
      formData.append('id',this.editForm.value.id);
      formData.append('project', this.editForm.value.project);
      formData.append('file_name', this.fileToUpload);
      formData.append('created_by', this.api.userid.user_id)

      //console.log(formData, '@@@@@@@@@@')
      //return false;
      this.api
        .postAPI(
          environment.API_URL + "transaction/psr/presentation_of_approach_paper/crud",
          formData
        )
        .subscribe((res) => {
          this.logger.log('response',res);
          //this.error= res.status;
          if(res.status==environment.SUCCESS_CODE){
            // this.logger.log('Formvalue',this.editForm.value);
            this.notification.success(res.message);

            this.editForm.controls['project'].reset();
            this.editForm.controls['file_name'].reset();

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

  fileToUploadDocument: File | null = null;
  onDocumentFileHandler(event) {
    console.log(event,event.target.files[0])
    if (event.target.files.length > 0) {
      this.fileToUploadDocument= event.target.files[0];
      // console.log("ghjgjhri",file);
      // this.form.patchValue({files:file});
     };

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

close(){
  this.FinalArray=[];
  let reset = this.formGroupDirective.resetForm();
  if(reset!==null) {
    this.initForm();
  }
  this.editForm.reset();
}
add(){
  this.showError = false;
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
  this.editFormDocument.reset();
}

}
