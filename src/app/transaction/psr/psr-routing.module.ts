import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

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
import { DocumentGenerationComponent } from './document-generation/document-generation.component';
//import { GlsDocumentGenerationComponent } from './gls-document-generation/gls-document-generation.component';
import { GTIncorporationComponent } from './gt-incorporation/gt-incorporation.component';
import { GTReceiptRFIComponent } from './gt-receipt-rfi/gt-receipt-rfi.component';



import { GTConceptDesignComponent } from './gt-concept-design/gt-concept-design.component';
import { VersionComponent } from './version/version.component';


const routes: Routes = [

  { path: 'dashboard', component: DashboardComponent, data: { breadcrumb: 'Dashboard'}  },
  { path: 'initiation-notes', component: InitiationNotesComponent, data: { breadcrumb: 'Initiation Notes'}  },
  { path: 'formulation-paper', component: FormulationPaperComponent, data: { breadcrumb: 'Formulation of approach paper'}  },
  { path: 'presentation-paper', component: PresentationPaperComponent, data: { breadcrumb: 'Presentation of approach paper'}  },
  { path: 'inputs-sr', component: InputsSrComponent, data: { breadcrumb: 'Input for staff requirement'}  },
  { path: 'concept-design', component: ConceptDesignComponent, data: { breadcrumb: 'Concept Design'}  },
  { path: 'incorporation', component: IncorporationComponent, data: { breadcrumb: 'Incorporation of design inputs'}  },
  { path: 'receipt-rfi', component: ReceiptRfiComponent, data: { breadcrumb: 'Receipt of RFI responses'}  },
  { path: 'project-list', component: ListComponent, data: { breadcrumb: 'Project list'}  },
  { path: 'template-generation/:id', component: TemplateGenerationComponent, data: { breadcrumb: 'Initiation Notes'}  },

  { path: 'document-generation', component: DocumentGenerationComponent, data: { breadcrumb: 'Document generation'}  },
  //{ path: 'gls-document-generation', component: GlsDocumentGenerationComponent, data: { breadcrumb: 'Gls Document generation'}  },
  { path: 'gt-formulation-paper/:id', component: TemplateGenerationComponent, data: { breadcrumb: 'Formulation Of Approach Paper'}  },
  { path: 'gt-presentation-paper/:id', component: TemplateGenerationComponent, data: { breadcrumb: 'Presentation of Approach Paper'}  },

  { path: 'gt-inputs-sr/:id', component: TemplateGenerationComponent, data: { breadcrumb: 'Input for Staff Requirements'}  },
  { path: 'gt-concept-design/:id', component: TemplateGenerationComponent, data: { breadcrumb: 'Concept Design'}  },
  { path: 'gt-incorporation/:id', component: TemplateGenerationComponent, data: { breadcrumb: 'Incorporation of Design Inputs'}  },
  { path: 'gt-receipt-rfi/:id', component: TemplateGenerationComponent, data: { breadcrumb: 'Receipt of RFI Responses'}  },
  
  { path: 'version', component: VersionComponent, data: { breadcrumb: 'Version'}  },

   
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PsrRoutingModule { }
