import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TalentbaseComponent } from './talentbase.component';
import { TalentbaseService } from './talentbase.service';
import { RootVCRService } from '../root_vcr.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FileSizePipe } from './file-size.pipe';
import { HighlightSearchPipe } from './highlight-search.pipe';
import { MatIconModule, MatProgressSpinnerModule } from '@angular/material';
import { ClickOutsideModule } from 'ng-click-outside';
import { AddCandidateModule } from './add-candidate/add-candidate.module';

@NgModule({
  imports: [
    CommonModule,
    AddCandidateModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    ClickOutsideModule
  ],
  declarations: [
    TalentbaseComponent,
    FileSizePipe,
    HighlightSearchPipe
  ],
  providers: [
    TalentbaseService,
    RootVCRService
  ],
  exports: [
    TalentbaseComponent
  ]
})
export class TalentbaseModule { }
