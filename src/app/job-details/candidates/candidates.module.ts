import { GmailModule } from './../../gmail/gmail.module';
import { GmailComponent } from './../../gmail/gmail.component';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ScoringModule } from './candidates-info-tabs/scoring/scoring.module';

import {MatButtonModule} from '@angular/material/button';
import {MatSelectModule} from '@angular/material/select';
import {MatIconModule, MatFormFieldModule, MatFormFieldControl, MatProgressSpinnerModule} from '@angular/material';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { CandidatesComponent } from './candidates.component';
import { CandidatesService } from './candidates.service';
import { Parse } from '../../parse.service';
import { CandidateProfileComponent } from './candidate-profile/candidate-profile.component';
import { CandidateProfileService } from './candidate-profile/candidate-profile.service';
import { MatTabsModule } from '@angular/material';
import { ScorecardsAssessmentsModule } from './candidates-info-tabs/scorecards-assessments/scorecards-assessments.module';
import { SkillsModule } from './candidates-info-tabs/skills/skills.module'
import { CandidateCvModule } from './candidates-info-tabs/candidate-cv/candidate-cv.module';
import { CandidateChatModule } from './candidates-info-tabs/candidate-chat/candidate-chat.module';
import { CandidateNotesModule } from './candidates-info-tabs/candidate-notes/candidate-notes.module';
import { StarRatingModule } from '../../shared/star-rating/star-rating.module';
import { RouterModule } from '@angular/router';
import { LoaderModule } from '../../shared/loader/loader.module';
import { DashboardModule } from 'app/dashboard/dashboard.module';
import { RejectModalComponent } from './candidate-profile/reject-modal/reject-modal.component';
import { RejectModalModule } from './candidate-profile/reject-modal/reject-modal.module';
import { BulkActionsModule } from './candidate-profile/bulk-actions/bulk-actions.module';
import { BulkActionsComponent } from './candidate-profile/bulk-actions/bulk-actions.component';
import { WithdrawnModalComponent } from './candidate-profile/withdrawn-modal/withdrawn-modal.component';
import { WithdrawnModalModule } from './candidate-profile/withdrawn-modal/withdrawn-modal.module';

@NgModule({
  declarations: [
    CandidatesComponent,
    CandidateProfileComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    RouterModule,
    MatTabsModule,
    MatCheckboxModule,
    ScorecardsAssessmentsModule,
    ScoringModule,
    SkillsModule,
    CandidateCvModule,
    CandidateChatModule,
    CandidateNotesModule,
    GmailModule,
    StarRatingModule,
    LoaderModule,
    DashboardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    RejectModalModule,
    BulkActionsModule,
    MatIconModule,
    WithdrawnModalModule,
  ],
  exports: [CandidatesComponent],
  providers: [Parse, CandidatesService, CandidateProfileService],
  entryComponents: [GmailComponent, RejectModalComponent, BulkActionsComponent, WithdrawnModalComponent]

})
export class CandidatesModule { }
