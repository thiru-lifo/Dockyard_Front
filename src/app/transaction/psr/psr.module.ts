import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MaterialModule } from '../../material/material.module';
import { SharedModule } from '../../shared/shared.module';
import { ReactiveFormsModule, FormsModule} from '@angular/forms';


import { AngularEditorModule } from '@kolkov/angular-editor';
import { PsrRoutingModule } from './psr-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { InitiationNotesComponent } from './initiation-notes/initiation-notes.component';
import { FormulationPaperComponent } from './formulation-paper/formulation-paper.component';
import { PresentationPaperComponent } from './presentation-paper/presentation-paper.component';
import { InputsSrComponent } from './inputs-sr/inputs-sr.component';
import { ConceptDesignComponent } from './concept-design/concept-design.component';
import { IncorporationComponent } from './incorporation/incorporation.component';
import { ReceiptRfiComponent } from './receipt-rfi/receipt-rfi.component';
import { ListComponent } from './project-list/list.component';

import { TemplateGenerationComponent } from './template-generation/template-generation.component';
import { GTFormulationPaperComponent } from './gt-formulation-paper/gt-formulation-paper.component';
import { GTInputsSRComponent } from './gt-inputs-sr/gt-inputs-sr.component';

import { GTConceptDesignComponent } from './gt-concept-design/gt-concept-design.component';
import { GTIncorporationComponent } from './gt-incorporation/gt-incorporation.component';
import { GTReceiptRFIComponent } from './gt-receipt-rfi/gt-receipt-rfi.component';
import { DocumentGenerationComponent } from './document-generation/document-generation.component';
//import { GlsDocumentGenerationComponent } from './gls-document-generation/gls-document-generation.component';
import { VersionComponent } from './version/version.component';




@NgModule({
  declarations: [
    DashboardComponent,
    InitiationNotesComponent,
    FormulationPaperComponent,
    PresentationPaperComponent,
    InputsSrComponent,
    ConceptDesignComponent,
    IncorporationComponent,
    ReceiptRfiComponent,
    ListComponent,
    TemplateGenerationComponent,
    GTFormulationPaperComponent,
    GTInputsSRComponent,
    GTConceptDesignComponent,
    GTIncorporationComponent,
    GTReceiptRFIComponent,
    DocumentGenerationComponent,
    //GlsDocumentGenerationComponent
    VersionComponent,
  ],
  imports: [
    CommonModule,
    PsrRoutingModule,
    NgbModule,
    AngularEditorModule,
    MaterialModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,

  ]
})
export class PsrModule { }
