import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScoringComponent } from './scoring.component';
import { ScoringService } from './scoring.service';
import { StarRatingModule } from '../../../../shared/star-rating/star-rating.module';
import { FormsModule } from '@angular/forms';
import {
  MatIconModule,
  MatButtonModule,
  MatProgressSpinnerModule
} from '@angular/material';
import { ScoreCandidateComponent } from '../scorecards-assessments/score-candidate/score-candidate.component';
import { PreviewScoringModule } from './preview-scoring/preview-scoring.module';
import { PreviewScoringComponent } from './preview-scoring/preview-scoring.component';

@NgModule({
  imports: [
    CommonModule,
    StarRatingModule,
    FormsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    PreviewScoringModule,
    MatButtonModule
  ],
  declarations: [
    ScoringComponent,
   ],
  exports: [
    ScoringComponent,
  ],
  providers: [
    ScoringService,
  ],
  entryComponents: [ ScoreCandidateComponent, PreviewScoringComponent ]
})
export class ScoringModule { }
