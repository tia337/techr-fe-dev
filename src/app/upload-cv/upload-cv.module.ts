import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadCvService } from './upload-cv.service';
import { UploadCvComponent } from './upload-cv.component';
import { Ng4FilesModule } from './../../../node_modules/angular4-files-upload';
import { MatAutocompleteModule, MatInputModule, MatSelectModule, MatMenuModule, MatButtonModule, MatProgressSpinnerModule } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    Ng4FilesModule,
    FormsModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    FormsModule,
    MatSelectModule,
    MatInputModule,
    MatAutocompleteModule,
    MatMenuModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  declarations: [
    UploadCvComponent,
  ],
  providers: [UploadCvService],
  exports: [],
  entryComponents: [UploadCvComponent]
})
export class UploadCvModule {
	constructor(private _upload_cv: UploadCvService) {}
}
