import { Component, OnInit, OnDestroy, ElementRef, ViewChild, ViewChildren, QueryList, Renderer2 } from '@angular/core';
import { RootVCRService } from '../../root_vcr.service';
import { Ng4FilesService, Ng4FilesConfig, Ng4FilesSelected, Ng4FilesStatus } from 'angular4-files-upload';
import { ViewContainerData } from '@angular/core/src/view';
import { AddCandidateService } from './add-candidate.service';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { FormControl, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { UploadCvService } from '../../upload-cv/upload-cv.service';
import { SafeUrl } from '@angular/platform-browser';
import { SanitizerPipe } from '../../shared/sanitizer.pipe';
import { Parse } from '../../parse.service';
import { PostJobService } from '../../post-job-page/post-job.service';
import * as _ from 'underscore';
import { SearchJobPipe } from './search-job.pipe';
import { TalentbaseService } from '../talentbase.service';
import { Experience, Education } from 'types/types';

@Component({
  selector: 'app-add-candidate',
  templateUrl: './add-candidate.component.html',
  styleUrls: ['./add-candidate.component.scss']
})
export class AddCandidateComponent implements OnInit, OnDestroy {

	public files: Array<Blob> = [];
	public loading: boolean = false;
	public cvUploaded: boolean = false;
	public uploadedCandidates = [];
	public currentCandidate;
	public candidateForm: FormGroup;
	public experienceForm: FormGroup;
	public educationForm: FormGroup;
	private filesConfig: Ng4FilesConfig = { acceptExtensions: ['pdf', 'doc', 'docx', 'rtf'], maxFilesCount: 5 };
	private _candidatesRchilliSubscription;
	public avatar: SafeUrl;
	public sourceItems: Array<{ name: string, id: string }> = [];
	public jobBoards: Array<{ name: string, id: string }> = [];
	public source: { name: string, id: string };
	public query = '';
	public selectionCounter: number = 0;
	public expPosition: number = 1;
	public editable: boolean = false;
	public active: boolean = false;
	public dropdownVisible: boolean = false;
	public dropdownRolesVisible: boolean = false;
	public dropdownIndustriesVisible: boolean = false;  
	public filteredList: Array<any> = [];
	public selectedRoles: Array<any> = [];
	public activeForRoles: boolean = false;
	public queryRoles: string = '';
	public selectedIndustries: Array<any> = [];
	public activeForIndustries: boolean = false;
	public queryIndustries: string = '';
	public filteredRnIList: Array<any> = [];
	public selectionRnICounter: number = 0;
	public selected: Array<any> = [];	
	public industries;
	public categories;
	public skills;
	public roles;
	public years: Array<string> = [];
	public months: Array<string> = [];
	public experienceFormOpened: boolean = false;
	public candidateFormOpened: boolean = false;
	public educationFormOpened: boolean = false;	
	public experience: Array<Experience> = [];
	public educations: Array<Education> = [];
	public tags: Array<any> = [];
	public seeMore: boolean = false;
	public CV;
	public attachment;
	public Phone;
	public phone2;
	public newPhone = false;
	public firstNameEmpty = false;
	public lastNameEmpty = false;
	public emailEmpty = false;
	public sourceEmpty = false;	
	public jobBoardEmpty = false;
	public currentCandidateIndex = 1;
	public disabledCandidateSaveChanges = true;
	public experienceJobTitleEmpty = false;
	public educationTitleEmpty = false;
	public fileAttachmentsRangeError = false;
	public jobsArray = [];
	private clientId;
	public job;
	public jobsSelected = [];
	public jobsListHidden = true;
	public currentlyWorksExperience;
	public currentlyWorksEducation;
	public candidatesUploaded = 1;
	public jobStages = [
		{
			type: 'applied',
			title: 'Applied',
			listType: -1
		},
		{
			type: 'shortlist',
			title: 'Shortlist',
			listType: 0
		},
		{
			type: 'phoneInterview',
			title: 'Phone Interview',
			listType: 1
		},
		{
			type: 'f2fInterview',
			title: 'F2F Interview',
			listType: 2
		},
		{
			type: 'jobOffered',
			title: 'Job Offered',
			listType: 3
		},
		{
			type: 'hired',
			title: 'Hired',
			listType: 4
		},
		{
			type: 'rejected',
			title: 'Rejected',
			listType: 6
		}
		];

	@ViewChild('scrollpanel', { read: ElementRef }) public panel: ElementRef;
	@ViewChildren('categoryTitles') categoryTitles: QueryList<ElementRef>;
	@ViewChild('categoriesDropdown') categoriesDropdown: ElementRef;
	@ViewChild('avatarInput') avatarInput: ElementRef;
  
	constructor(
		private _root_vcr: RootVCRService,
		private _addCandidateService: AddCandidateService,
		private _uploadCVService: UploadCvService,
		private _formBuilder: FormBuilder,
		private _ng4FilesService: Ng4FilesService,
		private _parse: Parse,
		private _postJobService: PostJobService,
		private _renderer: Renderer2,
		private _elementRef: ElementRef,
		private _talentBaseService: TalentbaseService
	) { }

	ngOnInit() {
			this.clientId = this._parse.getClientId();

			this._ng4FilesService.addConfig(this.filesConfig, 'files-config');
			
			this.buildForm();
			this.getJobBoards();
			this.getSources();

			this._postJobService.getSkills().then(skills => {
				this.skills = skills;
				this.skills = _.sortBy(this.skills, function(skill){ return skill.get("title"); });
			});

			this._postJobService.getCategories().then(categories => {
				this.categories = categories;
			});
			
			this._postJobService.getIndustries().then(industries => {
				this.industries = industries;
				this.industries = _.sortBy(this.industries, function(industries){ return industries.get("title"); });
			});

			this._postJobService.getRoles().then(roles => {
				this.roles = roles;
				this.roles = _.sortBy(this.roles, function(roles){ return roles.get("title"); });
			});



			this._addCandidateService.getJobs(this.clientId).then(result => {
				this.jobsArray = result;
			}).catch(error => console.log(error));

			this.years = this._addCandidateService.createYears().reverse();
			this.months = this._addCandidateService.createMonths();
	}

	log(a) {
		console.log(a);
	}

	openCandidateForm(): void {
		this.cvUploaded = true;
	}

	buildExperienceForm(): void {
		this.experienceFormOpened = true;
		this.experienceForm = this._formBuilder.group({
			id: undefined,
			jobTitle: this._formBuilder.control('', Validators.required),
			companyName: undefined,
			location: undefined,
			yearDateFrom: undefined,
			monthDateFrom: undefined,
			yearDateTo: undefined,
			monthDateTo: undefined,
			currentlyWorks: undefined,
			description: undefined
		});
		this.experienceForm.valueChanges.subscribe(value => {
			if (this.experienceForm.controls['jobTitle'].value !== '') {
				this.experienceJobTitleEmpty = false; 
			};
			if (this.experienceForm.controls['jobTitle'].value === '') {
				this.experienceJobTitleEmpty = true; 
			};
		});
	}

	buildEducationForm(): void {
		this.educationFormOpened = true;
		this.educationForm = this._formBuilder.group({
			id: undefined,
			schoolInstitutionName: this._formBuilder.control('', Validators.required),
			degree: undefined,
			major: undefined,
			location: undefined,
			yearDateFrom: undefined,
			monthDateFrom: undefined,
			yearDateTo: undefined,
			monthDateTo: undefined,
			currentlyAttends: undefined,
			description: undefined
		});
		this.educationForm.valueChanges.subscribe(value => {
			if (this.educationForm.controls['schoolInstitutionName'].value !== '') {
				this.educationTitleEmpty = false; 
			};
			if (this.educationForm.controls['schoolInstitutionName'].value === '') {
				this.educationTitleEmpty = true; 
			};
		});
	}

	addExperience(): void {
		if (this.experienceForm.invalid) {
			this.experienceJobTitleEmpty = true;
			return;
		};
		if (this.experienceForm.value.id !== null) {
			this.experience.forEach(item => {
				if (item.id === this.experienceForm.value.id) {
					item.id = item.id;
					item.jobTitle = this.experienceForm.value.jobTitle;
					item.companyName = this.experienceForm.value.companyName;
					item.location = this.experienceForm.value.location;
					item.monthDateFrom = this.experienceForm.value.monthDateFrom;
					item.yearDateFrom = this.experienceForm.value.yearDateFrom;
					item.monthDateTo = this.experienceForm.value.monthDateTo;
					item.yearDateTo = this.experienceForm.value.yearDateTo;
					item.currentlyWorks = this.experienceForm.value.currentlyWorks;
					item.description = this.experienceForm.value.description ? this.experienceForm.value.description : undefined;
				}
			});
			this.experienceFormOpened = false;	
			this.experienceForm.reset();	
			this.experience.forEach(item => item.hidden = false);
			this.disabledCandidateSaveChanges = false;
			this.experienceJobTitleEmpty = false;
			return;
		} else if (this.experienceForm.value.id === null) {
			const experience: Experience = {
				id: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
				jobTitle: this.experienceForm.value.jobTitle,
				companyName: this.experienceForm.value.companyName ? this.experienceForm.value.companyName : undefined,
				location: this.experienceForm.value.location ? this.experienceForm.value.location : undefined,
				monthDateFrom: this.experienceForm.value.monthDateFrom ? this.experienceForm.value.monthDateFrom : undefined,
				yearDateFrom: this.experienceForm.value.yearDateFrom ? this.experienceForm.value.yearDateFrom : undefined,
				monthDateTo: this.experienceForm.value.monthDateTo ? this.experienceForm.value.monthDateTo : undefined,
				yearDateTo: this.experienceForm.value.yearDateTo ? this.experienceForm.value.yearDateTo : undefined,
				currentlyWorks: this.experienceForm.value.currentlyWorks ? this.experienceForm.value.currentlyWorks : undefined,
				description: this.experienceForm.value.description ? this.experienceForm.value.description : undefined,
				hidden: false
			};
			this.experience.push(experience);
			this.experienceFormOpened = false;
			this.experienceForm.reset();
			this.disabledCandidateSaveChanges = false;	
			this.experienceJobTitleEmpty = false;
		}
	}

	addEducation() {
		if (this.educationForm.invalid) {
			this.educationTitleEmpty = true;
			return;
		};
		if (this.educationForm.value.id !== null) {
			this.educations.forEach(item => {
				if (item.id === this.educationForm.value.id) {
					item.id = item.id;
					item.schoolInstitutionName = this.educationForm.value.schoolInstitutionName;
					item.degree = this.educationForm.value.degree;
					item.major = this.educationForm.value.major;
					item.location = this.educationForm.value.location;
					item.monthDateFrom = this.educationForm.value.monthDateFrom;
					item.yearDateFrom = this.educationForm.value.yearDateFrom;
					item.monthDateTo = this.educationForm.value.monthDateTo;
					item.yearDateTo = this.educationForm.value.yearDateTo;
					item.currentlyAttends = this.educationForm.value.currentlyAttends;
					item.description = this.educationForm.value.description ? this.educationForm.value.description : undefined;
				}
			});
			this.educationFormOpened = false;	
			this.educationForm.reset();	
			this.educations.forEach(item => item.hidden = false);	
			this.disabledCandidateSaveChanges = false;
			this.educationTitleEmpty = false;
			return;
		} else if (this.educationForm.value.id === null) {
			const education: Education = {
				id: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
				schoolInstitutionName: this.educationForm.value.schoolInstitutionName,
				degree: this.educationForm.value.degree ? this.educationForm.value.degree : undefined,
				major: this.educationForm.value.major ? this.educationForm.value.major : undefined,
				location: this.educationForm.value.location ? this.educationForm.value.location : undefined,
				monthDateFrom: this.educationForm.value.monthDateFrom ? this.educationForm.value.monthDateFrom : undefined,
				yearDateFrom: this.educationForm.value.yearDateFrom ? this.educationForm.value.yearDateFrom : undefined,
				monthDateTo: this.educationForm.value.monthDateTo ? this.educationForm.value.monthDateTo : undefined,
				yearDateTo: this.educationForm.value.yearDateTo ? this.educationForm.value.yearDateTo : undefined,
				currentlyAttends: this.educationForm.value.currentlyAttends ? this.educationForm.value.currentlyAttends : undefined,
				description: this.educationForm.value.description ? this.educationForm.value.description : undefined,
				hidden: false
			};
			this.educations.push(education);
			this.educationFormOpened = false;
			this.educationForm.reset();
			this.disabledCandidateSaveChanges = false;
			this.educationTitleEmpty = false;
		}
	}

	deleteExperienceItem(index, array): void {
		array.splice(index, 1);
	}

	editExperienceItem(item: Experience): void {
		this.experienceFormOpened = true;
		item.hidden = true;
		this.experienceForm.setValue({
			id: item.id,
			jobTitle: item.jobTitle,
			companyName: item.companyName == undefined ? '' : item.companyName,
			location: item.location == undefined ? '' : item.location,
			yearDateFrom: item.yearDateFrom == undefined ? '' : item.yearDateFrom,
			monthDateFrom: item.monthDateFrom == undefined ? '' : item.monthDateFrom,
			yearDateTo: item.monthDateTo == undefined ? '' : item.monthDateTo,
			monthDateTo: item.monthDateTo == undefined ?  '' : item.monthDateTo,
			currentlyWorks: item.currentlyWorks == undefined ? '' : item.currentlyWorks,
			description: item.description == undefined ? '' : item.description
		});
	}

	editEducationItem(item: Education): void {
		this.educationFormOpened = true;
		item.hidden = true;
		this.educationForm.setValue({
			id: item.id,
			schoolInstitutionName: item.schoolInstitutionName,
			degree: item.degree == undefined ? '' : item.degree,
			major: item.major == undefined ? '' : item.major,
			location: item.location == undefined ? '' : item.location,
			yearDateFrom: item.yearDateFrom == undefined ? '' : item.yearDateFrom,
			monthDateFrom: item.monthDateFrom == undefined ? '' : item.monthDateFrom,
			yearDateTo: item.monthDateTo == undefined ? '' : item.monthDateTo,
			monthDateTo: item.monthDateTo == undefined ?  '' : item.monthDateTo,
			currentlyAttends: item.currentlyAttends == undefined ? '' : item.currentlyAttends,
			description: item.description == undefined ? '' : item.description
		});
	}

	addTag(value: string): void  {
		if (value !== '') {
			this.tags.push(value);
		}
	}

	disableEmptyTitleWarning(titleName, event) {
		if (titleName === true) {
			if (event.target.value !== '') {
				titleName = false;
			} else {
				titleName = true;
			}
		}
	}

	closeModal(): void {
		if (this.candidateForm.value) this.candidateForm.reset();
		delete this.candidatesUploaded;
		this._root_vcr.clear();
	}

	filesSelect(selectedFiles: Ng4FilesSelected): void {
		if (selectedFiles.status !== Ng4FilesStatus.STATUS_SUCCESS) return;
		this.files = Array.from(selectedFiles.files).map(file => file);
	}

	deleteCV(index, array): void {
		array.splice(index, 1);
	}

	// uploadCVs(): void {
	// 	this.loading = true;
	// 	this.files.forEach(file => {
	// 		this._addCandidateService.parsingCv(file);
	// 	});
	// 	this._candidatesRchilliSubscription = this._addCandidateService.candidatesUploaded
	// 		.skipWhile(val => val === null)
	// 		.take(this.files.length)
	// 		.distinctUntilChanged()
	// 		.subscribe(candidate => {
	// 			console.log('response',  candidate);
	// 			this.loading = false;
	// 			this.cvUploaded = true;
	// 			if (this.uploadedCandidates.length === 0) {
	// 				this.uploadedCandidates.push('');
	// 				this.buildForm(candidate);
	// 				this.fillCandidatesForm(candidate);
	// 				this.currentCandidate = this.uploadedCandidates[this.currentCandidateIndex];
	// 			} 
	// 			this.uploadedCandidates.push(candidate);
	// 			this.addPropertiesArrays();
	// 			console.log(this.uploadedCandidates, 'UPLOADED CANDIDATES');
	// 		});	
	// }

	uploadCVs(): void {
		this.loading = true;
		this.files.forEach(file => {
			this.parsingCv(file);
		});
	}
	
	parsingCv (cvFile) {
		this.createBase64(cvFile).then(result => {
			const filename = cvFile.name;
			const base64 = result;
			this.sendCV(base64, filename).then(candidate => {
				if (this.uploadedCandidates.length === 0) {
					this.uploadedCandidates.push('');
					this.buildForm(candidate);
					this.fillCandidatesForm(candidate);
					this.currentCandidate = this.uploadedCandidates[this.currentCandidateIndex];
					this.candidatesUploaded = 2;
				} else {
					this.candidatesUploaded++;
				}
				this.uploadedCandidates.push(candidate);
				this.addPropertiesArrays();
				if (this.files.length + 1 === this.candidatesUploaded) {
					this.loading = false;
					this.cvUploaded = true;
				}
			}).catch(error => {
				this.candidatesUploaded++;
				if (this.files.length + 1 === this.candidatesUploaded) {
					this.loading = false;
				}
			});
		});
	  }
	
	  sendCV(base64: any, filename: string) {
		  return new Promise ((resolve, reject) => {
			this._parse.execCloud('parsingCV', { base64: base64, filename: filename, clientId: this.clientId })
				.then(response => {
					resolve(this.concatCandidateResult(response));
					reject(response);
				});
		  });
	  }
	
	  createBase64 (file) {
		const reader: FileReader = new FileReader();
		const promise = new Promise((resolve, reject) => {
			reader.readAsDataURL(file);
			reader.onload = function () {
				resolve(reader.result);
			};
			reader.onerror = (error) => {
				console.log('Error: ', error);
				reject(error);
			};
		});
		return promise;
	  }

	  concatCandidateResult(array: Array<any>) {
			let temp = {};
			array.forEach(item => {
				for (let x in item) {
					temp[x] = item[x];
				}
			});
			return temp;
		}



	fillCandidatesForm(candidate) {
		console.log(candidate);
		this.educations = [];
		this.tags = [];
		if (candidate.skills) this.selected = candidate.skills.slice();
		if (candidate.roles) this.selectedRoles = candidate.roles.slice();
		if (candidate.experience) {
			this.experience = candidate.experience.slice();
		} else {
			this.experience = [];
		};
		if (candidate.educations) {
			this.educations = candidate.educations.slice();
		} else {
			this.educations = [];
		}
		if (candidate.tags) {
			this.tags = candidate.tags.slice();
		} else {
			this.tags = [];
		}
		if (candidate.attachment) {
			this.attachment = candidate.attachment;
			console.log(candidate.attachment);
		} else {
			this.attachment = undefined;
		};
		if (candidate.jobs) {
			this.jobsSelected = candidate.jobs;
		} else {
			this.jobsSelected = [];
		}
	}

	showPreviousCandidate(index) {
		this.newPhone = false;
		this.removephone2('noDelete');
		this.avatar = undefined;
		if (index - 1 >= 1) {
			index--;
			this.currentCandidateIndex--;
			if (this.uploadedCandidates[index].avatarFile !== undefined  || this.uploadedCandidates[index].avatarFile !== '') {
				this.avatar = this.uploadedCandidates[index].avatarFile;
			}
			this.buildForm(this.uploadedCandidates[index]);
			this.fillCandidatesForm(this.uploadedCandidates[index]);
			this.currentCandidate = this.uploadedCandidates[this.currentCandidateIndex];
		} else if (index === 0) {
			this.currentCandidateIndex = 1;
			if (this.uploadedCandidates[index].avatarFile !== undefined  || this.uploadedCandidates[index].avatarFile !== '') {
				this.avatar = this.uploadedCandidates[index].avatarFile;
			}
			this.buildForm(this.uploadedCandidates[1]);
			this.fillCandidatesForm(this.uploadedCandidates[1]);
			this.currentCandidate = this.uploadedCandidates[this.currentCandidateIndex];
		};
		this.disabledCandidateSaveChanges = true;
	}

	showNextCandidate(index) {
		this.newPhone = false;
		this.removephone2('noDelete');
		this.avatar = undefined;
		if (index + 1 < this.uploadedCandidates.length) {
			index++;
			this.currentCandidateIndex++;	
			if (this.uploadedCandidates[index].avatarFile !== undefined || this.uploadedCandidates[index].avatarFile !== '') {
				this.avatar = this.uploadedCandidates[index].avatarFile;
			}
			this.buildForm(this.uploadedCandidates[index]);
			this.fillCandidatesForm(this.uploadedCandidates[index]);	
			this.currentCandidate = this.uploadedCandidates[this.currentCandidateIndex];
		};
		if (index + 1 === this.uploadedCandidates.length) {
			index++;
			this.currentCandidateIndex = index - 1;	
			if (this.uploadedCandidates[index].avatarFile !== undefined || this.uploadedCandidates[index].avatarFile !== '') {
				this.avatar = this.uploadedCandidates[index].avatarFile;
			}
			this.buildForm(this.uploadedCandidates[this.uploadedCandidates.length - 1]);
			this.fillCandidatesForm(this.uploadedCandidates[this.uploadedCandidates.length - 1]);
			this.currentCandidate = this.uploadedCandidates[this.currentCandidateIndex];
		};
		this.disabledCandidateSaveChanges = true;
	}

	buildForm(candidate?): void {
		if (!candidate) {
			this.candidateForm = this._formBuilder.group({
				firstName: this._formBuilder.control('', Validators.required),
				lastName: this._formBuilder.control('', Validators.required),
				location: undefined,
				avatarURL: undefined,
				Phone: undefined,
				email: this._formBuilder.control('', Validators.required),
				WebSites: this._formBuilder.array([ this.createPrecense() ]),
				source: this._formBuilder.control('', Validators.required),
				jobBoard: undefined,
				job: undefined,
				stage: undefined,
				Skills: undefined
			});
		};
		if (candidate) {
			this.candidateForm.removeControl('WebSites');
			this.candidateForm.setValue({
				firstName: candidate.firstName ? candidate.firstName : '',
				lastName: candidate.lastName ? candidate.lastName : '',
				avatarURL: '',
				location: candidate.location ? candidate.location : '',
				Phone: candidate.Phone ? candidate.Phone : '',
				email: candidate.email ? candidate.email : '',
				source: candidate.source ? candidate.source : '',
				jobBoard: candidate.jobBoard ? candidate.jobBoard : '',
				job: candidate.job ? candidate.job : '',
				stage: candidate.stage ? candidate.stage : '',
				Skills: '',
			});
			console.log(this.candidateForm);
			this.candidateForm.controls['jobBoard'].setValue({ source: null });
			this.candidateForm.addControl('WebSites', this._formBuilder.array([ this.createPrecense(candidate) ]));
			if (candidate.WebSites.length > 1) {
				for (let i = 1; i < candidate.WebSites.length; i++) {
					const WebSites = this.candidateForm.controls['WebSites'] as FormArray;
					WebSites.push(this._formBuilder.group({ Type: candidate.WebSites[i].Type, Url: candidate.WebSites[i].Url}));
				}
			}
			this.candidateForm.valueChanges.subscribe(values => {
				this.checkInitialCandidateProperties(this.currentCandidateIndex, values);
			});
			this.disabledCandidateSaveChanges = true;
			if (candidate.phone2) {
				this.addPhone(candidate.phone2);
			}
		}
	}

	redirectToImport(value: boolean): void {
		this._addCandidateService.redirectToImport(value);
	}
	
	getSources(): void {
		this._uploadCVService.getAllCandiadateSources().then((result: { name: string, id: string }[]) => {
			this.sourceItems = result;
		});
	}

	getJobBoards(): void {
		this._uploadCVService.getAllJobBoards().then((result: { name: string, id: string }[]) => {
			this.jobBoards = result;
		});
	}

	paginateAvatar(file) {
		const reader = new FileReader();
		reader.onload = (file: any) => {
			this.avatar = file;
		}
		reader.readAsDataURL(file);
		this.avatar = file;
	}

	changeAv() {

	}

	changeAvatar(event?): void {
		const reader = new FileReader();
		reader.onload = (event: any) => {
			this.avatar = event.target.result;
		}
		reader.readAsDataURL(event.target.files[0]);
	}

	removeAvatar() {
		this.avatar = undefined;
		this.candidateForm.controls['avatarURL'].reset();
	}

	prevDef(value, suggestions) {
			if (value.code == 'ArrowDown') {
				if(value.preventDefault){
					value.preventDefault();
				}else{
					event.returnValue = false;
				}
				if (this.selectionCounter < (this.filteredList.length - 1)) {
					this.selectionCounter += 1;
					this.expPosition = 1;
					this.panel.nativeElement.scrollTop += 36.36;
				}
			}
			if (value.code == 'ArrowUp') {
				if(value.preventDefault){
					value.preventDefault();
				}else{
					event.returnValue = false;
				}
				if (this.selectionCounter > 0) {
					this.selectionCounter -= 1;
					this.expPosition = 1;
					this.panel.nativeElement.scrollTop -= 35;
				}
			}
			if (value.code == 'Enter') {
				if(value.preventDefault){
					value.preventDefault();
				}else{
					event.returnValue = false;
				}
			}
			if (value.code != 'Click') {
				this.active = true;
				this.dropdownVisible = false;
				this.dropdownRolesVisible = false;
			}
			if (value.code == 'ArrowRight') {
				if(value.preventDefault){
					value.preventDefault();
				}else{
					event.returnValue = false;
				}
			}
			if (value.code == 'ArrowLeft') {
				if(value.preventDefault){
					value.preventDefault();
				}else{
					event.returnValue = false;
				}
			}
	}
  
	keyPressing(value: any) {
			if (value.code == 'Enter') {
				if (this.selectionCounter >= 0 && this.filteredList.length > 0) {
					this.selectSkill(this.filteredList[this.selectionCounter], this.expPosition);
				}
			}

			if (value.code == 'ArrowRight') {
				if (this.expPosition > 0 && this.expPosition < 3) {
					this.expPosition += 1;
				}
			}

			if (value.code == 'ArrowLeft') {
				if (this.expPosition > 1 && this.expPosition <= 3) {
					this.expPosition -= 1;
				}
			} else if (value.code != 'ArrowDown' && value.code != 'ArrowUp' && value.code != 'Enter' && value.code != 'ArrowRight' && value.code != 'Click') {

				setTimeout(() => {
					this.filter();
				}, 750);
			}
	}

	keyRnIPressing(value: any, name: string) {
		if (value.code === 'Enter') {
			if (name === 'role') {
				if (this.selectionRnICounter >= 0 && this.filteredRnIList.length > 0) {
					this.selectRole(this.filteredRnIList[this.selectionRnICounter]);
				}
			} else if (name === 'industry') {
				if (this.selectionRnICounter >= 0 && this.filteredRnIList.length > 0) {
					this.selectIndustry(this.filteredRnIList[this.selectionRnICounter]);
				}
			}
		} else if (value.code != 'ArrowDown' && value.code != 'ArrowUp' && value.code != 'Enter' && value.code != 'ArrowRight' && value.code != 'Click') {
			if (name === 'role') {
				this.filterRnI(this.queryRoles, this.roles);
			} else if (name === 'industry') {
				this.filterRnI(this.queryIndustries, this.industries);
			}
		}
	}
  
	activeSet() {
		this.active = true;
	}

	activeUnSet() {
		setTimeout(() => {
			this.active = false;
		}, 400);
	}

	activeRolesUnSet() {
		setTimeout(() => {
			this.activeForRoles = false;
		}, 400);
	}

	activeIndustriesUnSet() {
		setTimeout(() => {
			this.activeForIndustries = false;
		}, 400);
	}

	selectRole(role, value?) {
		if (value) {
			value.preventDefault();
		}
		this.selectedRoles.push(role);
		const roleRows = this._elementRef.nativeElement.querySelectorAll('._' + role.id);
		roleRows.forEach(element => {
			this._renderer.setStyle(element, 'display', 'none');
		});

		this.roles = _.without(this.roles, role);
		this.queryRoles = '';
		this.filteredRnIList = [];
	}

	selectIndustry(industry) {
		this.selectedIndustries.push(industry);
		const industriesRows = this._elementRef.nativeElement.querySelectorAll('._' + industry.id);
		industriesRows.forEach(element => {
			this._renderer.setStyle(element, 'display', 'none');
		});
		this.industries = _.without(this.industries, industry);
		this.queryIndustries = '';
		this.filteredRnIList = [];
	}

	filterRnI(query, items) {
		if (query.length == 1) {
			let char = '\\b' + query.toUpperCase();
			let exp = new RegExp(char, 'g');
			this.filteredRnIList = items.filter(el => {
				if (el.get('title') && el.get('title').toUpperCase().match(exp)) {
					return el.get('title');
				}
			}).slice(0, 50);
		} else if (query !== '') {
			this.filteredRnIList = items.filter(el => {
				if (el.get('title')) {
					return el.get('title').toLowerCase().indexOf(query.toLowerCase()) > -1;
				} else {
					return;
				}
			}).slice(0, 50);
			this.selectionRnICounter = 0;
		} else {
			this.filteredRnIList = [];
		}
	}

	filter() {
		if (this.query.length == 1) {
			let char = '\\b' + this.query.toUpperCase();
			let exp = new RegExp(char, 'g');
			this.filteredList = this.skills.filter(el => {
				if (el.get('title')) { }
				if (el.get('title') && el.get('title').toUpperCase().match(exp)) {
					return el.get('title');
				}
			}).slice(0, 400);
		} else if (this.query !== '') {
			this.filteredList = this.skills.filter(el => {
				if (el.get('title')) {
					return el.get('title').toLowerCase().indexOf(this.query.toLowerCase()) > -1;
				} else {
					return;
				}
			}).slice(0, 400);
			this.selectionCounter = 0;
		} else {
			this.filteredList = [];
		}
	}

	activeDropdown(name: string, loc, value?) {}
	
	selectSkill(skill, experience) {
		const skillComponent = this._postJobService.createSkillComponent(skill, experience);
		this.selected.push(skillComponent);
		const skillRows = this._elementRef.nativeElement.querySelectorAll('._' + skill.id);
		skillRows.forEach(element => {
			this._renderer.setStyle(element, 'display', 'none');
		});
		this.skills = _.without(this.skills, skill);
		this.query = '';
		this.filteredList = [];
		this.checkInitialCandidatePropertiesArrays('skills');
	}
	
	getCategorySkills(index) {
		const skillsWrap = this.categoryTitles.toArray()[index].nativeElement;

		if (!skillsWrap.classList.contains('loaded')) {
			const categorySkills = _.filter(this.skills, skill => {
				if (skill.get('categories')) {
					return skill.get('categories').includes(this.categories[index].id);
				} else {
					return;
				}
			});

			categorySkills.forEach(skill => {
				const skillElement = this._renderer.createElement('div');
				const skillTitle = this._renderer.createElement('div');

				const experienceWrap = this._renderer.createElement('div');
				const experienceButtonOne = this._renderer.createElement('div');
				const experienceButtonTwo = this._renderer.createElement('div');
				const experienceButtonThree = this._renderer.createElement('div');

				skillTitle.innerHTML = skill.get('title');

				this._renderer.addClass(skillElement, '_' + skill.id);
				this._renderer.addClass(skillElement, 'skill-row');
				skillElement.addEventListener('click', event => {
					if (event.target.classList.contains("experience-button")) {

					} else {
						this.selectSkill(skill, 1);
					}
				});
				this._renderer.addClass(experienceWrap, 'experience-wrap');

				this._renderer.addClass(skillTitle, 'skill-title');
				this._renderer.addClass(experienceButtonOne, 'experience-button');
				this._renderer.addClass(experienceButtonOne, 'any-button');
				this._renderer.addClass(experienceButtonTwo, 'experience-button');
				experienceButtonOne.addEventListener('click', this.checkInitialCandidatePropertiesArrays('skills'));
				experienceButtonTwo.addEventListener('click', this.checkInitialCandidatePropertiesArrays('skills'));
				experienceButtonThree.addEventListener('click', this.checkInitialCandidatePropertiesArrays('skills'));


				this._renderer.addClass(experienceButtonTwo, 'three-button');

				this._renderer.addClass(experienceButtonThree, 'experience-button');

				this._renderer.addClass(experienceButtonThree, 'four-button');

				experienceButtonOne.innerHTML = 'Any';

				experienceButtonOne.addEventListener('click', event => {
					event.preventDefault();
					this.selectSkill(skill, 1);
				});
				experienceButtonTwo.innerHTML = '3+';

				experienceButtonTwo.addEventListener('click', event => {
					event.preventDefault();
					this.selectSkill(skill, 2);
				});
				experienceButtonThree.innerHTML = '5+';

				experienceButtonThree.addEventListener('click', event => {
					event.preventDefault();
					this.selectSkill(skill, 3);
				});

				this._renderer.appendChild(skillElement, skillTitle);
				this._renderer.appendChild(skillElement, experienceWrap);

				this._renderer.appendChild(experienceWrap, experienceButtonOne);
				this._renderer.appendChild(experienceWrap, experienceButtonTwo);

				this._renderer.appendChild(experienceWrap, experienceButtonThree);
				this._renderer.appendChild(skillsWrap, skillElement);
			});
			this.closeAll();
			this._renderer.addClass(skillsWrap, 'opened');
			this._renderer.addClass(skillsWrap, 'loaded');
		} else {
			if (skillsWrap.classList.contains('opened')) {
				this._renderer.removeClass(skillsWrap, 'opened');
			} else {
				this.closeAll();
				this._renderer.addClass(skillsWrap, 'opened');
			}
		}
	}

	selectJob(job, jobsSelected) {
		if (jobsSelected.indexOf(job) >= 0) {
			return;
		} else {
			jobsSelected.push(job);
		}
	}

	closeAll() {
		const skillsWrap = this.categoryTitles.toArray();
		skillsWrap.forEach(category => {
			this._renderer.removeClass(category.nativeElement, 'opened');
		});
	}

	prevDefRnI(value, name: string, suggestions) {
		if (value.code == 'Enter') {
			value.preventDefault();
		}
		if (value.code == 'ArrowRight') {
			value.preventDefault();
		}
		if (value.code == 'ArrowLeft') {
			value.preventDefault();
		}
		if (value.code == 'ArrowUp') {
			value.preventDefault();
			if (this.selectionRnICounter > 0) {
				this.selectionRnICounter -= 1;
			}
		}
		if (value.code == 'ArrowDown') {
			value.preventDefault();
			if (this.selectionRnICounter < (this.filteredRnIList.length - 1)) {
				this.selectionRnICounter += 1;
			}
		}
		if (value.code != 'Click') {
			if (name === 'industry') {
				this.activeForIndustries = true;
			} else if (name === 'role') {
				this.activeForRoles = true;
			}
			this.dropdownVisible = false;
			this.dropdownRolesVisible = false;
			this.dropdownIndustriesVisible = false;
		}
	}

	prevDfSelecting(value) {
		value.preventDefault();
	}

	remove(skill) {
		this.skills.push(skill.get('skill'));
		this.selected.splice(this.selected.indexOf(skill), 1);

		const skillRows = this._elementRef.nativeElement.querySelectorAll('._' + skill.get('skill').id);
		skillRows.forEach(element => {
			this._renderer.removeStyle(element, 'display');
		});
	}

	roleRemove(role) {
		this.roles.push(role);
		this.selectedRoles.splice(this.selectedRoles.indexOf(role), 1);
		const roleRows = this._elementRef.nativeElement.querySelectorAll('._' + role.id);
		roleRows.forEach(element => {
			this._renderer.removeStyle(element, 'display');
		});
	}

	industryRemove(industry) {
		this.industries.push(industry);
		this.selectedIndustries.splice(this.selectedIndustries.indexOf(industry), 1);
		const industryRows = this._elementRef.nativeElement.querySelectorAll('._' + industry.id);
		industryRows.forEach(element => {
			this._renderer.removeStyle(element, 'display');
		});
	}

	setCVName(event) {
		const ev = event;
		const file = event.target.files[0];
		const reader = new FileReader();
		reader.onload = (ev) => {
			this.CV = file;
		};
		reader.readAsText(file);
	}

	setAttachments(event) {
		const ev = event;
		const file = event.target.files[0];
		const reader = new FileReader();
		reader.onload = (ev) => {
			this.attachment = file;
			console.log(this.attachment);
		};
		reader.readAsText(file);
	}

	addPhone(phone?) {
		if (phone) {
			this.candidateForm.addControl('phone2', new FormControl (phone, Validators.required));
		} else {
			this.candidateForm.addControl('phone2', new FormControl ('', Validators.required));
		};
		this.candidateForm.updateValueAndValidity();
		this.newPhone = true;
		if (phone) {
			this.uploadedCandidates[this.currentCandidateIndex]['phone2'] = phone;
			return;
		}
		if (this.uploadedCandidates.length > 0) {
			this.uploadedCandidates[this.currentCandidateIndex]['phone2'] = '';
		}
	}

	addPrecense() {
		const WebSites = this.candidateForm.get('WebSites') as FormArray;
		WebSites.push(this.createPrecense());
	}

	createPrecense(candidate?): FormGroup {
		if (candidate) {
			return	this._formBuilder.group({
					Type: new FormControl(candidate.WebSites[0].Type),
					Url: new FormControl(candidate.WebSites[0].Url) 
				});
		};
		if (!candidate) {
			return this._formBuilder.group({
				Type: new FormControl(''),
				Url: new FormControl('')
			});
		}
	}

	sendForm() {
		if (this.candidateForm.controls['firstName'].errors) {
			this.firstNameEmpty = true;
		};
		if (this.candidateForm.controls['lastName'].errors) {
			this.lastNameEmpty = true;
		};
		if (this.candidateForm.controls['email'].errors) {
			this.emailEmpty = true;
		};
		if (this.candidateForm.controls['source'].errors) {
			this.sourceEmpty = true;
		};
		if (this.candidateForm.controls['jobBoard'].errors) {
			this.jobBoardEmpty = true;
		};
		if (this.candidateForm.invalid) return;

		this.firstNameEmpty = false;
		this.lastNameEmpty = false;
		this.emailEmpty = false;
		this.sourceEmpty = false;
		this.jobBoardEmpty = true;
		
		let formData =  Object.assign({}, this.candidateForm.value);
		formData['skills'] = this.selected;
		formData['roles'] = this.selectedRoles;
		formData['jobs'] = this.jobsSelected;
		formData['industryExperties'] = this.selectedIndustries;
		formData['experience'] = this.experience;
		formData['education'] = this.educations;
		formData['tags'] = this.tags;
		formData['attachment'] = this.attachment;
		formData['cv'] = this.CV;
		formData['avatarFile'] = this.avatar;
		delete formData.Skills;
		delete formData.job;
		console.log(formData);
	}

	cancelForm() {
		this.closeModal();
	}

	removephone2(noDelete?) {
		this.candidateForm.removeControl('phone2');
		this.candidateForm.updateValueAndValidity();
		this.phone2 = '';
		this.newPhone = false;
		if (noDelete) return;
		if (this.uploadedCandidates.length > 0) {
			delete this.uploadedCandidates[this.currentCandidateIndex].phone2;
		}
	}

	removeWebPrecense(array, i) {
		const WebSites = this.candidateForm.get('WebSites') as FormArray;
		WebSites.controls.splice(i, 1);
	}

	checkSource(value) {
		if (value.name === 'Online JobBoard') {
			this.candidateForm.controls['jobBoard'].setValidators(Validators.required);
			this.candidateForm.controls['jobBoard'].updateValueAndValidity();
		} else {
			this.candidateForm.controls['jobBoard'].clearValidators();
			this.candidateForm.controls['jobBoard'].updateValueAndValidity();			
			this.jobBoardEmpty = false;	
		}
	}

	checkFields() {
		if (this.candidateForm.controls['firstName'].value === '' && !this.candidateForm.controls['firstName'].pristine) {
			this.firstNameEmpty = true;
		} else {
			this.firstNameEmpty = false;			
		};

		if (this.candidateForm.controls['lastName'].value === '' && !this.candidateForm.controls['lastName'].pristine) {
			this.lastNameEmpty = true;
		} else {
			this.lastNameEmpty = false;
		};

		if (this.candidateForm.controls['email'].value === '' && !this.candidateForm.controls['email'].pristine) {
			this.emailEmpty = true;
		} else {
			this.emailEmpty = false;
		};

		if (this.candidateForm.controls['source'].value === '' && !this.candidateForm.controls['source'].pristine) {
			this.sourceEmpty = true;
		} else {
			this.sourceEmpty = false;
		};

		if (this.candidateForm.controls['jobBoard'].value === '' && !this.candidateForm.controls['jobBoard'].pristine) {
			this.jobBoardEmpty = true;
		} else {
			this.jobBoardEmpty = false;
		};
	}

	checkInitialCandidateProperties(index, formValue?) {
		let formData = formValue;
		formData['experience'] = this.experience;
		formData['education'] = this.educations;
		formData['tags'] = this.tags;
		formData['attachment'] = this.attachment;
		formData['cv'] = this.CV;
		delete formData.job;
		if (formData['jobBoard'] !== null) {
			if (formData['jobBoard'].source === null && formData['source'] === undefined) {
				formData['source'] = null;
				formData['jobBoard'] = null;
			};
		}
		this.disabledCandidateSaveChanges = true;
		for (let x in formData) {
			if (formData[x] !== this.uploadedCandidates[index][x] && this.uploadedCandidates[index][x] !== undefined && !Array.isArray(formData[x])) {
				this.disabledCandidateSaveChanges = false;
			};
		} 
	}

	checkphone2() {
		if (this.uploadedCandidates.length > 0) {
			if (this.candidateForm.controls['phone2'].value === this.uploadedCandidates[this.currentCandidateIndex].phone2) {
				this.disabledCandidateSaveChanges = true;
			};
			if (this.candidateForm.controls['phone2'].value !== this.uploadedCandidates[this.currentCandidateIndex].phone2) {
				this.disabledCandidateSaveChanges = false;
			};
		}
	}

	addPropertiesArrays() {
		for (let i = 1; i < this.uploadedCandidates.length; i++) {
			if (!this.uploadedCandidates[i].firstName) {
				this.uploadedCandidates[i]['firstName'] = '';
			};
			if (!this.uploadedCandidates[i].lastName) {
				this.uploadedCandidates[i]['lastName'] = '';
			};
			if (!this.uploadedCandidates[i].Phone) {
				this.uploadedCandidates[i]['Phone'] = '';
			};
			if (!this.uploadedCandidates[i].WebSites) {
				this.uploadedCandidates[i]['WebSites'] = {Type: '', Url: ''};
			};
			if (!this.uploadedCandidates[i].avatarURL) {
				this.uploadedCandidates[i]['avatarURL'] = '';
			};
			if (!this.uploadedCandidates[i].location) {
				this.uploadedCandidates[i]['location'] = '';
			};
			if (!this.uploadedCandidates[i].email) {
				this.uploadedCandidates[i]['email'] = '';
			};
			if (!this.uploadedCandidates[i].industryExperties) {
				this.uploadedCandidates[i]['industryExperties'] = [];
			} else { 
				this.uploadedCandidates[i]['industryExperties'] = this.uploadedCandidates[i].industryExperties;
			};
			if (!this.uploadedCandidates[i].skills) {
				this.uploadedCandidates[i]['skills'] = [];				
			} else {
				this.uploadedCandidates[i]['skills'] = this.uploadedCandidates[i].skills;				
			};
			if (!this.uploadedCandidates[i].roles) {
				this.uploadedCandidates[i]['roles'] = [];				
			} else {
				this.uploadedCandidates[i]['roles'] = this.uploadedCandidates[i].roles;				
			};
			if (!this.uploadedCandidates[i].jobs) {
				this.uploadedCandidates[i]['jobs'] = [];	
				return;			
			} else {
				this.uploadedCandidates[i]['jobs'] = this.uploadedCandidates[i].jobs;				
			};
			this.uploadedCandidates[i]['experience'] = [];
			this.uploadedCandidates[i]['education'] = [];
			this.uploadedCandidates[i]['tags'] = [];
			this.uploadedCandidates[i]['attachment'] = undefined;
			this.uploadedCandidates[i]['cv'] = this.CV;
			this.uploadedCandidates[i]['source'] = undefined;
			this.uploadedCandidates[i]['jobBoard'] = null;
			this.uploadedCandidates[i]['job'] = '';
			this.uploadedCandidates[i]['stage'] = '';
			this.uploadedCandidates[i]['avatarURL'] = '';
			console.log('this.uploadedCandidates[i]', this.uploadedCandidates[i])
		}
		
	}

	checkInitialCandidatePropertiesArrays(arrayOfCandidate?) {
		if (this.uploadedCandidates.length > 0) {
			if (arrayOfCandidate === 'skills') {
				if (this.uploadedCandidates[this.currentCandidateIndex].skills.length === 0 && this.selected.length > 0) {
					this.disabledCandidateSaveChanges = false;
				} else if (this.uploadedCandidates[this.currentCandidateIndex].skills.length === 0 && this.selected.length === 0) {
					this.disabledCandidateSaveChanges = true;			
				} else if (this.uploadedCandidates[this.currentCandidateIndex].skills.length > 0 && this.selected.length === 0) {
					this.disabledCandidateSaveChanges = false;
				} else if (this.uploadedCandidates[this.currentCandidateIndex].skills.length > 0 && this.selected.length > 0) {
					if (this.uploadedCandidates[this.currentCandidateIndex].skills.length > this.selected.length) {
						this.disabledCandidateSaveChanges = false;
					};
					if (this.uploadedCandidates[this.currentCandidateIndex].skills.length < this.selected.length) {
						this.disabledCandidateSaveChanges = false;
					};
					if (this.uploadedCandidates[this.currentCandidateIndex].skills.length === this.selected.length) {
						this.disabledCandidateSaveChanges = true;
						for (let i = 0; i < this.selected.length; i++) {
							if (this.uploadedCandidates[this.currentCandidateIndex].skills[i].id !== this.selected[i].id) {
								this.disabledCandidateSaveChanges = false;
							}
						}
					};
				}
			};
	
			if (arrayOfCandidate === 'roles') {
				if (this.uploadedCandidates[this.currentCandidateIndex].roles.length === 0 && this.selectedRoles.length > 0) {
					this.disabledCandidateSaveChanges = false;
				} else if (this.uploadedCandidates[this.currentCandidateIndex].roles.length === 0 && this.selectedRoles.length === 0) {
					this.disabledCandidateSaveChanges = true;			
				} else if (this.uploadedCandidates[this.currentCandidateIndex].roles.length > 0 && this.selectedRoles.length === 0) {
					this.disabledCandidateSaveChanges = false;
				} else if (this.uploadedCandidates[this.currentCandidateIndex].roles.length > 0 && this.selectedRoles.length > 0) {
					if (this.uploadedCandidates[this.currentCandidateIndex].roles.length > this.selectedRoles.length) {
						this.disabledCandidateSaveChanges = false;
					};
					if (this.uploadedCandidates[this.currentCandidateIndex].roles.length < this.selectedRoles.length) {
						this.disabledCandidateSaveChanges = false;
					};
					if (this.uploadedCandidates[this.currentCandidateIndex].roles.length === this.selectedRoles.length) {
						this.disabledCandidateSaveChanges = true;
						for (let i = 0; i < this.selected.length; i++) {
							if (this.uploadedCandidates[this.currentCandidateIndex].roles[i].id !== this.selectedRoles[i].id) {
								this.disabledCandidateSaveChanges = false;
							}
						}
					};
				}
			};
	
			if (arrayOfCandidate === 'industries') {
				if (this.uploadedCandidates[this.currentCandidateIndex].industryExperties.length === 0 && this.selectedIndustries.length > 0) {
					this.disabledCandidateSaveChanges = false;
				} else if (this.uploadedCandidates[this.currentCandidateIndex].industryExperties.length === 0 && this.selectedIndustries.length === 0) {
					this.disabledCandidateSaveChanges = true;			
				} else if (this.uploadedCandidates[this.currentCandidateIndex].industryExperties.length > 0 && this.selectedIndustries.length === 0) {
					this.disabledCandidateSaveChanges = false;
				} else if (this.uploadedCandidates[this.currentCandidateIndex].industryExperties.length > 0 && this.selectedIndustries.length > 0) {
					if (this.uploadedCandidates[this.currentCandidateIndex].industryExperties.length > this.selectedIndustries.length) {
						this.disabledCandidateSaveChanges = false;
					};
					if (this.uploadedCandidates[this.currentCandidateIndex].industryExperties.length < this.selectedIndustries.length) {
						this.disabledCandidateSaveChanges = false;
					};
					if (this.uploadedCandidates[this.currentCandidateIndex].industryExperties.length === this.selectedIndustries.length) {
						this.disabledCandidateSaveChanges = true;
						for (let i = 0; i < this.selected.length; i++) {
							if (this.uploadedCandidates[this.currentCandidateIndex].industryExperties[i].id !== this.selectedIndustries[i].id) {
								this.disabledCandidateSaveChanges = false;
							}
						}
					};
				}
			};	
	
			if (arrayOfCandidate === 'jobs') {
				if (this.uploadedCandidates[this.currentCandidateIndex].jobs.length === 0 && this.jobsSelected.length > 0) {
					this.disabledCandidateSaveChanges = false;
				} else if (this.uploadedCandidates[this.currentCandidateIndex].jobs.length === 0 && this.jobsSelected.length === 0) {
					this.disabledCandidateSaveChanges = true;			
				} else if (this.uploadedCandidates[this.currentCandidateIndex].jobs.length > 0 && this.jobsSelected.length === 0) {
					this.disabledCandidateSaveChanges = false;
				} else if (this.uploadedCandidates[this.currentCandidateIndex].jobs.length > 0 && this.jobsSelected.length > 0) {
					if (this.uploadedCandidates[this.currentCandidateIndex].jobs.length > this.jobsSelected.length) {
						this.disabledCandidateSaveChanges = false;
					};
					if (this.uploadedCandidates[this.currentCandidateIndex].jobs.length < this.jobsSelected.length) {
						this.disabledCandidateSaveChanges = false;
					};
					if (this.uploadedCandidates[this.currentCandidateIndex].jobs.length === this.jobsSelected.length) {
						this.disabledCandidateSaveChanges = true;
						for (let i = 0; i < this.jobsSelected.length; i++) {
							if (this.uploadedCandidates[this.currentCandidateIndex].jobs[i].id !== this.jobsSelected[i].id) {
								this.disabledCandidateSaveChanges = false;
							}
						}
					};
				}
			}
		}
	}

	checkCandidateFormArrays() {
		if (this.uploadedCandidates.length > 0) {
			const webSites = this.candidateForm.controls['WebSites'] as FormArray;
			webSites.controls.forEach(control => {
				this.uploadedCandidates[this.currentCandidateIndex].WebSites.forEach(website => {
					if (control.value.Type !== website.Type || control.value.Url !== website.Url) {
						this.disabledCandidateSaveChanges = false;
					} else if (control.value.Type === website.Type || control.value.Url === website.Url) {
						this.disabledCandidateSaveChanges = true;
					}
				});
			});
		}
	}

	saveCandidate() {
		let formData = Object.assign({}, this.candidateForm.value);
		formData['skills'] = this.selected.slice();
		formData['roles'] = this.selectedRoles.slice();
		formData['industryExperties'] = this.selectedIndustries.slice();
		formData['experience'] = this.experience.slice();
		formData['education'] = this.educations.slice();
		formData['tags'] = this.tags.slice();
		formData['attachment'] = this.attachment;
		formData['cv'] = this.CV;
		formData['avatarFile'] = this.avatar;
		formData['jobs'] = this.jobsSelected.slice();
		delete formData.Skills;
		delete formData.job;
		for (let x in formData) {
			this.uploadedCandidates[this.currentCandidateIndex][x] = formData[x];
		}
		delete formData.cv;
		formData['candidateId'] = this.uploadedCandidates[this.currentCandidateIndex]['candidateId'];
		formData['developerId'] = this.uploadedCandidates[this.currentCandidateIndex]['developerId'];
		this.disabledCandidateSaveChanges = true;
		this._parse.execCloud('saveCandidateForm', formData);
	}

	disableDateTo(form: FormGroup, input) {
		if (input === true) {
			form.controls['monthDateTo'].reset();
			form.controls['yearDateTo'].reset();
		}
	}

	removeCandidate() {
		this.currentCandidateIndex--;
		this.uploadedCandidates.splice(this.currentCandidateIndex, 1);
	}

	confirmCandidates() {
		this.closeModal();
		this._talentBaseService.confirmCandidatesFromAddCandidate(true);
	}
	
	ngOnDestroy(): void {
		if (this._candidatesRchilliSubscription !== undefined) {
			this.uploadedCandidates = [];
			this._candidatesRchilliSubscription.unsubscribe();
		} 
		if (this.candidateForm !== undefined) this.candidateForm.reset();
	}


}