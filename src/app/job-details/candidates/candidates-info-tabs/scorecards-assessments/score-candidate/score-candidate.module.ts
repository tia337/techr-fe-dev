import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ScoreCandidateComponent } from './score-candidate.component';
import { ScoreCandidateService } from './score-candidate.service';
import { StarRatingModule } from '../../../../../shared/star-rating/star-rating.module';
import { AutosizeModule } from '../../../../../shared/autosize/autosize.module';
import { MentionModule } from 'angular2-mentions/mention';
import { MatProgressSpinnerModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    StarRatingModule,
    AutosizeModule,
    ReactiveFormsModule,
    FormsModule,
    MentionModule,
    MatProgressSpinnerModule
  ],
  providers: [ ScoreCandidateService ],
  declarations: [ ScoreCandidateComponent ]
})
export class ScoreCandidateModule { }
