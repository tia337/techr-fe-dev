import {
	Component,
	OnInit,
	OnDestroy
} from '@angular/core';
import {
	FiltersService
} from 'app/shared/filters.service';
import * as _ from 'underscore';
import {
	Parse
} from '../parse.service';
import {
	JobsPageService
} from './jobs-page.service';
import {
	JobDetailsService
} from '../job-details/job-details.service';
import {
	Login
} from '../login.service';
import {
	ContractStatus,
	JobsToShow,
	Loading
} from '../shared/utils';
import {
	MatButton
} from '@angular/material';
import {
	FormControl
} from '@angular/forms';
import {
	Observable
} from 'rxjs/Observable';
import {
	startWith
} from 'rxjs/operators/startWith';
import {
	map
} from 'rxjs/operators/map';
import {
	AfterViewInit
} from '@angular/core/src/metadata/lifecycle_hooks';
import { GraphicsService } from 'app/graphics/graphics.service';



@Component({
	selector: 'jobs-page',
	templateUrl: './jobs-page.component.html',
	styleUrls: ['./jobs-page.component.scss']
})
export class JobsPageComponent implements OnInit, OnDestroy {
	
	statusContract = 'none';
	// selectedContract: {
	// 	name: string,
	// 	id: string
	// };
	ind = 0;
	first = 1;
	second = 2;
	third = 3;
	fourth = 4;
	fifth = 5;
	sixth = 6;
	seventh = 7;
	eighth = 8;
	ninth = 9;

	sortBy = 1;
	private _allOffers: Array < any > ;
	offers = new Array();

	separatedOffers = new Array();

	clientRecruiters = new Array();

	filters = new Array();

	filteredJobsOptions: Observable < any[] > ;
	jobSearchControl = new FormControl();

	filteredSkillsOptions: Observable < any[] > ;
	skillSearchControl = new FormControl();
	skillsArray = new Array();

	filteredRecruitersOptions: Observable < any[] > ;
	recruiterSearchControl = new FormControl();

	filteredRolesOptions: Observable < any[] > ;
	roleSearchControl = new FormControl();
	rolesArray = new Array();

	contractStatus = ContractStatus.active;
	isDataLoaded: number;

	constructor(
		private _jobsPageService: JobsPageService,
		private _jobDetailsService: JobDetailsService,
		private _parse: Parse,
		private _filters: FiltersService,
		private _graphicService: GraphicsService
	) {
		this._graphicService.getRoles().then(result => {
			this.rolesArray = result;
		});
		this._graphicService.getClientRecruiters().then(result => {
			this.clientRecruiters = result;
		});
		this._graphicService.getSkillsForError().then(results => {
			this.skillsArray = results;
		});
	}

	ngOnInit() {
		this.filters = this._filters.getFilters();
		if (localStorage.getItem('pending')) {
			this.contractStatus = ContractStatus.pending;
			this.statusContract = 'pending';
		}
		this.filteredJobsOptions = this.jobSearchControl.valueChanges
			.startWith(null)
			.map(job => {
				if (job && job !== '') {
					return job ? this.filterJobs(job) : this.offers.slice();
				}
			});

		this.filteredRecruitersOptions = this.recruiterSearchControl.valueChanges
			.startWith(null)
			.map(recr => {
				if (recr && recr !== '') {
					return recr ? this.filterRecruiters(recr) : this.clientRecruiters.slice();
				}
			});
		this.filteredSkillsOptions = this.skillSearchControl.valueChanges
			.startWith(null)
			.map(skill => {
				if (skill && skill !== '') {
					return skill ? this.filteredSkills(skill) : this.skillsArray.slice();
				}
			});
		this.filteredRolesOptions = this.roleSearchControl.valueChanges
			.startWith(null)
			.map(role => {
				if (role && role !== '') {
					return role ? this.filteredRoles(role) : this.rolesArray.slice();
				}
			});
		this.updateContracts();
		
	}

	private clearButton(val) {
		if (val === 1) {
			this.jobSearchControl.reset();
		} else if (val === 2) {
			this.skillSearchControl.reset();
		} else if (val === 3) {
			this.recruiterSearchControl.reset();
		} else if (val === 4) {
			this.roleSearchControl.reset();
		}
		this.updateContracts();
	}
	selectJobsFilters(event) {
		if (event.target != null && (event.target.textContent !== undefined ||  event.target !== undefined)) {
			this.updateContracts();
		}
		event.preventDefault();
	}
	private selectJobsByRecruiterFilter(event) {
		if (event.target != null && (event.target.textContent !== undefined ||  event.target !== undefined)) {
			this.filters = new Array();
			this.filters.push(JobsToShow.companyJobs);
			this.filters.push(JobsToShow.myJobs);
			this._filters.updateFilters(this.filters);
			this.updateContracts();
		}
		event.preventDefault();
	}

	test() {
		console.log(this.contractStatus);
	}
	private changePage(val: number) {
		if (val > this.ind) {
			const diff = val - this.ind;
			for (let i = 0; i < diff; i++) {
				this.increaseIndex();
			}
		} else if (val < this.ind) {
			const diff = this.ind - val;
			for (let i = 0; i < diff; i++) {
				this.decreaseIndex();
			}
		}
	}
	decreaseIndex() {
		if (this.ind > 0) {
			this.ind--;
			if (this.ind > 4 && (this.ind + 5) < (this.separatedOffers.length - 1)) {
				this.decreaseAll();
			}
		}
	}
	increaseIndex() {
		if (this.ind < (this.separatedOffers.length - 1)) {
			this.ind++;
			if (this.ind > 5 && (this.ind + 4) < (this.separatedOffers.length - 1)) {
				this.increaseAll();
			}
		}
	}
	filterJobs(val: string) {
		return this.offers.filter(contract => {
			if (contract.get('title')) {
				if (contract.get('title').toLowerCase().indexOf(val.toLowerCase()) >= 0) {
					return contract;
				}
			}
		});
	}
	filterRecruiters(val: string) {
		return this.clientRecruiters.filter(recruiter => recruiter.name.toLowerCase().indexOf(val.toLowerCase()) >= 0);
	}
	filteredSkills(val: string) {
		return this.skillsArray.filter(skill => skill.toLowerCase().indexOf(val.toLowerCase()) >= 0);
	}
	filteredRoles(val: string) {
		return this.rolesArray.filter(role => role.toLowerCase().indexOf(val.toLowerCase()) >= 0);
	}
	updateContracts(isTitle ? , isSkill ? , isRole ? , isRecruiter ? ) {
		isTitle = this.jobSearchControl.value;
		isRole = this.roleSearchControl.value;
		isSkill = this.skillSearchControl.value;
		isRecruiter = this.recruiterSearchControl.value;
		this.ind = 0;
		this.freshAll();
		this.isDataLoaded = Loading.loading;
		if (this.filters.length === 1 && this.filters.indexOf(JobsToShow.myJobs) === 0) {
			this.recruiterSearchControl.reset();
		}
		if (this.contractStatus ) {
			this._jobsPageService.getContracts(this.contractStatus).then(contracts => {
				this.separatedOffers = new Array();
				this._allOffers = contracts;
				this.offers = contracts;
				this.filterOffers();
				this.applySearchFilters(isTitle, isSkill, isRole, isRecruiter);
				let compareValue = '';
				switch (this.contractStatus) {
					case ContractStatus.active:
					compareValue = 'postedAt';
					break;
					case ContractStatus.archived:
					compareValue = 'updatedAt';
					break;
					case ContractStatus.draft:
					compareValue = 'createdAt';
					break;
					default:
					compareValue = 'createdAt';
					break;
				}
				this.offers.sort((a, b) => {
					return (a.get('createdAt').getTime() - b.get('createdAt').getTime());
				});
				const copy = this.offers.slice(0);
				while (copy.length > 0) {
					let count = 0;
					const onePageArray = new Array();
					while (count < 5 && copy.length > 0) {
						onePageArray.push(copy.pop());
						count++;
					}
					this.separatedOffers.push(onePageArray);
				}
				if (this.offers && this.offers.length > 0) {
					this.isDataLoaded = Loading.success;
				} else {
					this.isDataLoaded = Loading.error;
				}
			}, error => {
				console.error(error);
				this.isDataLoaded = Loading.error;
			});
		};
		if (this.contractStatus === 4) {
			localStorage.removeItem('pending');
		}
	}
	applySearchFilters(isTitle ? , isSkill ? , isRole ? , isRecruiter ? ) {
		if (isTitle && isTitle.length > 0) {
			this.offers = this.offers.filter(job =>
				job.get('title').toLowerCase().indexOf(isTitle.toLowerCase()) >= 0);
		}
		if (isSkill && isSkill.length > 0) {
			this.offers = this.offers.filter(contract => {
				let flag = false;
				contract.get('programingSkills').forEach(jobSkill => {
					if (jobSkill.get('skill').get('title').toLowerCase().indexOf(isSkill.toLowerCase()) >= 0) {
						flag = true;
					}
				});
				return flag;
			});
		}
		if (isRole && isRole.length > 0) {
			this.offers = this.offers.filter(contract => {
				let result = false;
				if (contract.get('roles') && contract.get('roles').length > 0) {
					contract.get('roles').forEach(contractRole => {
						if (contractRole.get('title').toLowerCase().indexOf(isRole.toLowerCase()) >= 0) {
							result = true;
						}
					});
				}
				return result;
			});
		}
		if (isRecruiter && isRecruiter.length > 0) {
			const ownerFirstName = isRecruiter.split(' ')[0];
			const ownerLastName = isRecruiter.split(' ')[1];
			this.offers = this.offers.filter(job => {
				const jobOwner = job.get('owner');
				if (jobOwner.get('firstName') ===  ownerFirstName && jobOwner.get('lastName') === ownerLastName) {
					return job;
				}
			});
		}
	}
	filterOffers() {
		this.offers = new Array();
		this.filters.forEach(filterType => {
			if (filterType === JobsToShow.myJobs) {
				this.offers = this.offers.concat(this.getMyJobs());
			}
			if (filterType === JobsToShow.companyJobs) {
				this.offers = this.offers.concat(this.getCompanyJobs());
			}
		});
	}
	private getMyJobs() {
		return this._allOffers.filter(offer => {
			if (offer.get('owner') && offer.get('owner').id === this._parse.Parse.User.current().id) {
				return true;
			}
		});
	}
	private getCompanyJobs() {
		return this._allOffers.filter(offer => {
			if (offer.get('owner') &&
			(this._parse.Parse.User.current().get('Client_Pointer').id === offer.get('Client').id &&
			this._parse.Parse.User.current().id !== offer.get('owner').id)) {
				return true;
			}
		});
	}
	removeContractFromList(contractId) {
		const contractToBeDeleted = this.offers.find(contract => {
			return contract.id === contractId;
		});
		setTimeout(() => {
			this.offers.splice(this.offers.indexOf(contractToBeDeleted), 1);
			if (this.offers.length === 0) {
				this.isDataLoaded = Loading.error;
			} else {
				this.separatedOffers = new Array();
				const copy = this.offers.slice(0);
				while (copy.length > 0) {
					let count = 0;
					const onePageArray = new Array();
					while (count < 5 && copy.length > 0) {
						onePageArray.push(copy.pop());
						count++;
					}
					this.separatedOffers.push(onePageArray);
				}
				if (this.offers && this.offers.length > 0) {
					this.isDataLoaded = Loading.success;
				} else {
					this.isDataLoaded = Loading.error;
				}
			}
		}, 500);
	}
	removeContractFromList2(contractId) {
		const contractToBeDeleted = this.separatedOffers[this.ind].find(contract => {
			return contract.id === contractId;
		});
		setTimeout(() => {
			this.separatedOffers[this.ind].splice(this.separatedOffers[this.ind].indexOf(contractToBeDeleted), 1);
			if (this.separatedOffers[this.ind].length === 0) {
				this.isDataLoaded = Loading.error;
			}
		}, 500);
	}
	resetAllFilter() {
		this.roleSearchControl.reset();
		this.updateContracts();
	}
		// sortOffers() {
		// 	if(this.sortBy == 1)
		// 	{
		// 		this._allOffers = _.sortBy(this._allOffers, offer => {
		// 			return -offer.createdAt;
		// 		});
		// 	}
		// 	else
		// 	{
		// 		this._allOffers = this._allOffers.sort((offer1, offer2) => {
		// 			if(offer1.numOfHired > offer2.numOfHired)
		// 				return -1;
		// 			else if(offer1.numOfHired < offer2.numOfHired)
		// 				return 1;
		// 			else if(offer1.numOfHired == offer2.numOfHired)
		//
		// 				if(offer1.numOfJobOffered > offer2.numOfJobOffered)
		// 					return -1;
		// 				else if(offer1.numOfJobOffered < offer2.numOfJobOffered)
		// 					return 1;
		// 				else if(offer1.numOfJobOffered == offer2.numOfJobOffered)
		//
		// 					if(offer1.numOfF2FInterview > offer2.numOfF2FInterview)
		// 						return -1;
		// 					else if(offer1.numOfF2FInterview < offer2.numOfF2FInterview)
		// 						return 1;
		// 					else if(offer1.numOfF2FInterview == offer2.numOfF2FInterview)
		//
		// 						if(offer1.numOfPhomeInterview > offer2.numOfPhomeInterview)
		// 							return -1;
		// 						else if(offer1.numOfPhomeInterview < offer2.numOfPhomeInterview)
		// 							return 1;
		// 						else if(offer1.numOfPhomeInterview == offer2.numOfPhomeInterview)
		//
		// 							if(offer1.numOfShortlist > offer2.numOfShortlist)
		// 								return -1;
		// 							else if(offer1.numOfShortlist < offer2.numOfShortlist)
		// 								return 1;
		// 							else if(offer1.numOfShortlist == offer2.numOfShortlist)
		//
		// 								if(offer1.numOfApplied > offer2.numOfApplied)
		// 									return -1;
		// 								else if(offer1.numOfApplied < offer2.numOfApplied)
		// 									return 1;
		// 							else if(offer1.numOfApplied == offer2.numOfApplied)
		//
		// 									if(offer1.numOfReferrals > offer2.numOfReferrals)
		// 										return -1;
		// 									else if(offer1.numOfReferrals < offer2.numOfReferrals)
		// 										return 1;
		// 									else if(offer1.numOfReferrals == offer2.numOfReferrals)
		//
		// 										if(offer1.numOfSuggested > offer2.numOfSuggested)
		// 											return -1;
		// 										else if(offer1.numOfSuggested < offer2.numOfSuggested)
		// 											return 1;
		// 		});
		// 	}
		// }

		get ContractStatus() {
			return ContractStatus;
		}

		get JobsToShow() {
			return JobsToShow;
		}

		get Loading() {
			return Loading;
		}

		ngOnDestroy() {
			this._jobDetailsService = null;
			// this._profileSubscription.unsubscribe();
			this._filters.updateFilters(this.filters);
			localStorage.removeItem('activeStage');
		}
		decreaseAll() {
			this.first--;
			this.second--;
			this.third--;
			this.fourth--;
			this.fifth--;
			this.sixth--;
			this.seventh--;
			this.eighth--;
			this.ninth--;
		}
		increaseAll() {
			this.first++;
			this.second++;
			this.third++;
			this.fourth++;
			this.fifth++;
			this.sixth++;
			this.seventh++;
			this.eighth++;
			this.ninth++;
		}
		freshAll() {
			this.first = 1;
			this.second = 2;
			this.third = 3;
			this.fourth = 4;
			this.fifth = 5;
			this.sixth = 6;
			this.seventh = 7;
			this.eighth = 8;
			this.ninth = 9;
		}
	}