import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material';
import { Ng4FilesModule } from 'angular4-files-upload';
import { ClickOutsideModule } from 'ng-click-outside';
import { AddCandidateComponent } from './add-candidate.component';

@NgModule({
  imports: [
    CommonModule,
    MatIconModule,
    Ng4FilesModule,
    ClickOutsideModule
  ],
  declarations: [
    AddCandidateComponent
  ],
  entryComponents: [
    AddCandidateComponent
  ]
})
export class AddCandidateModule { }
