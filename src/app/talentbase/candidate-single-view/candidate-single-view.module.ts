import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CandidateSingleViewComponent } from './candidate-single-view.component';
import { CandidateSingleViewService } from './candidate-single-view.service';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from '../../app-routing.module';
import { MatIconModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    AppRoutingModule,
    MatIconModule
  ],
  declarations: [
    CandidateSingleViewComponent
  ],
  providers: [
    CandidateSingleViewService
  ]
})
export class CandidateSingleViewModule { }
