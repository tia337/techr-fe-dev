import { Component, OnInit } from '@angular/core';
import { FormArray, FormGroup, FormControl } from '@angular/forms';
import { SingleViewCandidateLeftBlock } from 'types/types';
import { RootVCRService } from '../../../root_vcr.service';
import { CandidateSingleViewService } from '../candidate-single-view.service';

@Component({
  selector: 'app-edit-candidate-info',
  templateUrl: './edit-candidate-info.component.html',
  styleUrls: ['./edit-candidate-info.component.scss']
})
export class EditCandidateInfoComponent implements OnInit {

  public candidate: SingleViewCandidateLeftBlock;
  public candidateForm: FormGroup;
  public avatar: string;
  public newPhone: boolean = false;
  public phone2: string;

  constructor(
    private _root_vcr: RootVCRService,
    private _candidateSingleViewService: CandidateSingleViewService
  ) { }

  ngOnInit(): void {
    this.createForm();
  }

  closeModal(): void {
    this._root_vcr.clear();
  }

  set _candidate (value) {
    this.candidate = value;
  }

  get _candidate () {
    return this.candidate;
  }

  createForm(): void {
    this.candidateForm = new FormGroup({
      firstName: new FormControl(this.candidate.user.firstName),
      lastName: new FormControl(this.candidate.user.lastName),
      avatarURL: new FormControl(''),
      location: new FormControl(''),
      Phone: new FormControl(this.candidate.user.Phone),
      email: new FormControl(this.candidate.user.email),
      WebSites: new FormArray([this.createPrecense(this.candidate)])
    });
    if (this.candidate.user.phone2) this.addPhone(this.candidate.user.phone2);
  }

  createPrecense(candidate?: SingleViewCandidateLeftBlock): FormGroup {
    if (candidate) {
      const websites = candidate.user.WebSites;
      for (let i = 0; i < websites.length; i++) {
        return new FormGroup({
          Type: new FormControl(websites[i].Type),
          Url: new FormControl(websites[i].Url) 
        });
      }
    };

    if (!candidate) {
      return new FormGroup({
        Type: new FormControl(''),
        Url: new FormControl('') 
      });
    }

  }
  
  addPrecense(): void {
		const WebSites = this.candidateForm.get('WebSites') as FormArray;
    WebSites.push(this.createPrecense());
  }

  removeWebPrecense(index: number): void {
		const WebSites = this.candidateForm.get('WebSites') as FormArray;
		WebSites.controls.splice(index, 1);
	}
  
  addPhone(phone?: string): void {
		if (phone) {
			this.candidateForm.addControl('phone2', new FormControl (phone));
		} else {
			this.candidateForm.addControl('phone2', new FormControl (''));
		};
		this.candidateForm.updateValueAndValidity();
		this.newPhone = true;
  }
  
  removephone2(noDelete?): void {
		this.candidateForm.removeControl('phone2');
		this.candidateForm.updateValueAndValidity();
		this.phone2 = '';
		this.newPhone = false;
		if (noDelete) return;
    delete this.candidate.user.phone2;
  }
  
  saveCandidateInfo(): void {
    for (let property in this.candidateForm.value) {
      this.candidate.user[property] = this.candidateForm.value[property];
    }
    this._candidateSingleViewService.throwEditedCandidate(this.candidate);
  }

}
