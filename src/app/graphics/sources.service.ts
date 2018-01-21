/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   sources.service.ts                                 :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: afarapon <afarapon@student.unit.ua>        +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/12/15 18:20:40 by afarapon          #+#    #+#             */
/*   Updated: 2017/12/15 18:20:47 by afarapon         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import {
	Injectable
} from '@angular/core';
import {
	Parse
} from './../parse.service';
import {
	GraphicsService
} from './graphics.service';
import {
	ContractInfo
} from './graphics.service';

@Injectable()
export class SourcesService {
	categories: {
		id: string,
		name: string
	}[] = new Array();
	constructor(private _parse: Parse, private _graphcsServ: GraphicsService) {
		this.getSkillsCategories().then(categories => {
			this.categories = categories;
		});
	}
	getSkillsCategories() {
		const query = this._parse.Query('SkillCategory');
		query.limit(20);
		return query.find().then(cats => {
			const categories: {
				id: string,
				name: string
			}[] = new Array();
			cats.forEach(category => {
				categories.push({
					id: category.id,
					name: category.get('title')
				});
			});
			return categories;
		});
	}
	
	getAllApplyes(val: Date, skill: string, role: string) {
		const query = this._parse.Query('ContractApply');
		query.equalTo('Client', this._graphcsServ.getUserClient());
		query.select('Source_JobBoard.Name');
		query.select('contract.programingSkills.title');
		query.select('contract.programingSkills.categories');
		query.select('contract.roles.title');
		query.select('contract.owner');
		query.select('contract.postedAt');
		query.select('contract.status');
		return query.find().then(applies => {
			const arrayOfValidApplies = new Array();
			applies.forEach(app => {
				const validate: {
					date: boolean,
					skill: boolean,
					role: boolean
				} = {
					date: false,
					skill: false,
					role: false
				};
				const contract = app.get('contract');
				if (contract && contract.get('programingSkills')) {
					contract.get('programingSkills').forEach(sk => {
						if ((sk.get('skill') && sk.get('skill').get('title') === skill) || skill === '') {
							validate.skill = true;
						}
					});
					contract.get('roles').forEach(rl => {
						if (role === '' || rl.get('title') === role) {
							validate.role = true;
						}
					});
					if ((contract.get('roles') === undefined || contract.get('roles').length === 0) && role === '') {
						validate.role = true;
					}
					if (Date.parse(contract.get('postedAt') || contract.get('createdAt')) >= val.getTime()) {
						validate.date = true;
					}
					if (!contract.get('owner') || !(contract.get('status') <= 1 && contract.get('status') >= 0)) {
						validate.role = false;
					}
					if (validate.date && validate.role && validate.skill) {
						arrayOfValidApplies.push(app);
					}
				}
			});
			const result: {
				name: string,
				count: number,
				skills: {
					skName: string,
					cat: string,
					count: number
				}[],
				roles ?: {
					rlName: string,
					count: number
				}[],
				owner ?: {
					oName: string,
					avatarUrl: string,
					count: number
				}[],
				erps ?: {
					erpName: string,
					count: number
				}[],
				empls ?: {
					email: string,
					count: number
				}[]
			}[] = new Array();
			arrayOfValidApplies.forEach(el => {
				const jbName: string = el.get('Source_JobBoard').get('Name');
				const ownerName = el.get('contract').get('owner').get('firstName') + ' ' + el.get('contract').get('owner').get('lastName');
				const ownerAvatar = el.get('contract').get('owner').get('avatarURL');
				const roleArray = el.get('contract').get('roles');
				const skillsArray = el.get('contract').get('programingSkills');
				let check = {
					bool: false,
					index: -1
				};
				for (let i = 0; i < result.length; i++) {
					if (result[i].name === jbName) {
						check = {
							bool: true,
							index: i
						};
					}
				}
				if (check.bool) {
					result[check.index].count++;
					let o_check = {
						bool: false,
						index: -1
					};
					for (let j = 0; j < result[check.index].owner.length; j++) {
						if (result[check.index].owner[j].oName === ownerName) {
							o_check = {
								bool: true,
								index: j
							};
						}
					}
					if (o_check.bool) {
						result[check.index].owner[o_check.index].count++;
					} else {
						result[check.index].owner.push({
							oName: ownerName,
							avatarUrl: ownerAvatar,
							count: 1
						});
					}
					roleArray.forEach(rl_temp => {
						let r_check = {
							bool: false,
							index: -1
						};
						for (let k = 0; k < result[check.index].roles.length; k++) {
							if (result[check.index].roles[k].rlName === rl_temp.get('title')) {
								r_check = {
									bool: true,
									index: k
								};
							}
						}
						if (r_check.bool) {
							result[check.index].roles[r_check.index].count++;
						} else {
							result[check.index].roles.push({
								rlName: rl_temp.get('title'),
								count: 1
							});
						}
					});
					skillsArray.forEach(ski => {
						let sk_check = {
							bool: false,
							index: -1
						};
						for (let o = 0; o < result[check.index].skills.length; o++) {
							if (ski.get('skill') && result[check.index].skills[o].skName === ski.get('skill').get('title')) {
								sk_check = {
									bool: true,
									index: o
								};
							}
						}
						if (sk_check.bool) {
							result[check.index].skills[sk_check.index].count++;
						} else if (ski.get('skill') && ski.get('skill').get('categories')) {
							let categories = '';
							ski.get('skill').get('categories').forEach(c => {
								for (let ijk = 0; ijk < this.categories.length; ijk++) {
									if (this.categories[ijk].id === c) {
										categories += this.categories[ijk].name + '| ';
									}
								}
							});
							let catResult = categories.slice(0, categories.length - 2);
							if (ski.get('skill').get('categories').length > 1) {
								catResult = catResult.split('|')[0] + ' and more...';
							}
							result[check.index].skills.push({
								skName: ski.get('skill').get('title'),
								cat: catResult,
								count: 1
							});
						}
					});
				} else {
					const rls: {
						rlName: string,
						count: number
					}[] = new Array();
					roleArray.forEach(rl => {
						rls.push({
							rlName: rl.get('title'),
							count: 1
						});
					});
					const skls: {
						skName: string,
						cat: string,
						count: number
					}[] = new Array();
					skillsArray.forEach(skk => {
						let categories = '';
						if (skk.get('skill') && skk.get('skill').get('categories')) {
							skk.get('skill').get('categories').forEach(c => {
								for (let ijk = 0; ijk < this.categories.length; ijk++) {
									if (this.categories[ijk].id === c) {
										categories += this.categories[ijk].name + '| ';
									}
								}
							});
							let catResult = categories.slice(0, categories.length - 2);
							if (skk.get('skill').get('categories').length > 1) {
								catResult = catResult.split('|')[0] + ' and more...';
							}
							skls.push({
								skName: skk.get('skill').get('title'),
								cat: catResult,
								count: 1
							});
						}
					});
					const owners: {
						oName: string,
						avatarUrl: string,
						count: number
					}[] = new Array();
					owners.push({
						oName: ownerName,
						avatarUrl: ownerAvatar,
						count: 1
					});
					result.push({
						name: jbName,
						count: 1,
						skills: skls,
						roles: rls,
						owner: owners
					});
				}
			});
			return result;
		});
	}
	getAllApplyesRC(val: Date, skill: string, role: string) {
		const query = this._parse.Query('ContractApply');
		query.equalTo('Client', this._graphcsServ.getUserClient());
		query.exists('CandidateSource');
		query.select('CandidateSource.SourceChannel');
		query.select('contract.programingSkills.title');
		query.select('contract.programingSkills.categories');
		query.select('contract.roles.title');
		query.select('contract.owner');
		query.select('contract.postedAt');
		query.select('contract.status');
		
		return query.find().then(applies => {
			const arrayOfValidApplies = new Array();
			applies.forEach(app => {
				const validate: {
					date: boolean,
					skill: boolean,
					role: boolean
				} = {
					date: false,
					skill: false,
					role: false
				};
				const contract = app.get('contract');
				if (contract) {
					contract.get('programingSkills').forEach(sk => {
						if ((sk.get('skill') && sk.get('skill').get('title') === skill) || skill === '') {
							validate.skill = true;
						}
					});
					contract.get('roles').forEach(rl => {
						if (rl.get('title') === role || role === '') {
							validate.role = true;
						}
					});
					if ((contract.get('roles') === undefined || contract.get('roles').length === 0) && role === '') {
						validate.role = true;
					}
					if (Date.parse(contract.get('postedAt') || contract.get('createdAt')) >= val.getTime()) {
						validate.date = true;
					}
					if (!contract.get('owner') || !(contract.get('status') <= 1 && contract.get('status') >= 0)) {
						validate.role = false;
					}
					if (validate.date && validate.role && validate.skill) {
						arrayOfValidApplies.push(app);
					}
				}
			});
			const result: {
				name: string,
				count: number,
				skills: {
					skName: string,
					cat: string,
					count: number
				}[],
				roles: {
					rlName: string,
					count: number
				}[],
				owner: {
					oName: string,
					avatarUrl: string,
					count: number
				}[]
			}[] = new Array();
			arrayOfValidApplies.forEach(el => {
				const jbName: string = el.get('CandidateSource').get('SourceChannel');
				const ownerName = el.get('contract').get('owner').get('firstName') + ' ' + el.get('contract').get('owner').get('lastName');
				const ownerAvatar = el.get('contract').get('owner').get('avatarURL');
				const roleArray = el.get('contract').get('roles');
				const skillsArray = el.get('contract').get('programingSkills');
				let check = {
					bool: false,
					index: -1
				};
				for (let i = 0; i < result.length; i++) {
					if (result[i].name === jbName) {
						check = {
							bool: true,
							index: i
						};
					}
				}
				if (check.bool) {
					result[check.index].count++;
					let o_check = {
						bool: false,
						index: -1
					};
					for (let j = 0; j < result[check.index].owner.length; j++) {
						if (result[check.index].owner[j].oName === ownerName) {
							o_check = {
								bool: true,
								index: j
							};
						}
					}
					if (o_check.bool) {
						result[check.index].owner[o_check.index].count++;
					} else {
						result[check.index].owner.push({
							oName: ownerName,
							avatarUrl: ownerAvatar,
							count: 1
						});
					}
					roleArray.forEach(rl_temp => {
						let r_check = {
							bool: false,
							index: -1
						};
						for (let k = 0; k < result[check.index].roles.length; k++) {
							if (result[check.index].roles[k].rlName === rl_temp.get('title')) {
								r_check = {
									bool: true,
									index: k
								};
							}
						}
						if (r_check.bool) {
							result[check.index].roles[r_check.index].count++;
						} else {
							result[check.index].roles.push({
								rlName: rl_temp.get('title'),
								count: 1
							});
						}
					});
					skillsArray.forEach(ski => {
						let sk_check = {
							bool: false,
							index: -1
						};
						for (let o = 0; o < result[check.index].skills.length; o++) {
							if (ski.get('skill') && result[check.index].skills[o].skName === ski.get('skill').get('title')) {
								sk_check = {
									bool: true,
									index: o
								};
							}
						}
						if (sk_check.bool) {
							result[check.index].skills[sk_check.index].count++;
						} else if (ski.get('skill') && ski.get('skill').get('categories')) {
							let categories = '';
							ski.get('skill').get('categories').forEach(c => {
								for (let ijk = 0; ijk < this.categories.length; ijk++) {
									if (this.categories[ijk].id === c) {
										categories += this.categories[ijk].name + '| ';
									}
								}
							});
							let catResult = categories.slice(0, categories.length - 2);
							if (ski.get('skill').get('categories').length > 1) {
								catResult = catResult.split('|')[0] + ' and more...';
							}
							result[check.index].skills.push({
								skName: ski.get('skill').get('title'),
								cat: catResult,
								count: 1
							});
						}
					});
				} else {
					const rls: {
						rlName: string,
						count: number
					}[] = new Array();
					roleArray.forEach(rl => {
						rls.push({
							rlName: rl.get('title'),
							count: 1
						});
					});
					const skls: {
						skName: string,
						cat: string,
						count: number
					}[] = new Array();
					skillsArray.forEach(skk => {
						let categories = '';
						if (skk.get('skill') && skk.get('skill').get('categories')) {
							skk.get('skill').get('categories').forEach(c => {
								for (let ijk = 0; ijk < this.categories.length; ijk++) {
									if (this.categories[ijk].id === c) {
										categories += this.categories[ijk].name + '| ';
									}
								}
							});
							let catResult = categories.slice(0, categories.length - 2);
							if (skk.get('skill').get('categories').length > 1) {
								catResult = catResult.split('|')[0] + ' and more...';
							}
							skls.push({
								skName: skk.get('skill').get('title'),
								cat: catResult,
								count: 1
							});
						}
					});
					const owners: {
						oName: string,
						avatarUrl: string,
						count: number
					}[] = new Array();
					owners.push({
						oName: ownerName,
						avatarUrl: ownerAvatar,
						count: 1
					});
					result.push({
						name: jbName,
						count: 1,
						skills: skls,
						roles: rls,
						owner: owners
					});
				}
			});
			return result;
		});
	}
	getAllOfferedOrHired(cmpData: Date, type, skill: string, role: string) {
		const query = this._parse.Query('UserList');
		query.equalTo('Client', this._graphcsServ.getUserClient());
		query.exists('JobBoardSource');
		query.select('contract.programingSkills.title');
		query.select('contract.programingSkills.categories');
		query.select('contract.roles');
		query.select('contract.owner');
		query.select('JobBoardSource.Name');
		query.select('contract.postedAt');
		query.select('contract.status');
		query.select('movingHistory');
		return query.find().then(offerOrHired => {
			const validContracts = new Array();
			offerOrHired.forEach(el => {
				const validate: {
					date: boolean,
					skill: boolean,
					role: boolean,
					type: boolean
				} = {
					date: false,
					skill: false,
					role: false,
					type: false
				};
				const contract = el.get('contract');
				if (contract) {
					contract.get('programingSkills').forEach(sk => {
						if ((sk.get('skill') && sk.get('skill').get('title') === skill) || skill === '') {
							validate.skill = true;
						}
					});
					if (contract.get('programingSkills').length === 0 && skill === '') {
						validate.skill = true;
					}
					contract.get('roles').forEach(rl => {
						if (rl.get('title') === role || role === '') {
							validate.role = true;
						}
					});
					if (contract.get('roles') === 0 && role === '') {
						validate.role = true;
					}
					el.get('movingHistory').forEach(hist => {
						if (hist.type === type) {
							validate.type = true;
						}
					});
					if (Date.parse(contract.get('postedAt') || contract.get('createdAt')) >= cmpData.getTime()) {
						validate.date = true;
					}
					if (!contract.get('owner') || !(contract.get('status') <= 1 && contract.get('status') >= 0)) {
						validate.role = false;
					}
					if (validate.date && validate.role && validate.skill && validate.type) {
						validContracts.push(el);
					}
				}
			});
			const resultOffHire: {
				name: string,
				count: number,
				skills: {
					skName: string,
					cat: string,
					count: number
				}[],
				roles: {
					rlName: string,
					count: number
				}[],
				owner: {
					oName: string,
					avatarUrl: string,
					count: number
				}[]
			}[] = new Array();
			validContracts.forEach(valOffHire => {
				const ownerName = valOffHire.get('contract').get('owner').get('firstName') + ' ' + valOffHire.get('contract').get('owner').get('lastName');
				const ownerAvatar = valOffHire.get('contract').get('owner').get('avatarURL');
				const roleArray = valOffHire.get('contract').get('roles');
				const skillsArray = valOffHire.get('contract').get('programingSkills');
				const jbName = valOffHire.get('JobBoardSource').get('Name');
				let check = {
					bool: false,
					index: -1
				};
				for (let i = 0; i < resultOffHire.length; i++) {
					if (resultOffHire[i].name === jbName && !check.bool) {
						check = {
							bool: true,
							index: i
						};
					}
				}
				if (check.bool) {
					resultOffHire[check.index].count++;
					let o_check = {
						bool: false,
						index: -1
					};
					for (let j = 0; j < resultOffHire[check.index].owner.length; j++) {
						if (resultOffHire[check.index].owner[j].oName === ownerName) {
							o_check = {
								bool: true,
								index: j
							};
						}
					}
					if (o_check.bool) {
						resultOffHire[check.index].owner[o_check.index].count++;
					} else {
						resultOffHire[check.index].owner.push({
							oName: ownerName,
							avatarUrl: ownerAvatar,
							count: 1
						});
					}
					roleArray.forEach(rl_temp => {
						let r_check = {
							bool: false,
							index: -1
						};
						for (let k = 0; k < resultOffHire[check.index].roles.length; k++) {
							if (resultOffHire[check.index].roles[k].rlName === rl_temp.get('title')) {
								r_check = {
									bool: true,
									index: k
								};
							}
						}
						if (r_check.bool) {
							resultOffHire[check.index].roles[r_check.index].count++;
						} else {
							resultOffHire[check.index].roles.push({
								rlName: rl_temp.get('title'),
								count: 1
							});
						}
					});
					skillsArray.forEach(ski => {
						let sk_check = {
							bool: false,
							index: -1
						};
						for (let o = 0; o < resultOffHire[check.index].skills.length; o++) {
							if (ski.get('skill') && resultOffHire[check.index].skills[o].skName.indexOf(ski.get('skill').get('title')) >= 0) {
								sk_check = {
									bool: true,
									index: o
								};
							}
						}
						if (sk_check.bool) {
							resultOffHire[check.index].skills[sk_check.index].count++;
						} else if (ski.get('skill') && ski.get('skill').get('categories')) {
							let categories = '';
							ski.get('skill').get('categories').forEach(c => {
								for (let ijk = 0; ijk < this.categories.length; ijk++) {
									if (this.categories[ijk].id === c) {
										categories += this.categories[ijk].name + '| ';
									}
								}
							});
							let catResult = categories.slice(0, categories.length - 2);
							if (ski.get('skill').get('categories').length > 1) {
								catResult = catResult.split('|')[0] + ' and more...';
							}
							resultOffHire[check.index].skills.push({
								skName: ski.get('skill').get('title'),
								cat: catResult,
								count: 1
							});
						}
					});
				} else {
					const rls: {
						rlName: string,
						count: number
					}[] = new Array();
					roleArray.forEach(rl => {
						rls.push({
							rlName: rl.get('title'),
							count: 1
						});
					});
					
					const skls: {
						skName: string,
						cat: string,
						count: number
					}[] = new Array();
					skillsArray.forEach(skk => {
						let categories = '';
						if (skk.get('skill') && skk.get('skill').get('categories')) {
							skk.get('skill').get('categories').forEach(c => {
								for (let ijk = 0; ijk < this.categories.length; ijk++) {
									if (this.categories[ijk].id === c) {
										categories += this.categories[ijk].name + '| ';
									}
								}
							});
							let catResult = categories.slice(0, categories.length - 2);
							if (skk.get('skill').get('categories').length > 1) {
								catResult = catResult.split('|')[0] + ' and more...';
							}
							skls.push({
								skName: skk.get('skill').get('title'),
								cat: catResult,
								count: 1
							});
						}
					});
					const owners: {
						oName: string,
						avatarUrl: string,
						count: number
					}[] = new Array();
					owners.push({
						oName: ownerName,
						avatarUrl: ownerAvatar,
						count: 1
					});
					resultOffHire.push({
						name: jbName,
						count: 1,
						skills: skls,
						roles: rls,
						owner: owners
					});
				}
			});
			return resultOffHire;
		});
	}
	getAllOfferedOrHiredRC(cmpData: Date, type: number, skill: string, role: string) {
		const client = this._graphcsServ.getUserClient();
		const query = this._parse.Query('UserList');
		query.equalTo('Client', client);
		query.exists('CandidateSource');
		query.select('contract.programingSkills.title');
		query.select('contract.programingSkills.categories');
		query.select('contract.roles');
		query.select('contract.owner');
		query.select('JobBoardSource.Name');
		query.select('CandidateSource.SourceChannel');
		query.select('contract.postedAt');
		query.select('contract.status');
		query.select('movingHistory');
		return query.find().then(offerOrHired => {
			const validContracts = new Array();
			offerOrHired.forEach(el => {
				const validate: {
					date: boolean,
					skill: boolean,
					role: boolean,
					type: boolean
				} = {
					date: false,
					skill: false,
					role: false,
					type: false
				};
				const contract = el.get('contract');
				if (contract) {
					contract.get('programingSkills').forEach(sk => {
						if ((sk.get('skill') && sk.get('skill').get('title') === skill) || skill === '') {
							validate.skill = true;
						}
					});
					if (contract.get('programingSkills').length === 0 && skill === '') {
						validate.skill = true;
					}
					contract.get('roles').forEach(rl => {
						if (rl.get('title') === role || role === '') {
							validate.role = true;
						}
					});
					if (contract.get('roles') === 0 && role === '') {
						validate.role = true;
					}
					if (!contract.get('owner') || !(contract.get('status') <= 1 && contract.get('status') >= 0)) {
						validate.role = false;
					}
					el.get('movingHistory').forEach(hist => {
						if (hist.type === type) {
							validate.type = true;
						}
					});
					if (Date.parse(contract.get('postedAt') || contract.get('createdAt')) >= cmpData.getTime()) {
						validate.date = true;
					}
					if (validate.date && validate.role && validate.skill && validate.type) {
						validContracts.push(el);
					}
				}
			});
			const resultOffHire: {
				name: string,
				count: number,
				skills: {
					skName: string,
					cat: string,
					count: number
				}[],
				roles ?: {
					rlName: string,
					count: number,
					link ?: string
				}[],
				owner ?: {
					oName: string,
					avatarUrl: string,
					count: number
				}[],
				erps ?: {
					erpName: string,
					type: string,
					count: number
				}[],
				emps ?: {
					empMail: string,
					count: number
				}[]
			}[] = new Array();
			validContracts.forEach(valOffHire => {
				const ownerName = valOffHire.get('contract').get('owner').get('firstName') + ' ' + valOffHire.get('contract').get('owner').get('lastName');
				const ownerAvatar = valOffHire.get('contract').get('owner').get('avatarURL');
				const roleArray = valOffHire.get('contract').get('roles');
				const skillsArray = valOffHire.get('contract').get('programingSkills');
				const jbName = valOffHire.get('CandidateSource') ? valOffHire.get('CandidateSource').get('SourceChannel') : '';
				if (jbName !== 'Employee Referral') {
					let check = {
						bool: false,
						index: -1
					};
					for (let i = 0; i < resultOffHire.length; i++) {
						if (resultOffHire[i].name === jbName && !check.bool) {
							check = {
								bool: true,
								index: i
							};
						}
					}
					if (check.bool) {
						resultOffHire[check.index].count++;
						let o_check = {
							bool: false,
							index: -1
						};
						for (let j = 0; j < resultOffHire[check.index].owner.length; j++) {
							if (resultOffHire[check.index].owner[j].oName === ownerName) {
								o_check = {
									bool: true,
									index: j
								};
							}
						}
						if (o_check.bool) {
							resultOffHire[check.index].owner[o_check.index].count++;
						} else {
							resultOffHire[check.index].owner.push({
								oName: ownerName,
								avatarUrl: ownerAvatar,
								count: 1
							});
						}
						roleArray.forEach(rl_temp => {
							let r_check = {
								bool: false,
								index: -1
							};
							for (let k = 0; k < resultOffHire[check.index].roles.length; k++) {
								if (resultOffHire[check.index].roles[k].rlName === rl_temp.get('title')) {
									r_check = {
										bool: true,
										index: k
									};
								}
							}
							if (r_check.bool) {
								resultOffHire[check.index].roles[r_check.index].count++;
							} else {
								resultOffHire[check.index].roles.push({
									rlName: rl_temp.get('title'),
									count: 1
								});
							}
						});
						skillsArray.forEach(ski => {
							let sk_check = {
								bool: false,
								index: -1
							};
							for (let o = 0; o < resultOffHire[check.index].skills.length; o++) {
								if (ski.get('skill') && resultOffHire[check.index].skills[o].skName.indexOf(ski.get('skill').get('title')) >= 0) {
									sk_check = {
										bool: true,
										index: o
									};
								}
							}
							if (sk_check.bool) {
								resultOffHire[check.index].skills[sk_check.index].count++;
							} else if (ski.get('skill') && ski.get('skill').get('categories')) {
								let categories = '';
								ski.get('skill').get('categories').forEach(c => {
									for (let ijk = 0; ijk < this.categories.length; ijk++) {
										if (this.categories[ijk].id === c) {
											categories += this.categories[ijk].name + '| ';
										}
									}
								});
								let catResult = categories.slice(0, categories.length - 2);
								if (ski.get('skill').get('categories').length > 1) {
									catResult = catResult.split('|')[0] + ' and more...';
								}
								resultOffHire[check.index].skills.push({
									skName: ski.get('skill').get('title'),
									cat: catResult,
									count: 1
								});
							}
						});
					} else {
						const rls: {
							rlName: string,
							count: number
						}[] = new Array();
						roleArray.forEach(rl => {
							rls.push({
								rlName: rl.get('title'),
								count: 1
							});
						});
						
						const skls: {
							skName: string,
							cat: string,
							count: number
						}[] = new Array();
						skillsArray.forEach(skk => {
							let categories = '';
							if (skk.get('skill') && skk.get('skill').get('categories')) {
								skk.get('skill').get('categories').forEach(c => {
									for (let ijk = 0; ijk < this.categories.length; ijk++) {
										if (this.categories[ijk].id === c) {
											categories += this.categories[ijk].name + '| ';
										}
									}
								});
								let catResult = categories.slice(0, categories.length - 2);
								if (skk.get('skill').get('categories').length > 1) {
									catResult = catResult.split('|')[0] + ' and more...';
								}
								skls.push({
									skName: skk.get('skill').get('title'),
									cat: catResult,
									count: 1
								});
							}
						});
						const owners: {
							oName: string,
							avatarUrl: string,
							count: number
						}[] = new Array();
						owners.push({
							oName: ownerName,
							avatarUrl: ownerAvatar,
							count: 1
						});
						resultOffHire.push({
							name: jbName,
							count: 1,
							skills: skls,
							roles: rls,
							owner: owners
						});
					}
				}
			});
			return resultOffHire;
		}).then(resultOffH => {
			const erName = 'Employee Referral';
			const qEr = this._parse.Query('UserList');
			qEr.equalTo('Client', client);
			qEr.greaterThanOrEqualTo('createdAt', cmpData);
			qEr.doesNotExist('JobBoardSource');
			qEr.equalTo('CandidateSource', this.createPointer('CandidateSource', '1INAZcMTcM'));
			qEr.include('contract');
			return qEr.find().then(res => {
				if (res) {
					let counter = 0;
					res.forEach(elcs => {
						let flag = false;
						elcs.get('movingHistory').forEach(mHEl => {
							if (mHEl.type === type) {
								flag = true;
							}
						});
						counter += flag ? 1 : 0;
					});
					resultOffH.push({
						name: erName,
						count: counter,
						skills: [{
							skName: '',
							cat: '',
							count: 0
						}],
						roles: [{
							rlName: '',
							count: 0,
							link: ''
						}],
						owner: [{
							oName: '',
							avatarUrl: '',
							count: 0
						}]
					});
				}
				return resultOffH;
			});
		}).then(resultOfHH => {
			const qEr1 = this._parse.Query('UserList');
			qEr1.greaterThanOrEqualTo('createdAt', cmpData);
			qEr1.descending('createdAt');
			qEr1.equalTo('CandidateSource', this.createPointer('CandidateSource', '1INAZcMTcM'));
			qEr1.equalTo('Client', client);
			qEr1.include('contract');
			qEr1.doesNotExist('JobBoardSource');
			qEr1.include('contract.programingSkills');
			qEr1.include('contract.programingSkills.skill');
			return (qEr1.find().then(res1 => {
				if (res1) {
					const skillsForCompare: {
						name: string,
						cat: string
					}[] = new Array();
					res1.forEach(elcs => {
						let flag = false;
						elcs.get('movingHistory').forEach(mHEl => {
							if (mHEl.type === type) {
								flag = true;
							}
						});
						if (flag) {
							if (this.safeGetter(elcs, ['contract', 'programingSkills'])) {
								this.safeGetter(elcs, ['contract', 'programingSkills']).forEach(ssk => {
									let category = '';
									const skCatId = this.safeGetter(ssk, ['skill', 'categories'])[0];
									if (skCatId !== null) {
										this.categories.forEach(cat => {
											if (cat.id === skCatId) {
												category = cat.name;
												if (this.safeGetter(ssk, ['skill', 'categories']).length > 1) {
													category += ' and more...';
												}
											}
										});
									}
									skillsForCompare.push({
										name: this.safeGetter(ssk, ['skill', 'title']),
										cat: category
									});
								});
							}
						}
					});
					resultOfHH[resultOfHH.length - 1].skills = this.findAndCountEqualsInArray(skillsForCompare);
					return (resultOfHH);
				}
				return (resultOfHH);
			}));
		}).then(resultOfHHH => {
			const qEr2 = this._parse.Query('UserList');
			qEr2.greaterThanOrEqualTo('createdAt', cmpData);
			qEr2.equalTo('CandidateSource', this.createPointer('CandidateSource', '1INAZcMTcM'));
			qEr2.equalTo('Client', client);
			qEr2.doesNotExist('JobBoardSource');
			qEr2.include('contract');
			qEr2.include('contract.roles');
			return (qEr2.find().then(resik => {
				if (resik) {
					const rolesForCompare: string[] = new Array();
					resik.forEach(elcs => {
						let flag = false;
						elcs.get('movingHistory').forEach(mHEl => {
							if (mHEl.type === type) {
								flag = true;
							}
						});
						if (flag) {
							if (this.safeGetter(elcs, ['contract', 'roles'])) {
								this.safeGetter(elcs, ['contract', 'roles']).forEach(rl => {
									rolesForCompare.push(this.safeGetter(rl, ['title']));
								});
							}
						}
					});
					resultOfHHH[resultOfHHH.length - 1].roles = this.findAndCountEqualsInRolesArray(rolesForCompare);
					return (resultOfHHH);
				}
				return (resultOfHHH);
			}));
		}).then(resultOfHHHH => {
			const qEr3 = this._parse.Query('UserList');
			qEr3.greaterThanOrEqualTo('createdAt', cmpData);
			qEr3.equalTo('CandidateSource', this.createPointer('CandidateSource', '1INAZcMTcM'));
			qEr3.equalTo('Client', client);
			qEr3.include('contract');
			qEr3.doesNotExist('JobBoardSource');
			qEr3.include('contract.employeeReferralProgram');
			qEr3.include('contract.employeeReferralProgram.Type');
			return (qEr3.find().then(resultikus => {
				if (resultikus) {
					const tempArr: {
						erpName: string,
						type: string
					}[] = new Array();
					resultikus.forEach(elcs => {
						let flag = false;
						elcs.get('movingHistory').forEach(mHEl => {
							if (mHEl.type === type) {
								flag = true;
							}
						});
						if (flag) {
							if (this.safeGetter(elcs, ['contract', 'employeeReferralProgram', 'Title'])) {
								tempArr.push({
									erpName: this.safeGetter(elcs, ['contract', 'employeeReferralProgram', 'Title']),
									type: this.safeGetter(elcs, ['contract', 'employeeReferralProgram', 'Type', 'Type'])
								});
							}
						}
					});
					resultOfHHHH[resultOfHHHH.length - 1].erps = this.findAndCountEqualsInErpArray(tempArr);
					return (resultOfHHHH);
				}
				return (resultOfHHHH);
			}));
		}).then(resultOfHHHHH => {
			const qEr4 = this._parse.Query('UserList');
			qEr4.greaterThanOrEqualTo('createdAt', cmpData);
			qEr4.doesNotExist('JobBoardSource');
			qEr4.equalTo('CandidateSource', this.createPointer('CandidateSource', '1INAZcMTcM'));
			qEr4.equalTo('Client', client);
			return (qEr4.find().then(contrIds => {
				if (contrIds) {
					const tempForDetailed = new Array();
					contrIds.forEach(iff => {
						let boolka = false;
						iff.get('movingHistory').forEach(mHEl => {
							if (mHEl.type === type) {
								boolka = true;
							}
						});
						if (boolka) {
							tempForDetailed.push(iff.get('contract').id);
						}
					});
					const zzz = tempForDetailed.map(item => this.createPointer('Contract', item));
					const lastQuery = this._parse.Query('EmployeeReferrals');
					lastQuery.containedIn('contract', zzz);
					return (lastQuery.find().then(resultatus => {
						resultOfHHHHH[resultOfHHHHH.length - 1].emps = this.findAndCountEqualsInRefMailsArray(resultatus);
						return (resultOfHHHHH);
					}));
				}
				return (resultOfHHHHH);
			}));
		});
	}
	createPointer(objectClass, objectID) {
		let pointer = this._parse.Object(objectClass);
		pointer.id = objectID;
		return pointer;
	}
	safeGetter(from, args: string[]) {
		let result = from;
		if (args.length === 0) {
			return (null);
		} else {
			if (from.get(args[0]) !== undefined) {
				result = from.get(args[0]);
				if (args.length > 1) {
					return (this.safeGetter(result, args.slice(1, args.length)));
				} else {
					return (result);
				}
			}
			return (null);
		}
	}
	findAndCountEqualsInArray(array: {
		name: string,
		cat: string
	}[]): {
		skName: string,
		cat: string,
		count: number
	}[] {
		const result: {
			skName: string,
			cat: string,
			count: number
		}[] = new Array();
		array.forEach(sk => {
			let val = false;
			result.forEach(resik => {
				if (resik.skName === sk.name) {
					resik.count++;
					val = true;
				}
			});
			if (!val) {
				result.push({
					skName: sk.name,
					cat: sk.cat,
					count: 1
				});
			}
		});
		return (result);
	}
	findAndCountEqualsInRolesArray(array: string[]): {
		rlName: string,
		count: number
	}[] {
		const result: {
			rlName: string,
			count: number
		}[] = new Array();
		array.forEach(rl => {
			let val = false;
			result.forEach(resik => {
				if (resik.rlName === rl) {
					resik.count++;
					val = true;
				}
			});
			if (!val) {
				result.push({
					rlName: rl,
					count: 1
				});
			}
		});
		return (result);
	}
	findAndCountEqualsInErpArray(array: {
		erpName: string,
		type: string
	}[]): {
		erpName: string,
		type: string,
		count: number
	}[] {
		const result: {
			erpName: string,
			type: string,
			count: number
		}[] = new Array();
		array.forEach(erp => {
			let val = false;
			result.forEach(resik => {
				if (resik.erpName === erp.erpName) {
					resik.count++;
					val = true;
				}
			});
			if (!val) {
				result.push({
					erpName: erp.erpName,
					type: erp.type,
					count: 1
				});
			}
		});
		return (result);
	}
	findAndCountEqualsInRefMailsArray(array): {
		empMail: string,
		count: number
	}[] {
		const result: {
			empMail: string,
			count: number
		}[] = new Array();
		array.forEach(obj => {
			let val = false;
			result.forEach(resik => {
				if (resik.empMail === obj.get('employeeEmail')) {
					resik.count++;
					val = true;
				}
			});
			if (!val) {
				result.push({
					empMail: obj.get('employeeEmail'),
					count: 1
				});
			}
		});
		return (result);
	}
}

