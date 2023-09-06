import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
const routes: Routes = [
  {
    path: 'psr',
     loadChildren: () => import('./psr/psr.module').then(m => m.PsrModule), data: { breadcrumb: 'PSR'}
   },
   {
    path: 'gls',
     loadChildren: () => import('./gls/gls.module').then(m => m.GlsModule), data: { breadcrumb: 'GLS'}
   },
   {
    path: 'bls',
     loadChildren: () => import('./bls/bls.module').then(m => m.BlsModule), data: { breadcrumb: 'BLS'}
   },
  { path: 'sotr', loadChildren: () => import('./sotr/sotr.module').then(m => m.SotrModule) },

];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransactionRoutingModule { }
