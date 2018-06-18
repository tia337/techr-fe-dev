import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule, MatProgressSpinnerModule, MatFormFieldModule, MatSelectModule, MatOptionModule, MatInputModule } from '@angular/material';
import { Ng4FilesModule } from 'angular4-files-upload';
import { ClickOutsideModule } from 'ng-click-outside';
import { AddCandidateComponent } from './add-candidate.component';
import { AddCandidateService } from './add-candidate.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SanitizerPipe } from '../../shared/sanitizer.pipe';
import { SearchJobPipe } from './search-job.pipe';

@NgModule({
  imports: [
    CommonModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    FormsModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    Ng4FilesModule,
    ClickOutsideModule,
  ],
  declarations: [
    AddCandidateComponent,
    SanitizerPipe,
    SearchJobPipe
  ],
  providers: [
    AddCandidateService
  ],
  entryComponents: [
    AddCandidateComponent
  ]
})
export class AddCandidateModule { }
