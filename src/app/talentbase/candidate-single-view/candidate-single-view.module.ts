import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CandidateSingleViewComponent } from './candidate-single-view.component';
import { CandidateSingleViewService } from './candidate-single-view.service';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from '../../app-routing.module';
import { MatIconModule, MatTooltipModule, MatFormFieldModule, MatSelectModule, MatOptionModule, MatInputModule, MatProgressSpinnerModule } from '@angular/material';
import { StarRatingModule } from '../../shared/star-rating/star-rating.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ClickOutsideModule } from 'ng-click-outside';
import { EditCandidateInfoComponent } from './edit-candidate-info/edit-candidate-info.component';

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
    ClickOutsideModule,
    MatProgressSpinnerModule
  ],
  declarations: [
    CandidateSingleViewComponent,
    EditCandidateInfoComponent,
  ],
  providers: [
    CandidateSingleViewService
  ],
  entryComponents: [
    EditCandidateInfoComponent
  ]
})
export class CandidateSingleViewModule { }
