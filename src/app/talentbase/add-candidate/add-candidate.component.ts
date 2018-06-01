import { Component, OnInit, OnDestroy } from '@angular/core';
import { RootVCRService } from '../../root_vcr.service';
import { Ng4FilesService, Ng4FilesConfig, Ng4FilesSelected, Ng4FilesStatus } from 'angular4-files-upload';
import { ViewContainerData } from '@angular/core/src/view';
import { AddCandidateService } from './add-candidate.service';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { FormControl, FormBuilder, FormGroup } from '@angular/forms';
import { UploadCvService } from '../../upload-cv/upload-cv.service';
import { SafeUrl } from '@angular/platform-browser';
import { SanitizerPipe } from '../../shared/sanitizer.pipe';
import { Parse } from '../../parse.service';

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
    acceptExtensions: ['pdf', 'doc', 'docx', 'rtf'],
    maxFilesCount: 5
  };
  private _candidatesRchilliSubscription;
  public avatar: SafeUrl;
  public sourceItems: Array<{ name: string, id: string }> = [];
  public jobBoards: Array<{ name: string, id: string }> = [];
  public source: { name: string, id: string };

  constructor(
    private _root_vcr: RootVCRService,
    private _addCandidateService: AddCandidateService,
    private _uploadCVService: UploadCvService,
    private _formBuilder: FormBuilder,
    private _ng4FilesService: Ng4FilesService,
    private _parse: Parse
  ) { }

  ngOnInit() {
    this._ng4FilesService.addConfig(this.filesConfig, 'files-config');
    this.buildForm();
    this.getJobBoards();
    this.getSources();
  }

  closeModal(): void {
    this._root_vcr.clear();
  }

  filesSelect(selectedFiles: Ng4FilesSelected): void {
    if (selectedFiles.status !== Ng4FilesStatus.STATUS_SUCCESS) return;
    this.files = Array.from(selectedFiles.files).map(file => file);
  }

  deleteCV(index, array): void {
    array.splice(index, 1);
  }

  uploadCVs(): void {
    this.loading = true;
    this.files.forEach(file => {
      this._addCandidateService.parsingCv(file);
    });
    this._candidatesRchilliSubscription = this._addCandidateService.candidatesUploaded
      .skipWhile(val => val === null)
      .take(this.files.length)
      .distinctUntilChanged()
      .subscribe(candidate => {
        console.log('response',  candidate);
        this.loading = false;
        this.cvUploaded = true;
        if (this.uploadedCandidates.length === 0) this.buildForm(candidate);
        this.uploadedCandidates.push(candidate);
      });
  }

  private buildForm(candidate?): void {
   
    if (!candidate) {
      this.candidateForm = this._formBuilder.group({
        firstName: undefined,
        lastName: undefined,
        // Avatar: undefined,
        City: 'London',
        Phone: undefined,
        email: undefined,
        WebPrecense: undefined,
        Source: undefined,
        JobBoard: undefined,
        Job: undefined,
        Stage: undefined
      });
    }

  

    if (candidate) {
      this.candidateForm.setValue({
        firstName: candidate.firstName,
        lastName: candidate.lastName,
        // Avatar: '',
        City: '',
        Phone: candidate.Phone ? candidate.Phone : '',
        email: candidate.email,
        WebPrecense: '',
        Source: '',
        JobBoard: '',        
        Job: '',
        Stage: '', 
      });
    }
  }

  redirectToImport(value: boolean): void {
    this._addCandidateService.redirectToImport(value);
  }
  
  getSources() {
    this._uploadCVService.getAllCandiadateSources().then((result: { name: string, id: string }[]) => {
      this.sourceItems = result;
    });
  }

  getJobBoards() {
    this._uploadCVService.getAllJobBoards().then((result: { name: string, id: string }[]) => {
      this.jobBoards = result;
    })
  }

  changeAvatar(event, avatarInput) {
    const reader = new FileReader();
    reader.onload = (event: any) => {
      this.avatar = event.target.result;
    }
    reader.readAsDataURL(event.target.files[0]);
  }

  removeAvatar() {
    this.avatar = undefined;
    const input: HTMLElement = document.getElementById('avatar') as HTMLInputElement;
  }


  ngOnDestroy(): void {
    if (this._candidatesRchilliSubscription !== undefined) this._candidatesRchilliSubscription.unsubscribe();
    if (this.candidateForm !== undefined) this.candidateForm.reset();
  }

}
