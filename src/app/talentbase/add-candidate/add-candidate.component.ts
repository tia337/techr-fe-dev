import { Component, OnInit, OnDestroy } from '@angular/core';
import { RootVCRService } from '../../root_vcr.service';
import { Ng4FilesService, Ng4FilesConfig, Ng4FilesSelected, Ng4FilesStatus } from 'angular4-files-upload';
import { ViewContainerData } from '@angular/core/src/view';
import { AddCandidateService } from './add-candidate.service';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { FormControl, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-add-candidate',
  templateUrl: './add-candidate.component.html',
  styleUrls: ['./add-candidate.component.scss']
})
export class AddCandidateComponent implements OnInit, OnDestroy {

  public files: Array<Blob> = [];
  public loading = false;
  public cvUploaded = false;
  public uploadedCandidates = [];
  public candidateForm: FormGroup;
  private filesConfig: Ng4FilesConfig = {
    acceptExtensions: ['pdf', 'word', 'rtf'],
    maxFilesCount: 5
  }

  constructor(
    private _root_vcr: RootVCRService,
    private _addCandidateService: AddCandidateService,
    private _formBuilder: FormBuilder,
    private _ng4FilesService: Ng4FilesService
  ) { }

  ngOnInit() {

    this._ng4FilesService.addConfig(this.filesConfig, 'files-config');
    
    this._addCandidateService.candidatesUploaded.skipWhile(val => val === null).take(1).subscribe(candidates => {
      this.loading = false;
      this.cvUploaded = true;
      this.buildForm(candidates);
    });

  }

  closeModal(): void {
    this._root_vcr.clear();
  }

  filesSelect(selectedFiles: Ng4FilesSelected): void {
    if (selectedFiles.status !== Ng4FilesStatus.STATUS_SUCCESS) {
      console.log(selectedFiles.status);
      return;
    }
    this.files = selectedFiles.files;
 
    this.files = Array.from(selectedFiles.files).map(file => file);
  }

  deleteCV(index, array): void {
    array.splice(index, 1);
  }

  uploadCVs() {
    this.loading = true;
    this.files.forEach(file => {
      this._addCandidateService.uploadCVs(file);
    });
  }

  buildForm(candidate) {
    this.candidateForm = this._formBuilder.group({
      FirstName: undefined,
      LastName: undefined,
      City: undefined,
      FormattedMobile: undefined
    });
    this.candidateForm.setValue({
      FirstName: candidate.FirstName,
      LastName: candidate.LastName,
      City: candidate.City,
      FormattedMobile: candidate.FormattedMobile
    });
  }

  ngOnDestroy() {
  }

}