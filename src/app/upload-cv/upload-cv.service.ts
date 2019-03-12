/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   upload-cv.service.ts                               :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: afarapon <afarapon@student.unit.ua>        +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2017/12/06 14:32:46 by afarapon          #+#    #+#             */
/*   Updated: 2017/12/18 13:44:38 by afarapon         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import {
	Injectable
} from '@angular/core';
import {
	Http,
	RequestOptions,
	Headers
} from '@angular/http';
import {
	Observable
} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import {
	Parse
} from './../parse.service';
import {
	GraphicsService
} from './../graphics/graphics.service';
import {
	UploadCvComponent
} from './upload-cv.component';



@Injectable()
export class UploadCvService {
	component: UploadCvComponent;
	parsedResumes = new Array();
	skillCategories: {
		name: string,
		id: string
	}[] = new Array();
	skillsFromParse: {
		name: string,
		id: string
	}[] = new Array();
	countries: {
		name: string,
		id: string
	}[];

	constructor(private http: Http, private _parse: Parse, private _graphic: GraphicsService) {
		this._graphic.getSkills().then(res => {
			res.forEach(element => {
				this.skillsFromParse.push({
					name: element.name,
					id: element.id
				});
			});
		});
		this._graphic.getCountries().then(res => {
			this.countries = res;
		});
		this._graphic.getCategories().then(res => {
			this.skillCategories = res;
		});
	}
	parseCvService2(
		cvFile,
		src: {
			listChoice: number,
			chSrcId: string,
			chSrcName: string,
			jbSrcId: string,
			jbSrcName: string,
			contract: {
				name: string,
				id: string
			},
			last: boolean,
			linkedin: string,
			email: string,
			fewlines: string
		},
		cmp: UploadCvComponent
	): any {
		const reader = new FileReader();
		reader.addEventListener('loadend', (event) => {
			const data = reader.result.split(',')[1];
			const jsonObject = JSON.stringify({
				'filedata': data,
				'filename': cvFile.name,
				'userkey': 'VBDK5ZXUULD',
				'version': '7.0.0',
				'subuserid': 'SWIPEIN'
			});
			const headers = new Headers();
			headers.append('Access-Control-Allow-Origin', '*');
			headers.append('Content-Type', 'application/json');
			const request = this.http.post(' https://rest.rchilli.com/RChilliParser/Rchilli/parseResumeBinary',
			jsonObject, {
				headers: headers
			});
			request.map(res => {
				return res.json();
			}).subscribe(resz => {
				if (resz.error) {
					cmp.resultsArray.push({
						cvName: cvFile.name,
						result: this.getError(resz.error.errorcode),
						resultCode: 0
					});
					if (src.last) {
						cmp.isReady = true;
						cmp.isReadyPreLoader = false;
						cmp.resultsReady = true;
					}
					return null;
				}
				const r = resz.ResumeParserData;
				console.log('RCHILLI LOG:');
				console.log(r);
				const skills: {
					name: string,
					id: string
				}[] = new Array();
				let country: {
					name: string,
					id: string
				};

				// 						NEW SKILLS FOUNDING
				// SoftSkill OperationalSkill BehaviorSkill
				const newSkills: {
					title: string,
					category: string[]
				}[] = new Array();
				if (r.SkillKeywords && r.SkillKeywords.SkillSet) {
					r.SkillKeywords.SkillSet.forEach(targetSkill => {
						let flag = true;
						if (targetSkill.Type === 'SoftSkill' || targetSkill.Type === 'OperationalSkill' || targetSkill.Type === 'BehaviorSkill') {
							this.skillsFromParse.forEach(el => {
								if (el.name === targetSkill.Skill) {
									flag = false;
								}
							});
							if (flag) {
								let skillWords = targetSkill.Skill.split(' ');
								if (skillWords.length > 1) {
									let sec_flag = true;
									skillWords.forEach(skillword => {
										if (skillword.length < 3) {
											sec_flag = false;
										}
									});
									if (sec_flag) {
										let category = '';
										if (targetSkill.Type === 'SoftSkill') {
											category = this.skillCategories.filter(cat => cat.name === 'Soft Skills')[0].id;
										}else if (targetSkill.Type === 'OperationalSkill') {
											category = this.skillCategories.filter(cat => cat.name === 'Operational Skills')[0].id;
										} else if (targetSkill.Type === 'BehaviorSkill') {
											category = this.skillCategories.filter(cat => cat.name === 'Behavioral Skills')[0].id;
										}
										newSkills.push({title: targetSkill.Skill, category: [category]});
									}
								}
								skillWords = null;
							}
						}
					});
				}
				if (r.SkillKeywords && r.SkillKeywords.SkillSet) {
					r.SkillKeywords.SkillSet.forEach(element => {
						this.skillsFromParse.forEach(el => {
							if (el.name === element.Skill) {
								skills.push(el);
							}
						});
					});
				}
				this.countries.forEach(el => {
					if (el.name.trim() === r.Country.trim()) {
						country = el;
					}
				});

				let location = this.getLocation(r);

				const result = {
					firstName: r.FirstName,
					lastName: r.LastName,
					summary: r.Summary.indexOf('SUMMARY') >= 0 ? r.Summary.split('SUMMARY')[1].trim() : r.Summary,
					positions: r.SubCategory,
					companyNames: r.CurrentEmployer,
					email: r.Email,
					languages: r.LanguageKnown.split(','),
					websites: r.WebSites.WebSite,
					phone: r.Phone,
					homeCity: location,
					homeCountry: country,
					skills: skills,
					newSkills: newSkills,
					CV: reader.result.split(',')[1],
					CVName: cvFile.name,
					candidateImage: (r.CandidateImage.CandidateImageData.length > 0) ? r.CandidateImage : undefined,
				};
				if (result.email === '' || result.email.length === 0) {
					cmp.resultsArray.push({
						cvName: cvFile.name,
						result: 'User email looking bad!',
						resultCode: 0
					});
					cmp.isReady = src.last ? true : false;
					cmp.isReadyPreLoader = src.last ? false : true;
					cmp.resultsReady = src.last ? true : false;
				} else {
					const userValid = this._parse.Query('_User');
					userValid.contains('email', result.email);
					userValid.first().then(res_user_search => {
						if (res_user_search) {
							this.createListOrApplyOrReferal(src, result).then(operationResult => {
								if (operationResult) {
									cmp.resultsArray.push({
										cvName: cvFile.name,
										result: 'Success',
										resultCode: 1
									});
									if (src.listChoice === -1) {
										const qContr = this._parse.Query('Contract');
										qContr.get(src.contract.id).then(contrResult => {
											contrResult.add('applies', this.createPointer('ContractApply', operationResult.id));
											contrResult.save();
										});
									}
									this.setLeadTimeIf(src);
								} else {
									cmp.resultsArray.push({
										cvName: cvFile.name,
										result: 'Something gone wrong',
										resultCode: 0
									});
								}
								cmp.isReady = src.last ? true : false;
								cmp.isReadyPreLoader = src.last ? false : true;
								cmp.resultsReady = src.last ? true : false;
							});
							return false;
						} else {
							return true;
						}
					}).then(res => {
						if (res) {
							if (src.listChoice === 5) {
								this.createU(result).then(res2 => {
									const newEmployeeReferral = this._parse.Object('EmployeeReferrals');
									newEmployeeReferral.set('employeeEmail', src.email);
									newEmployeeReferral.set('referralLinkedinURL', src.linkedin);
									newEmployeeReferral.set('candidate', this.createPointer('_User', res2.id));
									newEmployeeReferral.set('contract', this.createPointer('Contract', src.contract.id));
									const client = this._parse.getCurrentUser().get('Client_Pointer');
									newEmployeeReferral.set('Client', this.createPointer('Clients', client.id));
									newEmployeeReferral.set('referralNotes', src.fewlines);
									newEmployeeReferral.save();
								});
							} else if (src.listChoice > -1) {
								this.createU(result).then(res2 => {
									const newUserList = this._parse.Object('UserList');
									newUserList.set('candidate', res2.toPointer());
									const mvList = new Array();
									mvList.push({
										type: src.listChoice,
										date: new Date()
									});
									newUserList.set('movingHistory', mvList);
									newUserList.set('contract', this.createPointer('Contract', src.contract.id));
									newUserList.set('author', this.createPointer('_User', this._parse.getCurrentUser().id));
									newUserList.set('listType', src.listChoice);
									newUserList.set('candidateId', res2.id);
									newUserList.set('CandidateSource', this.createPointer('CandidateSource', src.chSrcId));
									if (src.jbSrcId && src.jbSrcId.length > 0) {
										newUserList.set('JobBoardSource', this.createPointer('JobBoards', src.jbSrcId));
									}
									const client = this._parse.getCurrentUser().get('Client_Pointer');
									newUserList.set('Client', this.createPointer('Clients', client.id));
									newUserList.save();
								});
							} else {
								this.createU(result).then(res3 => {
									const newCtrlAp = this._parse.Object('ContractApply');
									newCtrlAp.set('user', this.createPointer('_User', res3.id));
									const client = this._parse.getCurrentUser().get('Client_Pointer');
									newCtrlAp.set('Client', this.createPointer('Clients', client.id));
									newCtrlAp.set('CandidateSource', this.createPointer('CandidateSource', src.chSrcId));
									if (src.jbSrcId && src.jbSrcId.length > 0) {
										newCtrlAp.set('Source_JobBoard', this.createPointer('JobBoards', src.jbSrcId));
									}
									newCtrlAp.set('contractId', src.contract.id);
									newCtrlAp.set('contract', this.createPointer('Contract', src.contract.id));
									newCtrlAp.save().then(caCreateRes => {
										const qContr = this._parse.Query('Contract');
										qContr.get(src.contract.id).then(contrResult => {
											contrResult.add('applies', this.createPointer('ContractApply', caCreateRes.id));
											contrResult.save();
										});
									});
								});
							}
							cmp.resultsArray.push({
								cvName: cvFile.name,
								result: 'Success',
								resultCode: 1
							});
							cmp.isReady = src.last ? true : false;
							cmp.isReadyPreLoader = src.last ? false : true;
							cmp.resultsReady = src.last ? true : false;
							this.setLeadTimeIf(src);
						} else {
							if (src.last) {
								cmp.isReady = true;
								cmp.isReadyPreLoader = false;
								cmp.resultsReady = true;
							}
						}
					});
				}
			});
		});
		reader.readAsDataURL(cvFile);
	}
	getError(error: number) {
		switch (error) {
			case 1001:
			case 1002:
			case 1003:
			case 1005:
			case 1006:
			case 1007:
			case 1010:
			case 1011:
			case 1012:
			case 1013:
			case 1017:
			case 1020:
			case 1041:
			case 1042:
			return ('Service error. We apologize for the temporary inconvenience.');
			case 1004:
			return ('Invalid file name or file extension.');
			case 1008:
			return ('Not text content in CV.');
			case 1009:
			return ('Resume file extension not supported. Supported: doc, docx, dot, rtf, pdf, odt, txt, htm, html.');
			case 1014:
			return ('Corrupted file data.');
			case 1015:
			return ('Unable to parse content.');
			case 1016:
			return ('No resume content found.');
			case 1018:
			return ('File size is too large for processing.');
			case 1019:
			return ('Unable to detect language.');
			case 1021:
			return ('File conversion error.');
		}
	}
	createPointer(objectClass, objectID) {
		var pointerToFoo = this._parse.Object(objectClass);
		pointerToFoo.id = objectID;
		return pointerToFoo;
	}
	getLocation(parsedCv) {
	let r = parsedCv; // shortname

	if (r.City) return r.City;
	if (r.CurrentLocation) return r.CurrentLocation;
	if (r.State) return r.State;
	if (r.PermanentCity) return r.PermanentCity;
	if (r.PermanentCountry) return r.PermanentCountry;
	if (r.PermanentState) return r.PermanentState;
	if (r.Country) return r.Country;

	return undefined;
	}
	setLeadTimeIf(src: {
		listChoice: number,
		chSrcId: string,
		chSrcName: string,
		jbSrcId: string,
		jbSrcName: string,
		contract: {
			name: string,
			id: string
		},
		last: boolean
	}) {
		switch (src.listChoice) {
			case -1:
			this.setAplicantLeadTime(src);
			break;
			case 3:
			this.setOfferedLeadTime(src);
			break;
			case 4:
			this.setHiredLeadTime(src);
			break;
			default:
			return;
		}
	}
	setAplicantLeadTime(src: {
		listChoice: number,
		chSrcId: string,
		chSrcName: string,
		jbSrcId: string,
		jbSrcName: string,
		contract: {
			name: string,
			id: string
		},
		last: boolean
	}) {
		const query = this._parse.Query('Contract');
		query.equalTo('objectId', src.contract.id);
		return query.find().then(res => {
			if (res.length === 1 && res[0].get('AplicantsLeadTime') === undefined) {
				const rs = res[0];
				let activeData;
				if (rs.get('postedAt') === undefined) {
					activeData = rs.get('createdAt');
				} else {
					activeData = rs.get('postedAt');
				}
				const newDate = new Date();
				const distance = Math.floor((newDate.getTime() - activeData.getTime()) / 1000 / 60 / 60 / 24);
				rs.set('AplicantsLeadTime', distance);
				return rs.save();
			}
			return null;
		});
	}
	setOfferedLeadTime(src: {
		listChoice: number,
		chSrcId: string,
		chSrcName: string,
		jbSrcId: string,
		jbSrcName: string,
		contract: {
			name: string,
			id: string
		},
		last: boolean
	}) {
		const query = this._parse.Query('Contract');
		query.equalTo('objectId', src.contract.id);
		return query.find().then(res => {
			if (res.length == 1 && res[0].get('JobOfferedLeadTime') == undefined) {
				let rs = res[0];
				let activeData;
				if (rs.get('postedAt') == undefined) {
					activeData = rs.get('createdAt');
				} else {
					activeData = rs.get('postedAt');
				}
				const newDate = new Date();
				const distance = Math.floor((newDate.getTime() - activeData.getTime()) / 1000 / 60 / 60 / 24);
				rs.set('JobOfferedLeadTime', distance);
				return rs.save();
			}
			return null;
		});
	}
	setHiredLeadTime(src: {
		listChoice: number,
		chSrcId: string,
		chSrcName: string,
		jbSrcId: string,
		jbSrcName: string,
		contract: {
			name: string,
			id: string
		},
		last: boolean
	}) {
		const query = this._parse.Query('Contract');
		query.equalTo('objectId', src.contract.id);
		return query.find().then(res => {
			if (res.length === 1 && res[0].get('HiringLeadTime') === undefined) {
				const rs = res[0];
				let activeData;
				if (rs.get('postedAt') === undefined) {
					activeData = rs.get('createdAt');
				} else {
					activeData = rs.get('postedAt');
				}
				const newDate = new Date();
				const distance = Math.floor((newDate.getTime() - activeData.getTime()) / 1000 / 60 / 60 / 24);
				rs.set('HiringLeadTime', distance);
				return rs.save();
			}
			return null;
		});
	}
	createSA(enemy) {
		const result = new Array();
		const newSkillResult = new Array();
		const tmpR = new Array();
		let clearSkills : any[] = enemy.skills;
		clearSkills.filter( el => {
			return !enemy.newSkills.includes( el );
		  } );
		// if (enemy.newSkills.length > 0) {
		// 	enemy.newSkills.forEach(newSkill => {
		// 		const nSkill = this._parse.Object('ProgrammingSkill');
		// 		nSkill.set('title', newSkill.title);
		// 		nSkill.set('categories', newSkill.category);
		// 		newSkillResult.push(nSkill.save());
		// 	});
		// 	return this._parse.Parse.Promise.when(newSkillResult).then((...ress) => {
		// 		enemy.skills.forEach(element => {
		// 			const skill = this._parse.Object('SkillComponent');
		// 			skill.set('skill', this.createPointer('ProgrammingSkill', element.id));
		// 			skill.set('selectedExperienceDuration', 1);
		// 			result.push(skill.save());
		// 		});
		// 		ress[0].forEach(el => {
		// 			const skill = this._parse.Object('SkillComponent');
		// 			skill.set('skill', this.createPointer('ProgrammingSkill', el.id));
		// 			skill.set('selectedExperienceDuration', 1);
		// 			result.push(skill.save());
		// 		});
		// 		return this._parse.Parse.Promise.when(result).then((...args) => {
		// 			args[0].forEach(element => {
		// 				tmpR.push(this.createPointer('SkillComponent', element.id));
		// 			});
		// 			return tmpR;
		// 		});
		// 	});
		// } else {
			clearSkills.forEach(element => {
				const skill = this._parse.Object('SkillComponent');
				skill.set('skill', this.createPointer('ProgrammingSkill', element.id));
				skill.set('selectedExperienceDuration', 1);
				result.push(skill.save());
			});
			return this._parse.Parse.Promise.when(result).then((...args) => {
				args[0].forEach(element => {
					tmpR.push(this.createPointer('SkillComponent', element.id));
				});
				return tmpR;
			});
		// }
	}
	createU(enemy) {
		const user = this._parse.createNewUser();
		user.set('password', ' ');
		user.set('firstName', enemy.firstName);
		user.set('lastName', enemy.lastName);
		user.set('summary', enemy.summary);
		user.set('email', enemy.email);
		user.set('username', enemy.email);
		user.set('Languages', enemy.languages);
		user.set('WebSites', enemy.websites);
		user.set('Phone', enemy.phone);

		if (enemy.candidateImage) {
			let cvImage = new this._parse.Parse.File(`cvImage-${enemy.firstName}-${enemy.lastName}.jpg`, { base64: enemy.candidateImage.CandidateImageData });
			cvImage.save().then(obj => {
				console.log(cvImage.url()); // debug
				user.set('cvImage', cvImage.url());
			});
		}

		return this.createD(enemy).then(dev => {
			user.set('developer', this.createPointer('Developer', dev.id));
			if (enemy.homeCountry !== undefined && enemy.homeCountry.id !== undefined) {
				user.set('countryCode', dev.get('homeCountry').get('countryCodeGoogle'));
				user.set('location', enemy.homeCountry.name);
				if (enemy.homeCity !== undefined) {
					user.set('homeLocation', enemy.homeCity + ', ' + enemy.homeCountry.name);
				}
			}
			return user.save();
		});
	}
	createD(enemy) {
		const dev = this._parse.Object('Developer');
		dev.set('homeCity', enemy.homeCity);
		const cv = this._parse.Object('CVFile');
		const name = this.createRandomFileName(enemy.CVName);
		const parseFile = this._parse.File(name, {
			base64: enemy.CV
		});
		parseFile.save();
		cv.set('documentFile', parseFile);
		cv.set('fileName', name);
		const documentSaver = cv.save();
		let geo = null;
		if (enemy.homeCountry !== undefined && enemy.homeCountry.id !== undefined) {
			dev.set('homeCountry', this.createPointer('Country', enemy.homeCountry.id));
			geo = this._parse.execCloud('getSuggestedPlaces', {
				address: enemy.homeCity + ',' + enemy.homeCountry.name
			})
			.then(res => {
				return this._parse.execCloud('getPlaceDetails', {
					placeId: res[0].place_id
				})
				.then(currentResult => {
					return currentResult.location;
				});
			});
		}
		let skills;
		if (enemy.skills.length >= 1) {
			skills = this.createSA(enemy);
		}
		const developer = dev.save();

		return this._parse.Parse.Promise.when(developer, skills, documentSaver, geo).then((devi, skills_s, cv_c, geo2) => {
			let g;
			if (geo != null) {
				g = new this._parse.Parse.GeoPoint(geo2.lat, geo2.lng);
				devi.set('postLocation', g);
			}
			devi.set('skills', skills_s);
			devi.set('documentCV', this.createPointer('CVFile', cv_c.id));
			return devi.save();
		});
	}
	getAllCandiadateSources() {
		const query = this._parse.Query('CandidateSource');
		return query.find().then(result => {
			const res: {
				name: string,
				id: string
			}[] = new Array();
			result.forEach(element => {
				res.push({
					name: element.get('SourceChannel'),
					id: element.id
				});
			});
			return res;
		});
	}
	getAllJobBoards() {
		const query = this._parse.Query('JobBoards');
		return query.find().then(result => {
			const res: {
				name: string,
				id: string
			}[] = new Array();
			result.forEach(jboard => {
				if (jboard.get('Name') !== undefined) {
					res.push({
						name: jboard.get('Name'),
						id: jboard.id
					});
				}
			});
			return res;
		});
	}
	createRandomName() {
		let name = '';
		const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

		for (let i = 0; i < 10; i++) {
			name += possible.charAt(Math.floor(Math.random() * possible.length));
		}
		name += '@fuckvalidator.com'

		return name;
	}
	createRandomFileName(filename: string) {
		const reversed = filename.split('').reverse().join('');
		const cutted = reversed.split('.')[0].split('').reverse().join('');
		let name = '';
		const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

		for (let i = 0; i < 5; i++) {
			name += possible.charAt(Math.floor(Math.random() * possible.length));
		}
		name += '.' + cutted;
		return name;
	}
	createListOrApplyOrReferal(
		src: {
			listChoice: number,
			chSrcId: string,
			chSrcName: string,
			jbSrcId: string,
			jbSrcName: string,
			contract: {
				name: string,
				id: string
			},
			last: boolean,
			linkedin: string,
			email: string,
			fewlines: string
		},
		result
	) {
		const findUser = this._parse.Query('_User');
		findUser.equalTo('email', result.email);
		return findUser.first().then(userSearchResult => {
			return userSearchResult;
		}).then(res => {
			if (res) {
				const candidate = this.createPointer('_User', res.id);
				const client = this.createPointer('Clients', this._parse.Parse.User.current().get('Client_Pointer').id);
				const contract = this.createPointer('Contract', src.contract.id);
				if (src.listChoice === -1) {
					// apply
					const createApply = this._parse.Object('ContractApply');
					createApply.set('CandidateSource', this.createPointer('CandidateSource', src.chSrcId));
					if (src.jbSrcId) {
						createApply.set('Source_JobBoard', this.createPointer('JobBoards', src.jbSrcId));
					}
					createApply.set('contract', contract);
					createApply.set('contractId', src.contract.id);
					createApply.set('Client', client);
					createApply.set('user', candidate);
					return createApply.save();
				} else if (src.listChoice === 5) {
					// erp referral
					const createReferral = this._parse.Object('EmployeeReferrals');
					createReferral.set('candidate', candidate);
					createReferral.set('referralNotes', src.fewlines);
					createReferral.set('Client', client);
					createReferral.set('employeeEmail', src.email);
					createReferral.set('contract', contract);
					createReferral.set('referralLinkedinURL', src.linkedin);
					return createReferral.save();
				} else {
					// userlist
					const createUserList = this._parse.Object('UserList');
					createUserList.set('candidate', candidate);
					const arr = new Array();
					arr.push({
						type: src.listChoice,
						date: new Date()
					});
					createUserList.set('movingHistory', arr);
					createUserList.set('author', this._parse.Parse.User.current());
					createUserList.set('Client', client);
					createUserList.set('contract', contract);
					createUserList.set('listType', src.listChoice);
					createUserList.set('candidateId', res.id);
					createUserList.set('CandidateSource', this.createPointer('CandidateSource', src.chSrcId));
					if (src.jbSrcId) {
						createUserList.set('JobBoardSource', this.createPointer('JobBoards', src.jbSrcId));
					}
					return createUserList.save();
				}
			} else {
				return null;
			}
		});
	}
}



export class UserFromCV {
	firstName: string;
	lastName: string;
	country: string;
	state: string;
	category: string;
	email: string;
	phone: string;
	skills: {
		skill: string,
		expr: number
	}[];
}
