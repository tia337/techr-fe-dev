import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule, MatProgressSpinnerModule } from '@angular/material';
import { Ng4FilesModule } from 'angular4-files-upload';
import { ClickOutsideModule } from 'ng-click-outside';
import { AddCandidateComponent } from './add-candidate.component';
import { AddCandidateService } from './add-candidate.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    Ng4FilesModule,
    ClickOutsideModule
  ],
  declarations: [
    AddCandidateComponent
  ],
  providers: [
    AddCandidateService
  ],
  entryComponents: [
    AddCandidateComponent
  ]
})
export class AddCandidateModule { }
