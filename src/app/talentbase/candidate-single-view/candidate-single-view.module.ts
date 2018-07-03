import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CandidateSingleViewComponent } from './candidate-single-view.component';
import { CandidateSingleViewService } from './candidate-single-view.service';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from '../../app-routing.module';
import { MatIconModule, MatTooltipModule, MatFormFieldModule, MatSelectModule, MatOptionModule, MatInputModule } from '@angular/material';
import { StarRatingModule } from '../../shared/star-rating/star-rating.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ClickOutsideModule } from 'ng-click-outside';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    AppRoutingModule,
    MatIconModule,
    MatTooltipModule,
    StarRatingModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    ClickOutsideModule
  ],
  declarations: [
    CandidateSingleViewComponent
  ],
  providers: [
    CandidateSingleViewService
  ]
})
export class CandidateSingleViewModule { }
