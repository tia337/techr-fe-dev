import { Component, OnInit, Renderer, OnDestroy } from '@angular/core';
import { CompanySettingsService } from './company-settings.service';
import { DomSanitizer } from '@angular/platform-browser';
import { RootVCRService } from '../../root_vcr.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ParseObject, ParsePromise } from 'parse';
import * as parse from 'parse';
import { Parse } from '../../parse.service';
import * as _ from 'underscore';
import { AlertComponent } from '../../shared/alert/alert.component';
import { ChangePasswordComponent } from 'app/site-administration/company-settings/change-password/change-password.component';
import { ViewChild } from '@angular/core';
import { ElementRef, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { MatExpansionModule } from '@angular/material/expansion';
import { FeedbackAlertComponent } from 'app/core/feedback-alert/feedback-alert.component';
import { ContactUsComponent } from "app/contact-us/contact-us.component";
import { NewWorkflowComponent } from './new-workflow/new-workflow.component';
import { ENGINE_METHOD_DIGESTS } from 'constants';
import { MatSnackBar } from '@angular/material';
import { Observable, Subscription } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/skipWhile';
import 'rxjs/add/operator/distinct';

@Component({
	selector: 'app-company-settings',
	templateUrl: './company-settings.component.html',
	styleUrls: ['./company-settings.component.scss']
})
export class CompanySettingsComponent implements OnInit, OnDestroy {

	tableRows;
	clientProbabilitiesToCloseJob;
	editTableMode = false;
	editStageEnabled = false;
	newLikelihood = false;

	likelihoodFormGroup: FormGroup;
	@ViewChild('newPercentageValue') newPercentageValue: ElementRef;
	@ViewChild('newDescriptionValue') newDescriptionValue: ElementRef;

	departments;
	departmentFormGroup: FormGroup;
	newDepartment = false;
	newSubdepartment = false;

	offices;
	officesFormGroup: FormGroup;
	newOffice = false;

	clientsOfClient;
	clientsofClientArr= [];
	projectsOfClient = [];

	newClient = false;
	editClient = false;
	newProject = false;

	clientsFormGroup: FormGroup;
	projectsFormGroup: FormGroup;


	isInCompany = true;
	curLogo: any;
	logo: any;
	companyDescription: string;
	companyDescriptionDef: string;
	companyBenefits: string;
	companyBenefitsDef: string;
	company: ParseObject;
	website: string;
	websiteDef: string;
	careers: string;
	careersDef: string;
	picUrl: any;
	picUrlDef: any;
	filename = '';
	disabled = false;
	accessLevel: number;
	admins: any[] = [];
	isSafe: boolean;
	isSafeDef: boolean;
	enableSaveStandartWorkFlow = false;


	erpBaseLink;

	erpPageStyle = 0;
	erpPageStyleDef = 0;
	erpPageGreeting = '';
	erpPageGreetingDef = '';
	workFlowSubscription: Subscription;
	step;
	public stagesLength = 7;
	public clients: ClientsArray;
	public projects: ProjectsArray;
	public workflowArray: Array<{ 
			objectId?: string, 
			userRoleName?: string, 
			clientName?: string, 
			projectName?: string, 
			workflowName: string, 
			workFlowTypeName: string, 
			hiringStages: StagesArray, 
			workflowSaveChanges: boolean 
		}> = [];
	projectEndClientNameEmpty = false;
	clientHasStandartHiringWorkFlow = false;
	stagesTemp: StagesArray = [
		{
			index: 3,
			type: 'shortlist',
			value: 0,
			title: 'Shortlist',
			editable: false,
			settingsOpened: false,
			rejectedLogic: false,
			withdrawnLogic: false
		},
		{
			index: 4,
			type: 'phoneInterview',
			value: 0,
			title: 'Phone Interview',
			editable: false,
			settingsOpened: false,
			rejectedLogic: false,
			withdrawnLogic: false
		},
		{
			index: 5,
			type: 'f2fInterview',
			value: 0,
			title: 'F2F Interview',
			editable: false,
			settingsOpened: false,
			rejectedLogic: false,
			withdrawnLogic: false
		},
		{
			index: 6,
			type: 'jobOffered',
			value: 0,
			title: 'Job Offered',
			editable: false,
			settingsOpened: false,
			rejectedLogic: false,
			withdrawnLogic: false
		},
		{
			index: 7,
			type: 'hired',
			value: 0,
			title: 'Hired',
			editable: false,
			settingsOpened: false,
			rejectedLogic: false,
			withdrawnLogic: false
		},
		{
			index: 8,
			type: 'rejected',
			value: 0,
			title: 'Rejected',
			editable: false,
			settingsOpened: false,
			rejectedLogic: true,
			withdrawnLogic: false
		},
		{
			index: 9,
			type: 'withdrawn',
			value: 0,
			title: 'Withdrawn',
			editable: false,
			settingsOpened: false,
			rejectedLogic: false,
			withdrawnLogic: true
		}
	];
	public stages: StagesArray = [
		{
			index: 3,
			type: 'shortlist',
			value: 0,
			title: 'Shortlist',
			editable: false,
			settingsOpened: false,
			rejectedLogic: false,
			withdrawnLogic: false
		},
		{
			index: 4,
			type: 'phoneInterview',
			value: 0,
			title: 'Phone Interview',
			editable: false,
			settingsOpened: false,
			rejectedLogic: false,
			withdrawnLogic: false
		},
		{
			index: 5,
			type: 'f2fInterview',
			value: 0,
			title: 'F2F Interview',
			editable: false,
			settingsOpened: false,
			rejectedLogic: false,
			withdrawnLogic: false
		},
		{
			index: 6,
			type: 'jobOffered',
			value: 0,
			title: 'Job Offered',
			editable: false,
			settingsOpened: false,
			rejectedLogic: false,
			withdrawnLogic: false
		},
		{
			index: 7,
			type: 'hired',
			value: 0,
			title: 'Hired',
			editable: false,
			settingsOpened: false,
			rejectedLogic: false,
			withdrawnLogic: false
		},
		{
			index: 8,
			type: 'rejected',
			value: 0,
			title: 'Rejected',
			editable: false,
			settingsOpened: false,
			rejectedLogic: true,
			withdrawnLogic: false
		},
		{
			index: 9,
			type: 'withdrawn',
			value: 0,
			title: 'Withdrawn',
			editable: false,
			settingsOpened: false,
			rejectedLogic: false,
			withdrawnLogic: true
		}
	];
	public stagesTempInitial = this.stagesTemp.slice();
	public userRoles = [];
	private tempCustomWorkFlowStages = [];
	constructor(
		private _parse: Parse,
		private _CompanySettingsService: CompanySettingsService,
		private sanitizer: DomSanitizer,
		private _root_vcr: RootVCRService,
		private _router: Router,
		private renderer: Renderer,
		private _snackbar: MatSnackBar
	) {
		this.erpBaseLink = _CompanySettingsService.erpBaseLink;
	}

	saveErpPageStyle(val: number) {
		this._CompanySettingsService.setErpPageStyle(val);
		this.erpPageStyle = val;
	}

	ngOnInit() {
		this._CompanySettingsService.getAccessLevel().then(res => {
			this.accessLevel = res;
			if (res > 1) {
				this.disabled = true;
			}
			return this._CompanySettingsService.getAdmins();
		}).then(admins => {
			this.admins = admins;
		});
		if (!this._CompanySettingsService.getCompany()) {
			this.isInCompany = false;
		} else {
			this.getCurLogo();
			this._CompanySettingsService.getCompany().then(result => {
				this.company = result;
				this.isSafe = result.get('passwordSecured');
				this.isSafeDef = result.get('passwordSecured');
				this.erpPageStyle = result.get('erpPageStyle');
				this.erpPageStyleDef = result.get('erpPageStyle');
				this.erpPageGreeting = result.get('erpPageGreeting') ? result.get('erpPageGreeting') : '';
				this.erpPageGreetingDef = result.get('erpPageGreeting') ? result.get('erpPageGreeting') : '';
				this.website = this.company.get('ClientWebsite');
				this.websiteDef = this.company.get('ClientWebsite');
				this.careers = this.company.get('ClientCareersPage');
				this.careersDef = this.company.get('ClientCareersPage');
				this.companyBenefits = this.company.get('Company_Benefits');
				this.companyBenefitsDef = this.company.get('Company_Benefits');
				this.companyDescription = this.company.get('Company_Description');
				this.companyDescriptionDef = this.company.get('Company_Description');
			});

			this.companyDescription = '';
			this.companyBenefits = '';

		}
		this.likelihoodFormGroup = new FormGroup({
			'stagePercentage': new FormControl('')
		});

		this._CompanySettingsService.getClientProbabilitiesToCloseJob()
			.then(data => {
				this.clientProbabilitiesToCloseJob = data;
			});
		this._CompanySettingsService.getDepartments()
			.then(data => {
				this.departments = data;
			});
		this._CompanySettingsService.getOffices()
			.then(data => {
				this.offices = data;
			});
		this._CompanySettingsService.getClientsOfClient()
			.then(data => {
				this.clients = data;
				data.forEach(clientOfClient => {
					this.clientsofClientArr.push({
						id: clientOfClient.id,
						clientOfClientName: clientOfClient.get('clientOfClientName')
					});
				});
			});

		this.clientsFormGroup = new FormGroup({
			'clientOfClientName': new FormControl('', Validators.required),
			'editClientOfClientName' : new FormControl('', Validators.required)
		});
		this.projectsFormGroup = new FormGroup({
			'projectName': new FormControl('', Validators.required),
			'editProjectName' : new FormControl('', Validators.required),
			'projectEndClientName' : new FormControl('', Validators.required)
		});

		this._CompanySettingsService.getClientRecruitmentProjects()
			.then(data => {
				this.projects = data;
				data.forEach(project => {
					this.projectsOfClient.push({
						id: project.id,
						projectName: project.get('projectName'),
						projectEndClientName: project.get('projectEndClientName')
					});
				});
			});

		this.departmentFormGroupInit();
		this.officesFormGroupInit();
		const query = this._parse.Query('UserRole');
		query.find().then(data => {
			this.userRoles = data;
		});

		this.workFlowSubscription = this._CompanySettingsService.client.skipWhile(val => val === null).subscribe(data => {
			this.createNewWorkFlow(data);
		});
		const clientId = this._parse.getClientId();
		this._parse.execCloud('getStandartHiringWorkFlow', { clientId: clientId }).then(result => {
			if (result.length === 0) {
				console.log('getStandartHiringWorkFlow: ', result);
			};
			if (result.length > 0) {
				this.stages = result[0].hiringStages;
				this.clientHasStandartHiringWorkFlow = true;
			}
		});
		this._parse.execCloud('getCustomHiringWorkFlow', { clientId: clientId }).then(result => {
			if (result.length > 0) this.workflowArray = result;
		});
	}

	saveStandartHiringWorkflow() {
		if (!this.enableSaveStandartWorkFlow) return;
		const clientId = this._parse.getClientId();
		this._parse.execCloud('saveStandartHiringWorkflow', { clientId: clientId, hiringStages: this.stages }).then(result => {
			this._snackbar.open('Workflow successfully updated', '', { duration: 2000, horizontalPosition: 'center', verticalPosition: 'bottom'});
		});
	}

	saveCustomWorkFlow(workflow) {
		console.log(workflow);
		if (!workflow.workflowSaveChanges) return;
		let clientId = this._parse.getClientId();
		this._parse.execCloud('saveCustomHiringWorkFlow', { clientId: clientId, data: workflow }).then(result => {
			workflow.workflowSaveChanges = false;
			if (workflow._id) {
				this._snackbar.open('Workflow successfully updated', '', { duration: 2000, horizontalPosition: 'center', verticalPosition: 'bottom'});
			}
		});
	}

	saveSettings() {
	}

	openStageEdit(stage: Stage, workflow) {
		stage.editable = true;

		setTimeout(() => {
			const input = document.getElementById('editStageTitleInput') as HTMLInputElement;
			this.renderer.invokeElementMethod(input, 'focus');
		}, 4);
	}

	editStageTitle(newValue, oldValue, index, array) {
		if (newValue === '' || newValue === null || newValue === oldValue) {
			array[index].editable = false;
			return;
		} else {
			array[index].title = newValue;
			array[index].type = this.toCamelCase(newValue);
			console.log(array[index]);
			array[index].editable = false;
			this.enableSaveStandartWorkFlow = true;
		}
	}

	editCustomWorkFlowTitle(newValue, oldValue, index, array, editable) {
		if (newValue === '' || newValue === null || newValue === oldValue) {
			array[index].editable = false;
			return;
		} else {
			array[index].title = newValue;
			array[index].type = this.toCamelCase(newValue);
			array[index].editable = false;
			console.log(array[index]);
			editable.workflowSaveChanges = true;
		}
	}

	detectHiringWorkFlowChanges() {
		for (let i = 0; i < this.stagesTempInitial.length; i++) {
			for(let x in this.stagesTempInitial[i]) {
				if (this.stagesTempInitial[i][x] !== this.stages[i][x]) {
					this.enableSaveStandartWorkFlow = true;
				}
			}
		}
	}

	detectCustomHiringWorkFlowChanges(workflow) {
		// for (let i = 0; i < this.stagesTempInitial.length; i++) {
		// 	for(let x in this.stagesTempInitial[i]) {
		// 		if (this.stagesTempInitial[i][x] !== this.stages[i][x]) {
		// 			this.enableSaveStandartWorkFlow = true;
		// 		}
		// 	}
		// }
	}

	removeMovedItem(item, array) {
		array.splice(array.indexOf(item), 1);
	}

	addNewStage() {
		if (this.stages.length > 0) {
			const newStage: Stage = {
				index: this.stages.length + 2,
				value: 0,
				title: 'New Stage',
				editable: true,
				type: null,
				settingsOpened: false,
				rejectedLogic: false,
				withdrawnLogic: false
			};
			console.log(this.stages);
			this.stages.push(newStage);
			console.log(this.stages);	
			setTimeout(() => {
				const editDepartmentId = document.getElementById('editStageTitleInput');
				this.renderer.invokeElementMethod(editDepartmentId, 'focus');
			}, 4);		
		} else if (this.stages.length === 0) {
			const newStage: Stage = {
				index: 3,
				value: 0,
				title: 'New Stage',
				editable: true,
				type: null,
				settingsOpened: false,
				rejectedLogic: false,
				withdrawnLogic: false
			};
			this.stages.push(newStage);
			setTimeout(() => {
				const editDepartmentId = document.getElementById('editStageTitleInput');
				this.renderer.invokeElementMethod(editDepartmentId, 'focus');
			}, 4);
		}
	}

	toCamelCase (str) {
		return str
			.replace(/\s(.)/g, function($1) { return $1.toUpperCase(); })
			.replace(/\s/g, '')
			.replace(/^(.)/, function($1) { return $1.toLowerCase(); });
	}

	openNewWorkFlowModal() {
		const newWorkFlow = this._root_vcr.createComponent(NewWorkflowComponent);
		newWorkFlow.clients = this.clients;
		newWorkFlow.projects = this.projects;
		newWorkFlow.roles = this.userRoles;
	}

	createNewWorkFlow (client) {
		const stages: StagesArray = [
			{
				index: 3,
				type: 'shortlist',
				value: 0,
				title: 'Shortlist',
				editable: false,
				settingsOpened: false,
				rejectedLogic: false,
				withdrawnLogic: false,
				candidates: []
			},
			{
				index: 4,
				type: 'phoneInterview',
				value: 0,
				title: 'Phone Interview',
				editable: false,
				settingsOpened: false,
				rejectedLogic: false,
				withdrawnLogic: false,
				candidates: []
			},
			{
				index: 5,
				type: 'f2fInterview',
				value: 0,
				title: 'F2F Interview',
				editable: false,
				settingsOpened: false,
				rejectedLogic: false,
				withdrawnLogic: false,
				candidates: []
			},
			{
				index: 6,
				type: 'jobOffered',
				value: 0,
				title: 'Job Offered',
				editable: false,
				settingsOpened: false,
				rejectedLogic: false,
				withdrawnLogic: false,
				candidates: []
			},
			{
				index: 7,
				type: 'hired',
				value: 0,
				title: 'Hired',
				editable: false,
				settingsOpened: false,
				rejectedLogic: false,
				withdrawnLogic: false,
				candidates: []
			},
			{
				index: 8,
				type: 'rejected',
				value: 0,
				title: 'Rejected',
				editable: false,
				settingsOpened: false,
				rejectedLogic: true,
				withdrawnLogic: false,
				candidates: []
			},
			{
				index: 9,
				type: 'withdrawn',
				value: 0,
				title: 'Withdrawn',
				editable: false,
				settingsOpened: false,
				rejectedLogic: false,
				withdrawnLogic: true,
				candidates: []
			}
		];

		const data = {
			clientName: client.clientName ? client.clientName : undefined,
			projectName: client.projectName ? client.projectName : undefined,
			userRoleName: client.userRoleName ? client.userRoleName : undefined,
			hiringStages: stages,
			workflowName: client.workflowName,
			workFlowTypeName: client.workFlowTypeName,
			workflowSaveChanges: false,
		};
		console.log(data);
		let clientId = this._parse.getClientId();
		this._parse.execCloud('saveCustomHiringWorkFlow', { clientId: clientId, data: data }).then(result => {
			console.log(result);
			data['_id'] = result.id;
			this.workflowArray.push(data);
		});

	}


	removeWorkflow(currentFlow, array) {
		this._parse.execCloud('deleteCustomWorkFlow', { flowId: currentFlow._id }).then(result => {
			this.openRemoveSuccessModal();
			array.splice(currentFlow, 1);
		});
	}

	openStageRemoveAlert(currentFlow, array) {
		const alert = this._root_vcr.createComponent(AlertComponent);
		alert.title = 'Are you sure you want to delete this workflow?';
		alert.type = 'lock';
		alert.contentAlign = 'center';
		alert.content = `<a style = "white-space:nowrap">You won't lose any candidates or data but you won't be able to use this flow again on future jobs</a>`;
		alert.addButton({
			title: 'Cancel',
			type: 'primary',
			onClick: () => {
				this._root_vcr.clear();
			} 
		});
		alert.addButton({
			title: 'Delete workflow',
			type: 'warn',
			onClick: () => {
				this._root_vcr.clear();
				this.removeWorkflow(currentFlow, array);
			} 
		});
	}

	openRemoveSuccessModal() {
		const alert = this._root_vcr.createComponent(AlertComponent);
		alert.title = 'Congrats';
		alert.type = 'congrats';
		alert.contentAlign = 'center';
		alert.content = `<a style = "white-space:nowrap">Workflow successfully removed!</a>`;
		setTimeout(() => {
			this._root_vcr.clear();
		}, 1500)
	}

	addNewStageInCustomWorkFlow(i) {
		if (this.workflowArray[i].hiringStages.length > 0) {
			const newStage: Stage = {
				index: this.workflowArray[i].hiringStages.length + 2,
				value: 0,
				title: 'New Stage',
				editable: true,
				type: null,
				settingsOpened: false,
				rejectedLogic: false,
				withdrawnLogic: false,
				candidates: []
			};
			this.workflowArray[i].hiringStages.push(newStage)
			this.workflowArray[i].workflowSaveChanges = true;
			setTimeout(() => {
				const editDepartmentId = document.getElementById('editStageTitleInput');
				this.renderer.invokeElementMethod(editDepartmentId, 'focus');
			}, 4);
			return;
		} else if (this.workflowArray[i].hiringStages.length === 0) {
			const newStage: Stage = {
				index: 3,
				value: 0,
				title: 'New Stage',
				editable: true,
				type: null,
				settingsOpened: false,
				rejectedLogic: false,
				withdrawnLogic: false,
				candidates: []
			};
			this.workflowArray[0].hiringStages.push(newStage)
			this.workflowArray[0].workflowSaveChanges = true;
			setTimeout(() => {
				const editDepartmentId = document.getElementById('editStageTitleInput');
				this.renderer.invokeElementMethod(editDepartmentId, 'focus');
			}, 4);
		}
	}

	dropDnD(event?, val?) {
		for (let i = 0; i < this.stagesTempInitial.length; i++) {
			if (this.stagesTempInitial[i].index !== this.stages[i].index) {
				this.enableSaveStandartWorkFlow = true;
				break;
			} 
			this.enableSaveStandartWorkFlow = false;
		}
	}

	dropDnDCustom(event, val: Array<any>, array) {
		for (let i = 0; i < this.tempCustomWorkFlowStages.length; i++) {
			if (this.tempCustomWorkFlowStages[i].type !== val[i].type) {
				array.workflowSaveChanges = true;
				break;
			} 
			array.workflowSaveChanges = false;
		}
	}

	saveOnDragstartItemToCompare(stages) {
		this.tempCustomWorkFlowStages = stages.slice();
	}


	log (value) {
		console.log(value);
	}


	setChanges() {
		if (this.website != this.websiteDef || this.careers != this.careersDef || this.picUrlDef != this.picUrl ||
			this.companyBenefits != this.companyBenefitsDef || this.companyDescription != this.companyDescriptionDef ||
			this.isSafeDef != this.isSafe || this.erpPageStyleDef != this.erpPageStyle || this.erpPageGreetingDef != this.erpPageGreeting) {
			this._CompanySettingsService.setNewSettings(this.website, this.careers, this.logo, this.companyDescription, this.companyBenefits, this.erpPageGreeting).then(res => {
				this.websiteDef = this.website;
				this.careersDef = this.careers;
				this.picUrlDef = this.picUrl;
				this.companyBenefitsDef = this.companyBenefits;
				this.companyDescriptionDef = this.companyDescription;
				this.isSafeDef = this.isSafe;
				this.erpPageStyleDef = this.erpPageStyle;
				this.erpPageGreetingDef = this.erpPageGreeting;
				const alert = this._root_vcr.createComponent(AlertComponent);
				alert.title = 'Saved';
				alert.icon = 'thumbs-o-up';
				alert.type = 'simple';
				alert.contentAlign = 'left';
				alert.content = `<a style = "white-space:nowrap">Changes successfully saved.</a>`;
				alert.addButton({
					title: 'Ok',
					type: 'primary',
					onClick: () => this._root_vcr.clear()
				});
				this._CompanySettingsService.logoUpdate.emit();
			});
		}

	}
	getNewLogo(event): any {
		if (event.files && event.files[0]) {
			const binaryData = [];
			binaryData.push(event.files[0]);
			this.logo = event.files[0];
			this.picUrl = window.URL.createObjectURL(new Blob(binaryData, { type: event.files[0].type }));
			this.cutLogoName(this.logo.name);
		}
	}
	getCurLogo() {
		if (this._CompanySettingsService.getLogo()) {
			this.curLogo = this._CompanySettingsService.getLogo();
			this.cutLogoName(this.curLogo._name);
			this.picUrl = this.curLogo._url;
			this.picUrlDef = this.curLogo._url;
		}
	}
	cutLogoName(logoName: string) {
		if (logoName.length > 30) {
			this.filename = '...' + logoName.slice((logoName.length - 30), logoName.length);
		} else {
			this.filename = logoName;
		}
	}
	sanitize(url: string) {
		return this.sanitizer.bypassSecurityTrustUrl(url);
	}
	accessCheck() {
		if (this.accessLevel == 1) {
		} else if (this.accessLevel > 1) {
			const alert = this._root_vcr.createComponent(AlertComponent);
			alert.title = 'Access level Required';
			alert.icon = 'lock';
			alert.type = 'sad';
			alert.contentAlign = 'left';
			alert.content = `<a style = "white-space:nowrap">Hi, ` + this._parse.Parse.User.current().get('firstName') + `. You need to be site admin in order to modify your company settings.</a><br><a style = "white-space:nowrap"><strong>` +
				this.admins + `</strong> can set you up as a site admin if needed.</a>` +
				`<a style = "white-space:nowrap">Contact SwipeIn if you need urgent access to Company Settings and you can't reach your Site administrators.</a>`;
			alert.addButton({
				title: 'Contact SwipeIn',
				type: 'secondary',
				onClick: () => {
					this._root_vcr.clear();
					let contactForm = this._root_vcr.createComponent(ContactUsComponent);
					contactForm.contactType = "K9A4lQwYNs";
				}
			});
			alert.addButton({
				title: 'Close',
				type: 'primary',
				onClick: () => { this._root_vcr.clear(); }
			});
		}
	}
	savePasswordState() {
		this._CompanySettingsService.setPasswordState(!this.isSafe);
	}
	changePassword() {
		if(!this.disabled){
			const change = this._root_vcr.createComponent(ChangePasswordComponent);
			change.clientId = this.company;
		}
	}

	feedbackCreation() {
		this._root_vcr.createComponent(FeedbackAlertComponent);
	}
	triggerInput(el) {
		const event = new MouseEvent('click', { bubbles: true });
		this.renderer.invokeElementMethod(el, 'dispatchEvent', [event]);
	}
	removeLogo() {
		if (this.curLogo && this._parse.getCurrentUser().get('Client_Pointer').has('ClientLogo') && this.accessLevel === 1 ) {
			this._parse.getCurrentUser().get('Client_Pointer').unset('ClientLogo');
			this._parse.getCurrentUser().get('Client_Pointer').save();
			this.picUrl = '';
			this.filename = '';
		}
	}
	setStep(index: number) {
		this.step = index;
	}

	departmentFormGroupInit(department = null, subdepartment = null ) {
		this.departmentFormGroup = new FormGroup({
			'departmentName' : new FormControl(department !== null ? department.name : ''),
			'newDepartmentName' : new FormControl(''),
			'subdepartmentName' : new FormControl (subdepartment !== null ? subdepartment.name : ''),
			'newSubdepartmentName' : new FormControl('')
		});
	}

	editDepartment(department) {
		if (department.edit) {
			if (this.departmentFormGroup.value.departmentName !== null && this.departmentFormGroup.value.departmentName.trim() !== '') {
				department.name = this.departmentFormGroup.value.departmentName;
				department.edit = false;
			} else {
				this.departmentFormGroupInit(department);
				department.edit = false;
			}

		} else {
			this.departmentFormGroupInit(department);
			department.edit = true;
			setTimeout(() => {
				const editDepartmentId = document.getElementById('editDepartmentInput');
				this.renderer.invokeElementMethod(editDepartmentId, 'focus');
			}, 4);
		}
	}

	addNewDepartment() {
		this.departmentFormGroup.reset();
		this.newDepartment = true;
		setTimeout(() => {
			const newDepartmentInput = document.getElementById('newDepartmentInput');
			this.renderer.invokeElementMethod(newDepartmentInput, 'focus');
		}, 4);

	}
	saveNewDepartment() {
		if (this.departmentFormGroup.value.newDepartmentName !== null && this.departmentFormGroup.value.newDepartmentName.trim() !== '') {
			const newDepartment = {
				id: this.departmentFormGroup.value.newDepartmentName + Math.floor((Math.random() * 100)).toString(),
				name: this.departmentFormGroup.value.newDepartmentName,
				edit: false,
				newSubdepartment: false,
				subDepartments: []
			};
			this.departments.push(newDepartment);
			this.departmentFormGroup.reset();
			this.newDepartment = false;
		} else {
			this.departmentFormGroup.reset();
			this.newDepartment = false;
			}
	}

	addSubdepartments(department) {
		if (department.newSubdepartment) {
			this.saveSubdepartment(department);
		} else {
			department.newSubdepartment = true;
			setTimeout(() => {
				const newSubdepartmentInput = document.getElementById('newSubdepartmentInput');
				this.renderer.invokeElementMethod(newSubdepartmentInput, 'focus');
			}, 4);
		}
	}

	saveSubdepartment(department) {
		if (this.departmentFormGroup.value.newSubdepartmentName !== null && this.departmentFormGroup.value.newSubdepartmentName.trim() !== '') {
			const newSubdepartment = {
				id: this.departmentFormGroup.value.newSubdepartmentName + Math.floor(Math.random() * 100).toString(),
				name: this.departmentFormGroup.value.newSubdepartmentName,
				edit: false
			};
			const index = this.departments.indexOf(department);
			this.departments[index].subDepartments.push(newSubdepartment);
			department.newSubdepartment = false;
			this.departmentFormGroup.reset();
		} else {
			this.departmentFormGroup.reset();
			department.newSubdepartment = false;
		}
	}

	editSubdepartment(subdepartment) {
		if (subdepartment.edit) {
			if (this.departmentFormGroup.value.subdepartmentName !== null && this.departmentFormGroup.value.subdepartmentName.trim() !== '') {
				subdepartment.name = this.departmentFormGroup.value.subdepartmentName;
				subdepartment.edit = false;
			} else {
				subdepartment.edit = false;
			}
		} else {
			this.departmentFormGroupInit(null, subdepartment);
			subdepartment.edit = true;

			setTimeout(() => {
				const editSubdepartmentInput = document.getElementById('editSubdepartmentInput');
				this.renderer.invokeElementMethod(editSubdepartmentInput, 'focus');
			}, 4);
		}
	}
	removeSubdepartment(department, subdepartment) {
		const depIndex = this.departments.indexOf(department);
		const subdepIndex = this.departments[depIndex].subDepartments.indexOf[subdepartment];
		this.departments[depIndex].subDepartments.splice(subdepIndex, 1);
	}

	removeDepartment(id) {
		this.departments.forEach(department => {
			if (department.id === id) {
				const index = this.departments.indexOf(department);
				this.departments.splice(index, 1);
			}
		});
	}

	officesFormGroupInit(office = null) {
		this.officesFormGroup = new FormGroup({
			'officeName' : new FormControl(office !== null ? office.name : ''),
			'newOfficeName' : new FormControl('')
		});
	}

	addNewOffice() {
		if (this.newOffice) {
			if (this.officesFormGroup.value.newOfficeName !== null && this.officesFormGroup.value.newOfficeName.trim() !== '' ) {
				const newOffice = {
					id: this.officesFormGroup.value.newOfficeName + Math.floor(Math.random() * 100).toString(),
					name : this.officesFormGroup.value.newOfficeName,
					edit: false
				};
				this.offices.push(newOffice);
				this.officesFormGroup.reset();
				this.newOffice = false;
			} else {
				this.officesFormGroup.reset();
				this.newOffice = false;
			}
		} else {
			this.officesFormGroup.reset();
			this.newOffice = true;
			setTimeout(() => {
				const newOfficeInput = document.getElementById('newOfficeInput');
				this.renderer.invokeElementMethod(newOfficeInput, 'focus');
				}, 4);
		}
	}

	editOffice(office) {
		if (office.edit) {
			if (this.officesFormGroup.value.officeName !== null && this.officesFormGroup.value.officeName.trim() !== '') {
				office.name = this.officesFormGroup.value.officeName;
				office.edit = false;
			} else {
				office.edit = false;
			}
			} else {
				office.edit = true;
				setTimeout(() => {
					const editOfficeInput = document.getElementById('editOfficeInput');
					this.renderer.invokeElementMethod(editOfficeInput, 'focus');
				});
			}
	}
	removeOffice(office) {
		const officeIndex = this.offices.indexOf(office);
		this.offices.splice(officeIndex, 1);
	}

	onEditStageClick() {
		if (this.editStageEnabled !== true) {
			return this.editStageEnabled = !this.editStageEnabled;
		}
		this.editStageEnabled = false;
		this.clientProbabilitiesToCloseJob =
			_.sortBy(
				this.clientProbabilitiesToCloseJob,
				function (clientProbability) {
					return clientProbability.percentage;
				}
			);
	}

	increaseClientProbability(clientProbabilityToCloseJob) {
		let percentage = Number(clientProbabilityToCloseJob.percentage);

		if (percentage < 100) {
			percentage += 5;
			clientProbabilityToCloseJob.percentage = percentage;
		} else {
			return;
		}
	}

	decreaseClientProbability(clientProbabilityToCloseJob) {
		let percentage = Number(clientProbabilityToCloseJob.percentage);

		if (percentage > 0) {
			percentage -= 5;
			clientProbabilityToCloseJob.percentage = percentage;
		} else {
			return;
		}
	}


	onAddLikelihoodStage() {
		if (this.newLikelihood !== true) {
			return this.newLikelihood = !this.newLikelihood;
		}
		const percentageValue = this.newPercentageValue.nativeElement.value;
		const DescriptionValue = this.newDescriptionValue.nativeElement.value;

		if ( percentageValue !== '' && DescriptionValue !== '' ) {
			const newStageValue = {
				stagePercentage: percentageValue,
				stageDescription: DescriptionValue
			};
			this.tableRows.push(newStageValue);
			this.tableRows = _.sortBy(this.tableRows, function (i) {return i.stagePercentage; });
		}
		this.newLikelihood = false;
	}

	addNewClient() {
		this.newClient = true;
		setTimeout(() => {
		const newClientInput = document.getElementById('newClientInput');
		this.renderer.invokeElementMethod(newClientInput, 'focus');
		}, 4);
	}

	saveNewClient() {
		this.newClient = false;
		const clientOfClientName = this.clientsFormGroup.value.clientOfClientName.toString().trim();
		if (clientOfClientName !== '') {
			this._CompanySettingsService.createClientOfClient(clientOfClientName)
				.then(data => {
					this.clientsofClientArr.push({
						id: data.id,
						clientOfClientName: data.get('clientOfClientName')
					});
				});
			this.clientsFormGroup.reset();
			this._snackbar.open('Client Added', '', { duration: 2000, horizontalPosition: 'center', verticalPosition: 'bottom'});
		} else {
			return this.clientsFormGroup.reset();
		}
	}

	editClientOfClient(clientOfClient) {
		clientOfClient.editClient = true;
		setTimeout(() => {
			const editClientInput = document.getElementById('editClientInput');
			this.renderer.invokeElementMethod(editClientInput, 'focus');
			this.clientsFormGroup.setValue({
				'clientOfClientName': clientOfClient.clientOfClientName,
				'editClientOfClientName': clientOfClient.clientOfClientName
			});
		}, 4);
	}

	saveEditedClient(clientOfClient) {
		this.newClient = false;
		const editedClientName = this.clientsFormGroup.value.editClientOfClientName.toString().trim();
		if (editedClientName !== '') {
			this._CompanySettingsService.editClientOfClient(clientOfClient.id, editedClientName);
			clientOfClient.clientOfClientName = editedClientName;
			this.clientsFormGroup.reset();
			this._snackbar.open('Client Edited', '', { duration: 2000, horizontalPosition: 'center', verticalPosition: 'bottom'});			
		} else {
			return this.clientsFormGroup.reset();
		}
	}

	deleteClientOfClient(clientOfClient) {
		const clientOfClientId = clientOfClient.id;
		this._CompanySettingsService.deleteClientOfClient(clientOfClientId);
		const clientOfClientIndex = this.clientsofClientArr.indexOf(clientOfClient);
		this.clientsofClientArr.splice(clientOfClientIndex, 1);
		this._snackbar.open('Client Removed', '', { duration: 2000, horizontalPosition: 'center', verticalPosition: 'bottom'});		
	}

	addNewProject() {
		if (this.newProject) {
			this.newProject = false;
			this.projectEndClientNameEmpty = false;			
			this.projectsFormGroup.reset();
		} else {
			this.newProject = true;
			setTimeout(() => {
				const newProjectInput = document.getElementById('newProjectInput');
				this.renderer.invokeElementMethod(newProjectInput, 'focus');
			}, 4);
		}
	}

	saveNewProject() {
		const projectName = this.projectsFormGroup.value.projectName !== null ? this.projectsFormGroup.value.projectName.toString().trim() : '';
		const clientOfClientId = this.projectsFormGroup.value.projectEndClientName;
		if (projectName !== '' && clientOfClientId !== '') {
			this._CompanySettingsService.createClientRecruitmentProject(clientOfClientId, projectName)
				.then(newProject => {
					this.projectsOfClient.push({
						id: newProject.id,
						projectName: newProject.get('projectName'),
						projectEndClientName: newProject.get('projectEndClientName')
					});
					this.projectsFormGroup.reset();
					this.newProject = false;
					this.projectEndClientNameEmpty = false;			
					this._snackbar.open('Project Added', '', { duration: 2000, horizontalPosition: 'right', verticalPosition: 'bottom'});
				});
		} else if (projectName !== '' && clientOfClientId === '') { 
			this.projectEndClientNameEmpty = true;
		} 
	}

	editProjectOfClient(projectOfClient) {
		if (projectOfClient.editClient) {
			projectOfClient.editClient = false;
			this.projectsFormGroup.reset();
		} else {
			projectOfClient.editClient = true;
			setTimeout(() => {
				const editProjectInput = document.getElementById('editProjectInput');
				this.renderer.invokeElementMethod(editProjectInput, 'focus');
				this.projectsFormGroup.setValue({
					'projectName': projectOfClient.projectName,
					'editProjectName': projectOfClient.projectName,
					'projectEndClientName': projectOfClient.projectEndClientName
				});
			}, 4);

		}
	}



	saveEditedProject(projectOfClient) {
		const projectId = projectOfClient.id;
		const projectName = this.projectsFormGroup.value.editProjectName !== null ? this.projectsFormGroup.value.editProjectName.toString().trim() : '';
		const clientOfClientId = this.projectsFormGroup.value.projectEndClientName;
		if (projectName !== '' && clientOfClientId !== null ) {
			const newProject = {
				clientOfClientId,
				projectName
			};
			this._CompanySettingsService.editClientRecruitmentProject(projectId, newProject);
			this.clientsofClientArr.forEach(clientOfClient => {
				if (clientOfClient.id === clientOfClientId) {
					projectOfClient.projectEndClientName = clientOfClient.clientOfClientName;
				}
			});
			projectOfClient.projectName = projectName;
			this.projectsFormGroup.reset();
			this._snackbar.open('Project Edited', '', { duration: 2000, horizontalPosition: 'right', verticalPosition: 'bottom'});
		} else {
			return this.projectsFormGroup.reset();
		}
	}

	deleteProject(projectOfClient) {
		const projectId = projectOfClient.id;

		this._CompanySettingsService.deleteClientRecruitmentProject(projectId);

		const projectIndex = this.projectsOfClient.indexOf(projectOfClient);
		this.projectsOfClient.splice(projectIndex, 1);
		this._snackbar.open('Project Removed', '', { duration: 2000, horizontalPosition: 'right', verticalPosition: 'bottom'});			

	}

	ngOnDestroy() {
		this.workFlowSubscription.unsubscribe();
	}
}



