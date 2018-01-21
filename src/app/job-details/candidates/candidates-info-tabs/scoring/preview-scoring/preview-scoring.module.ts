import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreviewScoringComponent } from './preview-scoring.component';
import { StarRatingModule } from '../../../../../shared/star-rating/star-rating.module';
import { FormsModule } from '@angular/forms';
import { PreviewScoringService } from './preview-scoring.service';
import { MatIconModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    StarRatingModule,
    FormsModule,
    MatIconModule
  ],
  declarations: [PreviewScoringComponent],
  providers: [ PreviewScoringService ]
})
export class PreviewScoringModule { }
