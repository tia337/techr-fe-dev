import { Subject } from 'rxjs/Subject';
import { Injectable, EventEmitter } from '@angular/core';
import { ParseObject, ParsePromise } from 'parse';
import * as parse from 'parse';
import { Parse } from '../../parse.service';
import { BehaviorSubject, ReplaySubject, Observable } from 'rxjs';
import { deprecate } from 'util';
import { StagesArray, ProjectsArray, ClientsArray } from 'types/types';

@Injectable()
export class CompanySettingsService {

	client: Subject<any> = new Subject();
	currentClient = this.client.asObservable();
	
	erpBaseLink;
	logoUpdate: EventEmitter<any> = new EventEmitter();

	private tableRows = [
		{
			stagePercentage: 10,
			stageDescription: 'Job published on relevant job boards'
		},
		{
			stagePercentage: 25,
			stageDescription: 'Qualified applicants identified'
		},
		{
			stagePercentage: 50,
			stageDescription: 'Qualified applicants scheduled to phone interview'
		},
		{
			stagePercentage: 70,
			stageDescription: 'Qualified applicants scheduled to F2F interview'
		},
		{
			stagePercentage: 90,
			stageDescription: 'Job Offerd'
		},
		{
			stagePercentage: 100,
			stageDescription: 'Job offer Accepted'
		}
	];

	private stages: StagesArray = [
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
			rejectedLogic: false,
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
			withdrawnLogic: false,
			candidates: []
		}
	];

	private clients: ClientsArray = [
		{
			id: 0,
			name: 'Privat Bank'
		},
		{
			id: 1,
			name: 'OTP Bank'
		},
		{
			id: 2,
			name: 'Dynamo Kiev'
		},
		{
			id: 3,
			name: 'Metro Bank'
		},
		{
			id: 4,
			name: 'Polytechnic University'
		}
	];

	private projects: ProjectsArray = [
		{
			id: 0,
			name: 'Digital Transformation',
			clients: this.clients
		},
		{
			id: 1,
			name: 'POS Upgrade',
			clients: this.clients
		},
		{
			id: 2,
			name: 'E-tickets',
			clients: this.clients
		},
		{
			id: 3,
			name: 'Call Centre Outsorcing',
			clients: this.clients
		},
		{
			id: 4,
			name: 'Cloud migration',
			clients: this.clients
		}
	];


	constructor(private _parse: Parse) {
		this.erpBaseLink = _parse.ErpCompanyPageLink;
	}

	setNewSettings(website, career, logo, companyDescription, companyBenefits, greeting) {
		let parseFile;
		const client = this._parse.getCurrentUser().get('Client_Pointer');
		client.set('ClientWebsite', website);
		client.set('ClientCareersPage', career);
		client.set('erpPageGreeting', greeting);
		client.set('Company_Description', companyDescription);
		client.set('Company_Benefits', companyBenefits);
		if (logo) {
			parseFile = this._parse.File(logo.name, logo);
			return parseFile.save().then(() => {
				client.set('ClientLogo', parseFile);
				return client.save().then(res => {
					return res;
				}, error => {
					console.log(error);
					return error;
				});
			})
		} else {
			return client.save().then(res => {
				return res;
			}, error => {
				console.log(error);
				return error;
			});
		}
	}

	getCompany() {
		return this._parse.getCurrentUser().fetch().then(res => {
			return res.get('Client_Pointer');
		});
	}

	getLogo() {
		return this._parse.getCurrentUser().get('Client_Pointer').get('ClientLogo');
	}

	getAccessLevel() {
		this._parse.Parse.User.current().fetch().then(res => {
		});
		return this._parse.Parse.User.current().fetch().then(res => {
			return res.get('HR_Access_Level');
		});
	}

	getAdmins() {
		return this._parse.Parse.User.current().get('Client_Pointer').fetch().then(client => {
			const admins: any[] = [];
			return this._parse.Parse.Object.fetchAllIfNeeded(client.get('TeamMembers')).then(teamMembers => {
				for (let teamMember of teamMembers) {
					if (teamMember.get('HR_Access_Level') === 1) {
						admins.push(teamMember);
					}
				}
				if (admins.length > 1) {
					return admins[0].get('firstName') + ' ' + admins[0].get('lastName') + ' or ' + admins[1].get('firstName') + ' ' + admins[1].get('lastName');
				} else {
					return admins[0].get('firstName') + ' ' + admins[0].get('lastName');
				}
			});
		});
	}

	getStages() {
		return [...this.stages];
	}

	getClients(): ClientsArray {
		return [...this.clients];
	}

	getProjects(): ProjectsArray {
		return [...this.projects];
	}

	setPasswordState(state: boolean) {
		const client = this._parse.getCurrentUser().get('Client_Pointer');
		client.set('passwordSecured', state);
		client.save();
	}
	setErpPageStyle(val: number) {
		const client = this._parse.getCurrentUser().get('Client_Pointer');
		client.set('erpPageStyle', val);
		client.save();
	}

	getClientProbabilitiesToCloseJob() {
		const clientId = this.getClientId();
		return this._parse.execCloud('getClientProbabilitiesToCloseJob', { clientId });
	}

	saveClientProbabilitiesToCloseJob(probabilities) {
		const clientId = this.getClientId();
		this._parse.execCloud('saveClientProbabilitiesToCloseJob', { clientId: clientId, probabilities: probabilities } );
	}

	getDepartments() {
		const clientId = this.getClientId();
		return this._parse.execCloud('getClientDepartments', { clientId });
	}

	getOffices() {
		const clientId = this.getClientId();
		return this._parse.execCloud('getClientOffices', { clientId });
	}

	getClientsOfClient() {
		const clientId = this.getClientId();
		return this._parse.execCloud('getClientsOfClient', { clientId });
	}

	saveDepartments(departments) {
		const clientId = this.getClientId();
		this._parse.execCloud('saveDepartments', { clientId: clientId, departments: departments });
	}

	saveOffices(offices) {
		const clientId = this.getClientId();
		this._parse.execCloud('saveOffices', { clientId: clientId, offices: offices });
	}

	createClientOfClient(clientOfClientName) {
		const clientId = this.getClientId();
		return this._parse.execCloud('createClientOfClient', { clientId, clientOfClientName });
	}

	editClientOfClient(clientOfClientId, clientOfClientName) {
		this._parse.execCloud('editClientOfClient', { clientOfClientId, clientOfClientName });
	}

	deleteClientOfClient(clientOfClientId) {
		this._parse.execCloud('deleteClientOfClient', { clientOfClientId });
	}

	getClientRecruitmentProjects() {
		const clientId = this.getClientId();
		return this._parse.execCloud('getClientRecruitmentProjects', { clientId });
	}

	createClientRecruitmentProject(clientOfClientId, projectName) {
		const clientId = this.getClientId();
		return this._parse.execCloud('createClientRecruitmentProject', { clientId, clientOfClientId, projectName });
	}

	editClientRecruitmentProject(projectId, newProject) {
		this._parse.execCloud('editClientRecruitmentProject', { projectId, newProject });
	}

	deleteClientRecruitmentProject(projectId) {
		this._parse.execCloud('deleteClientRecruitmentProject', { projectId });
	}

	throwClient (client) {
		this.client.next(client);
	}

	getClientId() {
		return this._parse.getCurrentUser().get('Client_Pointer').id;
	}
}
