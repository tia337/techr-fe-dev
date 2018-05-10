import { Subject } from 'rxjs/Subject';
import { Injectable, EventEmitter } from '@angular/core';
import { ParseObject, ParsePromise } from 'parse';
import * as parse from 'parse';
import { Parse } from '../../parse.service';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class CompanySettingsService {

	client: BehaviorSubject<any> = new BehaviorSubject(null);
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

	// private departments = [
	// 	{
	// 		id: 'general_administration_1',
	// 		name: 'General & Administration',
	// 		edit: false,
	// 		newSubdepartment: false,
	// 		subDepartments: [
	// 			{
	// 				id: 'sub_1',
	// 				name: 'Sub1',
	// 				edit: false
	// 			}
	// 		]
	// 	},
	// 	{
	// 		id: 'marketing_2',
	// 		name: 'Marketing',
	// 		edit: false,
	// 		newSubdepartment: false,
	// 		subDepartments: [
	// 			{
	// 				id: 'sub_1',
	// 				name: 'Sub1',
	// 				edit: false
	// 			}
	// 		]
	// 	},
	// 	{
	// 		id: 'sales_3',
	// 		name: 'Sales',
	// 		edit: false,
	// 		newSubdepartment: false,
	// 		subDepartments: [
	// 			{
	// 				id: 'sub_1',
	// 				name: 'Sub1',
	// 				edit: false
	// 			}
	// 		]
	// 	},
	// 	{
	// 		id: 'r_d_engineering_4',
	// 		name: 'R&D and Engineering',
	// 		edit: false,
	// 		newSubdepartment: false,
	// 		subDepartments: [
	// 			{
	// 				id: 'sub_1',
	// 				name: 'Sub1',
	// 				edit: false
	// 			}
	// 		]
	// 	},
	// 	{
	// 		id: 'software_engineering_5',
	// 		name: 'Software Engineering',
	// 		edit: false,
	// 		newSubdepartment: false,
	// 		subDepartments: [
	// 			{
	// 				id: 'sub_1',
	// 				name: 'Sub1',
	// 				edit: false
	// 			}
	// 		]
	// 	},
	// 	{
	// 		id: 'operations_6',
	// 		name: 'Operations',
	// 		edit: false,
	// 		newSubdepartment: false,
	// 		subDepartments: [
	// 			{
	// 				id: 'sub_1',
	// 				name: 'Sub1',
	// 				edit: false
	// 			}
	// 		]
	// 	},
	// 	{
	// 		id: 'human_resource_7',
	// 		name: 'Human Resource',
	// 		edit: false,
	// 		newSubdepartment: false,
	// 		subDepartments: [
	// 			{
	// 				id: 'sub_1',
	// 				name: 'Sub1',
	// 				edit: false
	// 			}
	// 		]
	// 	},
	// ];

	// private offices = [
	// 	{
	// 		id: 'warsaw_1',
	// 		name: 'Warsaw',
	// 		edit: false
	// 	},
	// 	{
	// 		id: 'kiev_2',
	// 		name: 'Kiev',
	// 		edit: false
	// 	},
	// 	{
	// 		id: 'madrid_3',
	// 		name: 'Madrid',
	// 		edit: false
	// 	},
	// 	{
	// 		id: 'california_4',
	// 		name: 'California',
	// 		edit: false
	// 	},
	// 	{
	// 		id: 'sevilla_5',
	// 		name: 'Sevilla',
	// 		edit: false
	// 	},
	// 	{
	// 		id: 'toronto_6',
	// 		name: 'Toronto',
	// 		edit: false
	// 	}
	// ];

	private stages: StagesArray = [
		{
			index: 3,
			type: 'shortlist',
			value: 0,
			title: 'Shortlist',
			editable: false
		},
		{
			index: 4,
			type: 'phoneInterview',
			value: 0,
			title: 'Phone Interview',
			editable: false
		},
		{
			index: 5,
			type: 'f2fInterview',
			value: 0,
			title: 'F2F Interview',
			editable: false
		},
		{
			index: 6,
			type: 'jobOffered',
			value: 0,
			title: 'Job Offered',
			editable: false
		},
		{
			index: 7,
			type: 'hired',
			value: 0,
			title: 'Hired',
			editable: false
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
		console.log(website);
		console.log(career);
		console.log(logo);
		console.log(companyDescription);
		console.log(companyBenefits);
		let parseFile;
		const client = this._parse.getCurrentUser().get('Client_Pointer');
		console.log(client);
		client.set('ClientWebsite', website);
		client.set('ClientCareersPage', career);
		client.set('erpPageGreeting', greeting);
		client.set('Company_Description', companyDescription);
		client.set('Company_Benefits', companyBenefits);
		if (logo) {
			parseFile = this._parse.File(logo.name, logo);
			return parseFile.save().then(() => {
				client.set('ClientLogo', parseFile);
				console.log(client);
				return client.save().then(res => {
					console.log(res);
					return res;
				}, error => {
					console.log(error);
					return error;
				});
			})
		} else {
			console.log(client.get('ClientLogo'));
			console.log(client);
			return client.save().then(res => {
				console.log(res);
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
	getStages(): StagesArray {
		return this.stages.slice();
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
		return this._parse.execCloud('getClientProbabilitiesToCloseJob', {clientId});
	}

	getDepartments() {
		const clientId = this.getClientId();
		return this._parse.execCloud('getClientDepartments', {clientId});
	}

	getOffices() {
		const clientId = this.getClientId();
		return this._parse.execCloud('getClientOffices', {clientId});
	}

	throwClient (client) {
		this.client.next(client);
	}

	getClientId() {
		return this._parse.getCurrentUser().get('Client_Pointer').id;
	}
}
