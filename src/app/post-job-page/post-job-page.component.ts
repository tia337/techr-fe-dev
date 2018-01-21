import { Component, OnInit, ViewChild, AfterViewInit, Input, Renderer2, ElementRef, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { FormBuilder, FormGroup, Validator } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import 'rxjs/add/operator/debounceTime';
import { MatDatepicker } from '@angular/material';

import { Parse } from '../parse.service';
import { Login } from '../login.service';
import { PostJobService } from './post-job.service';

import { IInfoOptions } from '../shared/info-modal/info-modal.interface';

import { AlertComponentPost } from './alert/alert.component';
import { AlertComponent } from '../shared/alert/alert.component';

import { QueryList, ViewChildren } from '@angular/core';
import { FormControl } from '@angular/forms';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
import { MatAutocompleteTrigger } from '@angular/material';
import * as _ from 'underscore';
import { FeedbackAlertComponent } from 'app/core/feedback-alert/feedback-alert.component';
import { RootVCRService } from '../root_vcr.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DashboardService } from 'app/dashboard/dashboard.service';
import { ContractStatus } from 'app/shared/utils';
import { MatSnackBar } from '@angular/material';

import { Modal1Component } from './modal1/modal1.component'

@Component({
	selector: 'app-post-job-page',
	templateUrl: './post-job-page1.component.html',
	styleUrls: ['./post-job-page1.component.scss'],
	providers: [CurrencyPipe]
})
export class PostJobPageComponent implements OnInit, AfterViewInit {

	places: any;

	sourcingTalentInfo: IInfoOptions = {
		header: 'Tackle talent shortage straight on! Source multi-country',
		content: 'Which countries would you be willing to source talent from? Notify top talent globally.'
	};

	workingVisaInfo: IInfoOptions = {
		header: 'Ready to go the extra-mile for the right candidate?',
		content: 'Let talent know that you are willing to sponsor work permit.'
	};
	scorecardInfo: IInfoOptions = {
		header: 'Asses candidates as a team!',
		content: 'Link a scorecard to the job so that you and your team can standardise candidate assessment and scoring.'
	};



	@ViewChild('searchEssentialSkills') searchEssentialSkills: ElementRef;

	@ViewChild('searchIndustryExpertise') searchIndustryExpertise: ElementRef;
	@ViewChild('searchRoleTags') searchRoleTags: ElementRef;
	@ViewChild('searchOptionalSkills') searchOptionalSkills: ElementRef;
	@Input() contractObj;


	adminLevel:number;

	contractForm: FormGroup;

	currentUser = this._parse.Parse.User.current() || null;
	logo: any;
	private countriesSourcing: Array<any> = [];

	private programingSkills: Array<any> = [];
	private skillCategories: Array<any> = [];
	private optionalSkills: Array<any> = [];
	private finalRoles: Array<any> = [];
	private currentContract: any;
	private formSubscription: any;
	private formSkillsSubscription: any;
	private editable: boolean;

	private flexibilityValue: number;
	// private selectedHourly = false;
	countriesFilter;
	salaryCurrencies;
	activeSkillsCategory;
	activeLine = 0;
	@ViewChild('rangeSlider') rangeSlider;
	@ViewChild('companyLogo') companyLogo;
	@ViewChild('datePicker') datePicker: MatDatepicker<any>;
	range: any;

	rangeConfig: any;
	rangeLabel: string;
	asap: string;

	minhourly;
	maxhourly;

	jobVal = 0;

	freelance: boolean;

	JobLocationFEInput: string;

	placeSuggestions = false;

	matSpinnerActive = false;

	postLocation;

	jobCity;
	JobState;
	jobCountry;
	postCode;

	companyDescriptionMaxLength = 900;

	jobDescriptionMaxLength = 4000;
	jobBenefitsMaxLength = 500;

	sponsoringBool = false;

	alertHappend = false;

	test = false;

	postingLoader: boolean = false;

	// SKILLS AND ROLES AND INDUSTRIES VARIABLES

	myControl: FormControl = new FormControl();
	public selected = [];
	public selectionCounter = 0;
	public expPosition = 1;
	public active = false;
	public query = '';
	public filteredList = [];

	public selectedRoles = [];
	public activeForRoles = false;
	public queryRoles = '';

	public selectedIndustries = [];
	public activeForIndustries = false;
	public queryIndustries = '';

	public filteredRnIList = [];
	public selectionRnICounter = 0;
	private client;

	categories;
	skills;

	roles;

	industries;


	dropdownVisible: boolean;
	dropdownRolesVisible: boolean;
	dropdownIndustriesVisible: boolean;

	durationFrom: any[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
	durationTo: any[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

	hideSalaryTips = true;

	toShowInfoSourcing = false;
	toShowInfoPermit = false;
	isJobPostShowAlert = true;

	@ViewChildren('categoryTitles') categoryTitles: QueryList<ElementRef>;
	@ViewChild('categoriesDropdown') categoriesDropdown: ElementRef;
	@ViewChild('scrollpanel', {
		read: ElementRef
	}) public panel: ElementRef;
	@ViewChild('maxInput') maxInput;
	@ViewChild('optionTo') optionTo;
	optionToSelect;
	constructor(
		private _formBuilder: FormBuilder,
		private _parse: Parse,
		private _login: Login,
		private _cp: CurrencyPipe,
		private _router: Router,
		private _renderer: Renderer2,
		private _elementRef: ElementRef,
		private _postJobService: PostJobService,
		private _vcr: ViewContainerRef,
		private _cfr: ComponentFactoryResolver,
		private _root_vcr: RootVCRService,
		private _dashboard: DashboardService,
		public snackBar: MatSnackBar
	) {
		_postJobService.checkIsPostJobShowAlert().then(isShowAlert => this.isJobPostShowAlert = isShowAlert);
	}

	ngOnInit() {
		// FOR SKILLS ROLES AND INDUSTRIES
		this.adminLevel = this._postJobService.checkAdmin();
		console.log(this.adminLevel);

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

		this.editable = this.contractObj ? false : true;

		this.currentContract = this.contractObj;
		if (this.contractObj) {
			// console.log('LOGO: ', this.contractObj.get('logo'));
			const asapLocal = this.contractObj.get('status') === ContractStatus.draft ? true : this.contractObj.get('isASAP');
			this.contractForm = this._formBuilder.group({
				postedAt: this.contractObj.get('postedAt'),
				logo: null,
				// logo: this.contractObj.get('logo').url,
				companyName: this.contractObj.get('companyName'),
				companyDescription: this.contractObj.get('companyDescription'),
				title: this.contractObj.get('title'),
				contractDescription: this.contractObj.get('contractDescription'),
				companyDescriptionHidden: this.contractObj.get('companyDescriptionHidden'),
				jobBenefits: this.contractObj.get('jobBenefits'),
				jobBenefitsHidden: this.contractObj.get('jobBenefitsHidden'),
				jobType: this.contractObj.get('jobType') ? this.contractObj.get('jobType').toString() : null,
				status: this.contractObj.get('status'),
				isASAP: asapLocal,
				startContractDate: asapLocal ? null : this.contractObj.get('startContractDate'),
				minRate: this.contractObj.get('minRate'),
				minAnnualRate: this.contractObj.get('minAnnualRate'),
				maxRate: this.contractObj.get('maxRate'),
				maxAnnualRate: this.contractObj.get('maxAnnualRate'),
				salaryPreferencesHidden: this.contractObj.get('salaryPreferencesHidden'),
				JobLocationFEinput: this.contractObj.get('JobLocationFEinput'),
				Flexibility: this.contractObj.get('Flexibility'),
				sponsoringWorkVisa: this.contractObj.get('sponsoringWorkVisa'),
				owner: this.contractObj.get('owner'),
				countriesSourcing: [],
				isRatedHourly: this.contractObj.get('isRatedHourly'),

				isTR: this.contractObj.get('isTR'),
				SalaryCurrency: this.contractObj.get('SalaryCurrency'),

				Client: this.contractObj.get('Client'),

				postLocation: this.contractObj.get('postLocation'),
				Min_hourly: this.contractObj.get('Min_hourly'),
				Max_hourly: this.contractObj.get('Max_hourly'),
				durationMin: this.contractObj.get('durationMin'),
				durationMax: this.contractObj.get('durationMax'),
			});
			this.selectedIndustries = this.contractObj.get('industryTags');
			this.selected = this.contractObj.get('programingSkills');
			this.selectedRoles = this.contractObj.get('roles');

			this.loadCountries();
			this.jobVal = this.contractObj.get('jobType');
			this.asap = asapLocal.toString();

			this.contractObj.get('jobType');
			this.initSalaryRange(this.contractObj.get('jobType'));
			if (this.contractObj.get('minRate') && this.contractObj.get('maxRate') && !this.contractForm.value.isRatedHourly) {
				this.range = [this.contractObj.get('minRate'), this.contractObj.get('maxRate')];
			} else if (this.contractObj.get('minAnnualRate') && this.contractObj.get('maxAnnualRate') && !this.contractForm.value.isRatedHourly) {
				this.range = [this.contractObj.get('minAnnualRate'), this.contractObj.get('maxAnnualRate')];
			} else if (this.contractObj.get('Min_hourly') && this.contractObj.get('Max_hourly') && this.contractForm.value.isRatedHourly) {
				this.range = [this.contractObj.get('Min_hourly'), this.contractObj.get('Max_hourly')];
			}
			this.optionToSelect = this.contractObj.get('durationMax');
		} else {
			this.contractForm = this._formBuilder.group({
				logo: null,
				companyName: '',
				companyDescription: '',
				title: '',
				contractDescription: '',
				companyDescriptionHidden: false,
				jobBenefits: '',
				jobBenefitsHidden: false,
				jobType: 0,
				status: 3,
				isASAP: false,
				startContractDate: null,
				minRate: null,
				minAnnualRate: null,
				maxRate: null,
				maxAnnualRate: null,
				salaryPreferencesHidden: false,
				JobLocationFEinput: '',
				Flexibility: 0,
				sponsoringWorkVisa: false,
				owner: this.currentUser,
				countriesSourcing: [],
				programingSkills: [],
				optionalSkills: [],
				industryTags: [],
				isTR: true,
				Client: null,
				SalaryCurrency: null,
				postLocation: undefined,
				Min_hourly: undefined,
				Max_hourly: undefined,
				durationMin: undefined,
				durationMax: undefined,
				postedAt: undefined,
				isRatedHourly: false
			});

		}
		this._postJobService.getCurrencies().then(currencies => {
			this.salaryCurrencies = currencies;
			const defaultCurrency = currencies.find(currency => {
				return currency.get('Currency') === 'GBP';
			});
			this.contractForm.controls.SalaryCurrency.patchValue(defaultCurrency);
		});
		if (!this.editable && this.contractForm) {
			this.contractForm.disable();
		}
		if(!this.editable){
			this.formSkillsSubscription = this.contractForm.valueChanges.debounceTime(500).subscribe(
				res=>{
					console.log();
				}
			);
		}
		if (!this.contractObj) {
			this.formSubscription = this.contractForm.valueChanges.debounceTime(3000).subscribe(
				res => {
					if (this.contractForm.dirty) {
						if (!this.currentContract) {
							this.createContract(this.contractForm.value);
						} else if (this.currentContract) {
							this.initContract();
							this.updateContract(this.contractForm.value);
						}
					}
				}
			);
		}
	}
	loadCountries() {
		if (this.countriesSourcing.length == 0) {
			const query = this._parse.Query('Country');
			query.ascending('Country');
			query.find().then(res => {
				res.forEach((country, index) => {
					this.countriesSourcing.push({
						country: country,
						checked: false
					});

					if (this.contractObj) {
						this.contractObj.get('countriesSourcing').forEach(countryObj => {
							if (country.id == countryObj.id) {
								this.countriesSourcing[index].checked = true;
							}
						});
					}
				});
			});
		}
		return 'success';
	}

	enableEdit(value: boolean) {
		this.editable = value;
		this.contractForm.enable();
		this.contractForm.controls['companyName'].disable();
	}
	expand(event) {
		const currentCategoryLabel = event.target;
		const currentCategory = this._renderer.nextSibling(currentCategoryLabel).nextElementSibling;
		if (currentCategoryLabel.classList.contains('expanded')) {
			this._renderer.removeClass(currentCategoryLabel, 'expanded');
			this._renderer.removeClass(currentCategory, 'expanded');
		} else {
			this._renderer.addClass(currentCategoryLabel, 'expanded');
			this._renderer.addClass(currentCategory, 'expanded');
		}
	}

	expandAll(modal: 'essentialSkills' | 'optionalSkills') {
		const dropdowns = document.getElementsByClassName('category-skills');
		const dropdownLabels = document.getElementsByClassName('category-name');
		for (let i = 0; i < dropdowns.length; ++i) {
			this._renderer.addClass(dropdowns[i], 'expanded');
			this._renderer.addClass(dropdownLabels[i], 'expanded');
		}
	}

	colapseAll() {
		const dropdowns = document.getElementsByClassName('category-skills');
		const dropdownLabels = document.getElementsByClassName('category-name');

		for (let i = 0; i < dropdowns.length; ++i) {
			this._renderer.removeClass(dropdowns[i], 'expanded');
			this._renderer.removeClass(dropdownLabels[i], 'expanded');

		}
	}

	ngAfterViewInit() {
		if (this.currentUser) {
			return this._parse.Parse.User.current().get('Client_Pointer').fetch().then(client => {
				this.client = client;
				if (this.contractObj && this.contractObj.has('logo')) {
					this.logo = this.contractObj.get('logo');
					this.initLogo(this.logo.url());
				} else if ((!this.contractObj || !this.contractObj.has('logo')) && client.get('ClientLogo')) {
					this.logo = client.get('ClientLogo');
					this.initLogo(this.logo.url());
				} else {
					this.initLogo();
				}
				this.contractForm.patchValue({
					companyName: client.get('ClientName')
				});
				this.contractForm.patchValue({
					companyDescription: client.get('Company_Description')
				});
				this.contractForm.patchValue({
					jobBenefits: client.get('Company_Benefits')
				});
			},
				error => {
					console.error('You should be logged in');
				}
			);
		}
	}

	getLogo(event): any {
		if (event.target.files) {
			console.log('files exists');
			const logo = event.target.files[0];
			this.logo = this._parse.File(logo.name, logo);
			this.initLogo(window.URL.createObjectURL(logo));
		}
	}

	private initLogo(url?: string) {
		if (this.companyLogo) {
			this.companyLogo.nativeElement.src = url ? url : 'http://placehold.it/360x160/fff/000?text=TAP+TO+ADD+YOUR+COMPANY+LOGO';
		}
	}


	initContract(callback?: Function) {
		this.contractForm.value.postLocation = this.postLocation;
		this.contractForm.value.jobCity = this.jobCity;
		this.contractForm.value.startContractDate = new Date(this.contractForm.value.startContractDate);
		this.contractForm.value.isASAP = this.asap === 'true' ? true : false;
		this.contractForm.value.logo = this.logo;
		console.log(this.logo);
		this.contractForm.value.Client = this.currentUser.get('Client_Pointer');
		this.contractForm.value.jobCountry = this.jobCountry;
		this.contractForm.value.JobState = this.JobState;
		if (this.postCode) {
			this.contractForm.value.postCode = this.postCode;
		}
		this.contractForm.value.jobType = this.jobVal;
		this.contractForm.value.programingSkills = this.selected;
		this.contractForm.value.roles = this.selectedRoles;
		this.contractForm.value.industryTags = this.selectedIndustries;
		if (!this.contractForm.value.durationMin && this.contractForm.value.durationMax) {
			this.contractForm.value.durationMin = this.contractForm.value.durationMax;
		} else if (this.contractForm.value.durationMin && !this.contractForm.value.durationMax) {
			this.contractForm.value.durationMax = this.contractForm.value.durationMin;
		}

		if (this.contractForm.value.jobType) {
			this.contractForm.value.minRate = this.range[0];
			this.contractForm.value.maxRate = this.range[1];
		}

		if (this.contractForm.value.isRatedHourly == true && this.rangeLabel == 'Salary') {
			this.contractForm.value.Min_hourly = this.contractForm.value.minRate;
			this.contractForm.value.minRate = undefined;
			this.contractForm.value.Max_hourly = this.contractForm.value.maxRate;
			this.contractForm.value.maxRate = undefined;
		}

		if (this.rangeLabel == 'Annual salary') {
			this.contractForm.value.minAnnualRate = this.contractForm.value.minRate;
			this.contractForm.value.minRate = undefined;
			this.contractForm.value.maxAnnualRate = this.contractForm.value.maxRate;
			this.contractForm.value.maxRate = undefined;
		}

		if (!this.contractForm.value.postedAt) {
			this.contractForm.value.postedAt = new Date();
		}

		this.contractForm.value.countriesSourcing = this.countriesSourcing
			.filter(country => country.checked)
			.map(checkedCountry => checkedCountry.country);

		if (this.contractForm.controls.JobLocationFEinput.dirty &&
			this.contractForm.controls.JobLocationFEinput.value &&
			this.contractForm.controls.JobLocationFEinput.value.length != 0) {
			this._parse.execCloud('getCoordinates', {
				address: this.contractForm.value.JobLocationFEinput
			})
				.then(location => {
				}).then(() => {
					callback();
				});
		} else {
			if (callback) {
				callback();
			}
		}
	}

	suggestionsSet(value?) {
		setTimeout(() => {
			if (this.contractForm.value.JobLocationFEinput.length != 0) {
				this.matSpinnerActive = true;
				this._parse.execCloud('getSuggestedPlaces', {
					address: this.contractForm.value.JobLocationFEinput
				})
					.then(suggestions => {
						this.places = suggestions;
						this.matSpinnerActive = false;
					});
			}
		}, 500);
	}

	showPlace(place: any) {
		this.placeSuggestions = false;
		this.JobLocationFEInput = place.description;
		this._parse.execCloud('getPlaceDetails', {
			placeId: place.place_id
		})
			.then(placeObj => {
				this.postLocation = this._parse.GeoPoint(placeObj.location.lat, placeObj.location.lng);
				this.jobCity = placeObj.city;
				this.jobCountry = placeObj.country;
				this.JobState = placeObj.state;
				if (placeObj.postcode) {
					this.postCode = placeObj.postcode;
				}
			});
	}

	uncheckItem(item: any, isEssentialSkill?: boolean) {
		if (this.editable) {
			if (isEssentialSkill) {
				item.expDuration = 0;
			} else {
				item.checked = false;
			}
		}
	}
	createContract(newContract: any): any {
		this.initContract();
		const contract = this._parse.Object('Contract');
		return contract.save(newContract).then(contractResult => {
			this.currentContract = contractResult;
			if (this._dashboard.isFirst === 0 || this._dashboard.isFirst === -1) {
				this._dashboard.isFirst = 1;
			}
			this.closeSnackBar();
			return this.currentContract;
		}, error => {
			console.error(error);
			this.errorSnackBar();
			return error;
		});
	}

	updateContract(options: any, callback?: Function) {
		const query = this._parse.Query('Contract');
		query.get(this.currentContract.id).then(res => {
			if (this.contractObj && this.contractObj.get('status') === ContractStatus.draft) {
				options.status = ContractStatus.active;
				options.postedAt = new Date();
				res.save(options).then(saveResult => {
					this.showAlert();
					this.closeSnackBar();
					console.log(saveResult, 'Save Result in UpdateContract for DRAFTS');
					this._router.navigateByUrl('/jobs');
				});
			} else {
				res.save(options).then(saveResult => {
					this.closeSnackBar();
					console.log(saveResult, 'Save Result in UpdateContract for Active');
					callback();
				});
			}
		});
	}

	updateClient() {
		if (!this.client.get('ClientLogo')) {
			this.client.set('ClientLogo', this.logo);
			this._postJobService.logoUpdate.emit();
		}
		if (!this.client.get('Company_Description')) {
			this.client.set('Company_Description', this.contractForm.value.companyDescription);
		}
		if (!this.client.get('Company_Benefits')) {
			this.client.set('Company_Benefits', this.contractForm.value.jobBenefits);
		}
		this.client.save();
	}

	postJob() {
		this.postingLoader = true;
		if (!this.contractObj) {
			this.formSubscription.unsubscribe();
			if (this.currentContract) {
				this.initContract();
				if (this.accessCheck() === true) {
					this.updateClient();
					this.showAlert();
					this.updateContract(this.contractForm.value, () => {
						this.setActiveStatus()
							.then(() => {
								console.log(this.currentContract, 'IF currentContract');
								this._router.navigateByUrl('/jobs');
							});
					});
				}
			} else {
				this.initContract();
				if (this.accessCheck() === true) {
					this.updateClient();
					this.showAlert();
					this.createContract(this.contractForm.value)
						.then(() => this.setActiveStatus())
						.then(() => {
							console.log(this.currentContract, 'IF ELSE currentContract');
							this._router.navigateByUrl('/jobs');
						});
				}
			}
		} else {
			this.initContract(() => {
				if (this.accessCheck()) {
					this.updateClient();
					this.showEditAlert();
					this.updateContract(this.contractForm.value, () => {
						console.log(this.currentContract, 'ELSE in PostJob()');
						this.editable = false;
						this.contractForm.disable();
					});
				}
			});
		}
	}
	locationKeyPress(event) {
		if (event.code === 'Enter') {
			this.showPlace(this.places[this.activeLine]);
		}
		if (event.code === 'ArrowUp' && this.activeLine >= 0) {
			this.activeLine -= 1;
		}
		if (event.code === 'ArrowUp' && this.activeLine > 0) {
			this.activeLine += 1;
		}

		this.suggestionsSet();
	}

	selectPlace(i) {
		this.activeLine = i;
		this.showPlace(this.places[i]);
	}

	showAlert(callback?: Function) {
		if (this.isJobPostShowAlert == undefined || this.isJobPostShowAlert == false) {
			this._root_vcr.createComponent(AlertComponentPost);
		} else {
			const alert = this._root_vcr.createComponent(AlertComponent);
			alert.content = `Congratulations your job has been successfully posted`;
			alert.type = 'congrats';
			alert.addButton({
				type: 'primary',
				title: 'Ok',
				onClick: () => {
					this._root_vcr.clear();
				}
			});
			alert.title = 'Job Successfully posted!';
		}
		this.postingLoader = false;
	}

	setActiveStatus(): any {
		let query = this._parse.Query('Contract');
		query.equalTo('objectId', this.currentContract.id);
		return query.first().then(contract => {
			contract.set('status', 1);
			contract.save();
		});
	}

	showContract() {
		this.initContract();
	}
	initRate(value) {
		this.initSalaryRange(this.jobVal);
	}

	initSalaryRange(type: number, jobVal?: number) {
		if (jobVal) {
			this.jobVal = jobVal;
		}
		let rangeMin;
		let rangeMax;
		let rangeStep;

		if (type === 1) {
			this.freelance = false;
			rangeMin = 15000;
			rangeMax = 150000;
			rangeStep = 5000;
			this.rangeLabel = 'Annual salary';
		} else if (type === 2 || type === 3) {
			if (!this.contractForm.value.isRatedHourly) {
				this.freelance = true;
				rangeMin = 1;
				rangeMax = 3000;
				rangeStep = 1;
				this.rangeLabel = 'Salary';
			} else if (this.contractForm.value.isRatedHourly) {
				this.freelance = true;
				rangeMin = 1;
				rangeMax = 500;
				rangeStep = 1;
				this.rangeLabel = 'Salary';
			}
		} else if (this.rangeConfig) {
			rangeMin = this.rangeConfig.range.min;
			rangeMax = this.rangeConfig.range.max;
			rangeStep = this.rangeConfig.step;
		} else {
			rangeMin = 0;
			rangeMax = 150000;
			rangeStep = 5000;
		}

		this.range = [rangeMin, rangeMax];

		this.rangeConfig = {
			behaviour: 'drag',
			connect: true,
			step: rangeStep,
			tooltips: [true, true],
			range: {
				min: rangeMin,
				max: rangeMax
			},
			format: {
				to: (value) => {
					return this._cp.transform(value, this.contractForm.value.SalaryCurrency.get('Currency'), true, '1.0-0');
				},
				from: (value) => {
					return parseInt(value.replace(/([^\d])+/g, ''), 10);
				}
			}
		};

		if (this.rangeSlider) {
			this.rangeSlider.slider.updateOptions({
				range: {
					min: rangeMin,
					max: rangeMax
				},
				step: rangeStep
			});
			this.range = [rangeMin, rangeMax];
		}
	}

	currencyChange() {
		if (this.rangeSlider) {
			this.rangeSlider.slider.updateOptions({
				start: [this.contractForm.value.minRate, this.contractForm.value.maxRate],
			});
		}
	}

	getProfile() {
		if (this._parse.Parse.User.current()) {
			return this._parse.Parse.User.current();
		}
		return;
	}

	changeFlexibility(val: number) {
		this.flexibilityValue = val;
	}

	datePick() {
		this.datePicker.open();
	}


	showInfo(name: string) {
		if (name == 'sourcing') {
			this.toShowInfoSourcing = true;
			setTimeout(() => {
				this.toShowInfoSourcing = false;
			}, 8000);
		} else if (name == 'permit') {
			this.toShowInfoPermit = true;
			setTimeout(() => {
				this.toShowInfoPermit = false;
			}, 8000);
		}
	}

	// FOR SKILLS ROLES AND INDUSTRIES

	closeAll() {
		const skillsWrap = this.categoryTitles.toArray();
		skillsWrap.forEach(category => {
			this._renderer.removeClass(category.nativeElement, 'opened');
		});
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
					console.log(event.target);
					console.log(event.target.children.length);
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
	prevDfSelecting(value) {
		value.preventDefault();
	}
	scrollDropdown(el, visible) {
		let value;
		if (visible = 'skills') {
			value = this.dropdownVisible;
		} else if (visible = 'role') {
			value = this.dropdownRolesVisible;
		} else if (visible = 'industry') {
			value = this.dropdownIndustriesVisible;
		}
		if (value == true) {
			el.scrollIntoView({
				behavior: 'instant',
				block: 'center',
				inline: 'nearest'
			});
		}
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
		console.log(this.query);
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
			}, 100);
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
	prevDefGeneral(value, code?) {
		if (value.code == 'Enter') {
			value.preventDefault();
			if (code == 'min') {
				this.maxInput.nativeElement.focus();
			}
			if (code == 'max') {
				this.maxInput.nativeElement.blur();
			}
		}
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
				if (this.activeForIndustries === true) {
					suggestions.scrollIntoView({
						behavior: 'instant',
						block: 'center',
						inline: 'nearest'
					});
				}
			} else if (name === 'role') {
				this.activeForRoles = true;
				if (this.activeForRoles === true) {
					suggestions.scrollIntoView({
						behavior: 'instant',
						block: 'center',
						inline: 'nearest'
					});
				}
			}
			this.dropdownVisible = false;
			this.dropdownRolesVisible = false;
			this.dropdownIndustriesVisible = false
		}
		
	}

	prevDef(value, suggestions) {
		if (value.code == 'ArrowDown') {
			if(value.preventDefault){
				value.preventDefault();
			}else{
				event.returnValue = false;
			}	
			console.log("Arrow down");
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
			console.log("Enter prevdef");
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
			if (this.active === true) {
				suggestions.scrollIntoView({
					behavior: 'instant',
					block: 'center',
					inline: 'nearest'
				});
			}
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

	remove(skill) {
		this.skills.push(skill.get('skill'));
		this.selected.splice(this.selected.indexOf(skill), 1);

		const skillRows = this._elementRef.nativeElement.querySelectorAll('._' + skill.get('skill').id);
		skillRows.forEach(element => {
			this._renderer.removeStyle(element, 'display');
		});
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

	activeDropdown(name: string, loc, value?) {
		if (this.dropdownIndustriesVisible != true || this.dropdownRolesVisible != true || this.dropdownVisible != true) {
			loc.scrollIntoView({
				behavior: 'smooth',
				block: 'center',
				inline: 'nearest'
			});
		}
		if (this.dropdownIndustriesVisible === true || this.dropdownRolesVisible === true || this.dropdownVisible === true) {
			// value.preventDefault();
			// value.returnValue = false;
			// value.preventDefault ? value.preventDefault() : (value.returnValue = false);
			// console.log(value.preventDefault());
			// value.target.click();
			value.returnValue = false;
			console.log(value);
			// value.preventDefault();
		}
		if (name == 'industries' && (this.dropdownIndustriesVisible === true)) {
			this.dropdownIndustriesVisible = false;
		} else if (name == 'roles' && (this.dropdownRolesVisible === true)) {
			this.dropdownRolesVisible = false;
		} else if (name == 'skills' && (this.dropdownVisible === true)) {
			this.dropdownVisible = false;
		}
		if (name == 'skills' && (this.dropdownRolesVisible === true || this.dropdownIndustriesVisible === true)) {
			this.dropdownRolesVisible = false;
			this.dropdownIndustriesVisible = false;
		} else if (name == 'roles' && (this.dropdownVisible === true || this.dropdownIndustriesVisible === true)) {
			this.dropdownIndustriesVisible = false;
			this.dropdownVisible = false;
		} else if (name == 'industries' && (this.dropdownRolesVisible === true || this.dropdownVisible === true)) {
			this.dropdownRolesVisible = false;
			this.dropdownVisible = false;
		}
		console.log(this.dropdownVisible);
		console.log(this.dropdownRolesVisible);
		console.log(this.dropdownIndustriesVisible);
	}

	accessCheck() {
		const notFilledFields = [];
		const today = new Date();
		if (this.contractForm.value.title === '') {
			notFilledFields.push('Job title');
		}
		if (this.contractForm.value.contractDescription.length < 200) {
			notFilledFields.push('Minimum job description length is 200');
		}
		if (this.contractForm.value.programingSkills === null || this.contractForm.value.programingSkills.length === 0) {
			notFilledFields.push('Skills: you should choose at least 1');
		}
		if (this.contractForm.value.roles === null || this.contractForm.value.roles.length === 0) {
			notFilledFields.push('Roles: you should choose at least 1');
		}
		if (this.contractForm.value.jobType === 0 || !this.contractForm.value.jobType) {
			notFilledFields.push('Job Type');
		}
		if (this.asap != 'true' && this.contractForm.value.startContractDate < today) {
			notFilledFields.push('Start Date');
		}
		if (this.contractForm.value.JobLocationFEinput === '') {
			notFilledFields.push('Job Location');
		}
		if (this.contractForm.value.Flexibility === 0) {
			notFilledFields.push('Flexibility');
		}
		if (this.contractForm.value.companyName === '') {
			notFilledFields.push('Company Name');
		}
		if (notFilledFields.length === 0) {
			return true;
		} else if (notFilledFields.length > 0) {
			this.alertHappend = true;
			let list = '';
			const alert = this._root_vcr.createComponent(AlertComponent);
			alert.title = 'Mandatory fields required';
			alert.type = 'sad';
			alert.contentAlign = 'left';
			for (const item of notFilledFields) {
				list += '- ' + item + '<br>';
			}
			alert.content = list + '<a style = "font-size: 12px; margin-top: 10px;">Mandatory fields help you maximize reaching the right talent.</a>';
			alert.addButton({
				title: 'Close',
				type: 'primary',
				onClick: () => {
					this._root_vcr.clear();
					if (notFilledFields[0] === 'Job title') {
						const el = document.getElementById('jobTitle');
						el.scrollIntoView({
							behavior: 'instant',
							block: 'center',
							inline: 'nearest'
						});
					} else if (notFilledFields[0] === 'Minimum description length is 200') {
						const el = document.getElementById('jobDescription');
						el.scrollIntoView({
							behavior: 'instant',
							block: 'center',
							inline: 'nearest'
						});
					} else if (notFilledFields[0] === 'Skills: you should choose at least 1') {
						const el = document.getElementById('skillsinput');
						el.scrollIntoView({
							behavior: 'instant',
							block: 'center',
							inline: 'nearest'
						});
					}else if (notFilledFields[0] === 'Roles: you should choose at least 1') {
						const el = document.getElementById('skillsinput');
						el.scrollIntoView({
							behavior: 'instant',
							block: 'center',
							inline: 'nearest'
						});
					} else if (notFilledFields[0] === 'Job Type') {
						const el = document.getElementById('job-type-title');
						el.scrollIntoView({
							behavior: 'instant',
							block: 'center',
							inline: 'nearest'
						});
					} else if (notFilledFields[0] === 'Start Date') {
						const el = document.getElementById('start-date-title');
						el.scrollIntoView({
							behavior: 'instant',
							block: 'center',
							inline: 'nearest'
						});
					} else if (notFilledFields[0] === 'Job Location') {
						const el = document.getElementById('job-location-title');
						el.scrollIntoView({
							behavior: 'instant',
							block: 'center',
							inline: 'nearest'
						});
					} else if (notFilledFields[0] === 'Flexibility') {
						const el = document.getElementById('flexibility-title');
						el.scrollIntoView({
							behavior: 'instant',
							block: 'center',
							inline: 'nearest'
						});
					} else if (notFilledFields[0] === 'Company Name') {
						const el = document.getElementById('company-name-title');
						el.scrollIntoView({
							behavior: 'instant',
							block: 'center',
							inline: 'nearest'
						});
					}
				}
			});
		}
		this.postingLoader = false;
	}

	durFromSelect(optionFrom) {
		this.durationTo = this.durationFrom.slice(optionFrom - 1);
		this.optionToSelect = null;
	}
	durToSelect(optionT) {
		optionT = null;
	}

	updateFilter(value) {
		this.countriesFilter = value;
	}

	showEditAlert() {
		const alert = this._root_vcr.createComponent(AlertComponent);
		alert.content = `Congratulations your job has been successfully edited`;
		alert.addButton({
			type: 'primary',
			title: 'Ok',
			onClick: () => {
				this._root_vcr.clear();
			}
		});
		alert.title = 'Job Successfully edited';
	}
	feedbackCreation() {
		this._root_vcr.createComponent(FeedbackAlertComponent);
	}

	closeSnackBar() {
		this.snackBar.open('Draft Saved', '', { duration: 1000, horizontalPosition: 'right', verticalPosition: 'bottom'}
		);
	};
	errorSnackBar() {
		this.snackBar.open('Error occured', '', { duration: 1000, horizontalPosition: 'right', verticalPosition: 'bottom'}
		);
	};
	addCountries(){
		const addCount = this._root_vcr.createComponent(Modal1Component);
		this.loadCountries();
		console.log(this.countriesSourcing);
		setTimeout(() => {
			addCount.countries = this.countriesSourcing;
		}, 0);
		addCount.closeModal.subscribe(() => {
			this._root_vcr.clear();
		});
	}
}
