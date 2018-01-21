import { Parse } from './../../../../parse.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PdfViewerComponent } from 'ng2-pdf-viewer';
import { BrowserModule } from '@angular/platform-browser';

import { CandidateCvComponent } from './candidate-cv.component';


@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    BrowserModule
  ],
  declarations: [
    CandidateCvComponent,
    PdfViewerComponent
  ],
  providers: [ ],
  exports: [ CandidateCvComponent ],
  entryComponents: []
})
export class CandidateCvModule { }
