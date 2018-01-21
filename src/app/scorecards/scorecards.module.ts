import { AutosizeModule } from './../shared/autosize/autosize.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule, MatIconModule } from '@angular/material';

import { ScorecardsService } from './scorecards.service';

import { ScorecardsComponent } from './scorecards.component';
import { SelectStageComponent } from './select-stage/select-stage.component';
import { ScoreCandidateComponent } from './score-candidate/score-candidate.component';
import { AddQuestionsComponent } from './add-questions/add-questions.component';

import { SubformComponent } from './add-questions/subform/subform.component';
import { QuestionComponent } from './add-questions/subform/question.component';

import { PreviewComponent } from './preview/preview.component';

import { StarRatingModule } from '../shared/star-rating/star-rating.module';

import { ScorecardsFilterPipe } from './scorecards.pipe';
import { EditScorecardComponent } from './edit-scorecard/edit-scorecard.component';
import { EditScorecardService } from './edit-scorecard/edit-scorecard.service';
import { PreviewModalComponent } from './preview-modal/preview-modal.component';

import { AlertModule } from '../shared/alert/alert.module';

import { MatSortModule } from '@angular/material';

@NgModule({
  declarations: [
    ScorecardsComponent,
    SelectStageComponent,
    AddQuestionsComponent,
    ScoreCandidateComponent,
    SubformComponent,
    QuestionComponent,
    PreviewComponent,
    ScorecardsFilterPipe,
    EditScorecardComponent,
    PreviewModalComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    StarRatingModule,
    AlertModule,
    AutosizeModule,
    MatIconModule,
    MatSortModule
  ],
  entryComponents: [EditScorecardComponent, PreviewModalComponent],
  providers: [ScorecardsService, EditScorecardService]

})
export class ScorecardsModule { }
