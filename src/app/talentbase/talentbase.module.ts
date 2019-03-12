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
import { CandidateChatModule } from '../job-details/candidates/candidates-info-tabs/candidate-chat/candidate-chat.module';
import { AppRoutingModule } from '../app-routing.module';
import { CandidateSingleViewComponent } from './candidate-single-view/candidate-single-view.component';
import { CandidateSingleViewModule } from './candidate-single-view/candidate-single-view.module';

@NgModule({
  imports: [
    CommonModule,
    AddCandidateModule,
    CandidateSingleViewModule,
    CandidateChatModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    ClickOutsideModule,
    AppRoutingModule
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
