import { Component, OnInit, OnDestroy, ElementRef, ViewChild, ViewChildren, QueryList, Renderer2 } from '@angular/core';
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
import { PostJobService } from '../../post-job-page/post-job.service';
import * as _ from 'underscore';

@Component({
  selector: 'app-add-candidate',
  templateUrl: './add-candidate.component.html',
  styleUrls: ['./add-candidate.component.scss']
})
export class AddCandidateComponent implements OnInit, OnDestroy {

	public files: Array<Blob> = [];
	public loading: boolean = false;
	public cvUploaded: boolean = true;
	public uploadedCandidates = [];
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

	@ViewChild('scrollpanel', { read: ElementRef }) public panel: ElementRef;
	@ViewChildren('categoryTitles') categoryTitles: QueryList<ElementRef>;
	@ViewChild('categoriesDropdown') categoriesDropdown: ElementRef;
	
  
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
  ) { }

  ngOnInit() {
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

		this._postJobService.getRoles().then(roles => {
			this.roles = roles;
			this.roles = _.sortBy(this.roles, function(roles){ return roles.get("title"); });
		});

		this._postJobService.getIndustries().then(industries => {
			this.industries = industries;
			this.industries = _.sortBy(this.industries, function(industries){ return industries.get("title"); });
		});

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
			jobTitle: undefined,
			companyName: undefined,
			location: undefined,
			yearDateFrom: undefined,
			monthDateFrom: undefined,
			yearDateTo: undefined,
			monthDateTo: undefined,
			currentlyWorks: undefined,
			description: undefined
		});
	}

	buildEducationForm(): void {
		this.educationFormOpened = true;
		this.educationForm = this._formBuilder.group({
			id: undefined,
			schoolInstitutionName: undefined,
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
	}

	addExperience(): void {
		console.log(this.experienceForm.value.id);
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
		}
	}

	addEducation() {
		console.log(this.educationForm.value.id);
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
			// console.log('response',  candidate);
			this.loading = false;
			this.cvUploaded = true;
			if (this.uploadedCandidates.length === 0) this.buildForm(candidate);
					this.uploadedCandidates.push(candidate);
		});
	}

	buildForm(candidate?): void {
	
		if (!candidate) {
		this.candidateForm = this._formBuilder.group({
			firstName: undefined,
			lastName: undefined,
			// Avatar: undefined,
			City: undefined,
			Phone: undefined,
			email: undefined,
			WebPrecense: undefined,
			Source: undefined,
			JobBoard: undefined,
			Job: undefined,
			Stage: undefined,
			skills: undefined,
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
			skills: candidate.skills,
		});
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

	changeAvatar(event, avatarInput): void {
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

	ngOnDestroy(): void {
		if (this._candidatesRchilliSubscription !== undefined) this._candidatesRchilliSubscription.unsubscribe();
		if (this.candidateForm !== undefined) this.candidateForm.reset();
	}


}
