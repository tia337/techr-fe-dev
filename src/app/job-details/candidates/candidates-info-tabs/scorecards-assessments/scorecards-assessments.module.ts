import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ScorecardsAssessmentsComponent } from './scorecards-assessments.component';
import { ScorecardsAssessmentsService } from './scorecards-assessments.service';
import { SelectScorecardsModalComponent } from './select-scorecards-modal/select-scorecards-modal.component';
import { ScoreCandidateComponent } from './score-candidate/score-candidate.component';
import { ScoreCandidateModule } from './score-candidate/score-candidate.module';
import { AlertComponent } from '../../../../shared/alert/alert.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ScoreCandidateModule
  ],
  declarations: [
    ScorecardsAssessmentsComponent,
    SelectScorecardsModalComponent

  ],
  providers: [ ScorecardsAssessmentsService ],
  exports: [ ScorecardsAssessmentsComponent ],
  entryComponents: [ SelectScorecardsModalComponent, ScoreCandidateComponent, AlertComponent ]
})
export class ScorecardsAssessmentsModule { }
