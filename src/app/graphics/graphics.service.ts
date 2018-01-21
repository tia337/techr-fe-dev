/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   graphics.service.ts                                :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: afarapon <afarapon@student.unit.ua>        +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/12/15 18:20:21 by afarapon          #+#    #+#             */
/*   Updated: 2017/12/19 15:10:04 by afarapon         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import {
	Injectable
} from '@angular/core';
import {
	Parse
} from './../parse.service';
import { Login } from 'app/login.service';

@Injectable()
export class GraphicsService {

	contracts_scope: ContractInfo[] = new Array();

	isFirst = -1;
	_currentUserSubscription;
	currentUser;

	constructor(public _parse: Parse, private _login: Login) {

		this._currentUserSubscription = this._login.profile.subscribe(profile => {
			this.currentUser = profile;
			if (this.currentUser) {
				this.checkContractsCount();
				this._currentUserSubscription = null;
			}
		});
	}
	private checkContractsCount() {
		if (this._parse.Parse.User.current()) {
			const q = this._parse.Query('Contract');
			q.equalTo('Client', this._parse.Parse.User.current().get('Client_Pointer'));
			q.equalTo('status', 1);
			q.count().then(res => {
				this.isFirst = res;
				// this.isFirst = 0;
			});
		}
	}
	getCurrentuser() {
		return this._parse.getCurrentUser();
	}
	getRoles() {
		const query = this._parse.Query('UserRole');
		query.limit(100);
		query.select('title');
		return query.find().then(result => {
			const roles: string[] = new Array();
			result.forEach(element => {
				roles.push(element.get('title'));
			});
			return roles;
		});
	}
	getClientRecruiters() {
		const query = this._parse.Query('_User');
		query.exists('partner');
		query.equalTo('Client_Pointer', this._parse.Parse.User.current().get('Client_Pointer'));
		return query.find().then(recr => {
			if (recr && recr.length > 0) {
				const resultArray: {name: string, id: string}[] = new Array();
				recr.forEach(rec => {
					resultArray.push({ name: rec.get('firstName') + ' ' + rec.get('lastName'), id: rec.id });
				});
				return resultArray;
			}
			return null;
		});

	}
	getSkills() {
		const query = this._parse.Query('ProgrammingSkill');
		query.limit(3000);
		query.select('title');
		return query.find().then(skills => {
			const skillArray: {
				name: string,
				id: string
			}[] = new Array();
			skills.forEach(skill => {
				skillArray.push({
					name: skill.get('title'),
					id: skill.id
				});
			});
			return skillArray;
		});
	}
	getCategories() {
		const query = this._parse.Query('SkillCategory');
		query.limit(30);
		return query.find().then(result => {
			const catArray: {
				name: string,
				id: string
			}[] = new Array();
			result.forEach(cat => {
				catArray.push({name: cat.get('title'), id: cat.id });
			});
			return catArray;
		});
	}
	getSkillsForError() {
		const query = this._parse.Query('ProgrammingSkill');
		query.limit(3000);
		query.select('title');
		return query.find().then(skills => {
			const skillArray: string[] = new Array();
			skills.forEach(skill => {
				if (skill.get('title') !== undefined) {
					skillArray.push(skill.get('title'));
				}
			});
			return skillArray;
		});
	}
	getCountries() {
		const query = this._parse.Query('Country');
		query.select('Country');
		return query.find().then(ctrs => {
			const countries: {name: string, id: string}[] = new Array();
			ctrs.forEach(ct => {
				countries.push({
					name: ct.get('Country'),
					id: ct.id
				});
			});
			return countries;
		});
	}

	contractsReturn() {
		const client = this.getUserClient();
		const query = this._parse.Query('Contract');
		query.equalTo('Client', client);
		query.include('programingSkills.skill');
		query.include('Client');
		query.containedIn('status', [0, 1]);
		query.include('roles');
		query.select(
			'programingSkills',
			'roles',
			'title',
			'postedAt',
			'AplicantsLeadTime',
			'JobOfferedLeadTime',
			'HiringLeadTime'
		);
		query.limit(1000);
		return query.find().then(contracts => {
			this.contracts_scope = null;
			this.contracts_scope = new Array();
			contracts.forEach(cont => {
				const postedAt = cont.get('postedAt') ? cont.get('postedAt') : cont.get('createdAt');
				const appTime = cont.get('AplicantsLeadTime');
				const offerTime = cont.get('JobOfferedLeadTime');
				const hirTime = cont.get('HiringLeadTime');
				const base_date = this.calculateData(postedAt);
				const local = new ContractInfo();
				local.id = cont.id;
				local.skills = new Array();
				local.roles = new Array();
				const loc_skills = cont.get('programingSkills');
				const loc_roles = cont.get('roles');
				if (loc_roles !== undefined && loc_roles.length > 0) {
					loc_roles.forEach(el => {
						local.roles.push(el.get('title'));
					});
				}
				if (loc_skills !== undefined && loc_skills.length > 0) {
					loc_skills.forEach(el => {
						local.skills.push(el.get('skill').get('title'));
					});
				}
				local.createdAt = postedAt;
				local.name = cont.get('title');
				if (local.name !== undefined) {
					if (appTime !== undefined) {
						local.appTime = appTime;
						local.closed_apply = true;
					} else {
						local.appTime = base_date;
						local.closed_apply = false;
					}
					if (offerTime !== undefined) {
						local.offerTime = offerTime;
						local.closed_offer = true;
					} else {
						local.offerTime = local.appTime > base_date ? local.appTime : base_date;
						local.closed_offer = false;
					}
					if (hirTime !== undefined) {
						local.hirTime = hirTime;
						local.closed_hired = true;
					} else {
						local.hirTime = local.offerTime > base_date ? local.offerTime : base_date;
						local.closed_hired = false;
					}
					this.contracts_scope.push(local);
				}
			});
			this.contracts_scope.sort((a, b) => {
				return (a.createdAt.getTime() - b.createdAt.getTime());
			});
			return this.contracts_scope;
		});
	}

	getUserClient() {
		const user = this._parse.Parse.User.current();
		const client = user.get('Client_Pointer');
		return client;
	}

	calculateData(val) {
		const dateTemp = new Date();
		const created = Date.parse(val);
		const cur = dateTemp.getTime();
		const res = (cur - created) / 1000 / 60 / 60;
		return res / 24;
	}
	ngOnDestroy() {
		if (this._currentUserSubscription) {
			this._currentUserSubscription.unsubscribe();
		}
	}
}
export class ContractInfo {
	// BaseInfo
	id:  string;
	name:  string;
	createdAt: Date;
	// TimeLines
	appTime: number;
	closed_apply: boolean;
	offerTime: number;
	closed_offer: boolean;
	hirTime: number;
	closed_hired: boolean;
	// SkillsAndRoles
	skills:  string[];
	roles:  string[];
}

