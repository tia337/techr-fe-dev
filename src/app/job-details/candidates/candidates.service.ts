import { Injectable } from '@angular/core';
import { Parse } from '../../parse.service';
import { ParseUser, ParsePromise, ParseObject } from 'parse';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { JobDetailsService } from '../job-details.service';
import { DeveloperListType } from '../../shared/utils';
import * as _ from 'underscore';

@Injectable()
export class CandidatesService {

	// private _contractId: BehaviorSubject<string> = new BehaviorSubject(null);
	// private _userId: BehaviorSubject<string> = new BehaviorSubject(null);

	private _contractId: string;
	// private _userId: string;
	private _userId: any = new BehaviorSubject(null);

	constructor(private _parse: Parse, private _jobDetailsService: JobDetailsService) { }

	// getSuggestedCandidates(contractId: string): ParsePromise {
	getSuggestedCandidates(contractId: string, from: number, limit: number, sortBy?:string, skillsFit?:Array<string>, countries?:Array<string>): ParsePromise {

        return this._parse.execCloud('searchSuggestionCandidates',
            {
                profileType: 2,
                contractId: contractId,
                from: from,
                limit: limit,
                sortBy: sortBy,
                skillsFit: skillsFit,
                countries: countries
            });
    }

    getDevelopersById(userIds:Array<string>): ParsePromise {

        return this._parse.execCloud('getDevelopersByUserId',
            {
                userIds: userIds
            });
    }

	getUsersForList(contractId: string, listId: number) {
		let contract;
		const constractQuery = new this._parse.Parse.Query('Contract');
		return constractQuery.get(contractId).then(parseContract => {
			contract = parseContract;
			return this._parse.Parse.Cloud.run('usersForList', {
				contractId: contractId,
				listId: listId
			});
		}).then(res => {
			// console.log('ListId: ', listId);
			// console.log('Result: ', res);
			return {
				results: res.list,
				weights: this.getPercentageMatch(res.list, contract)
			};
		});
	}

	getReferrals(contractId: string) {
		let contract;
		const constractQuery = new this._parse.Parse.Query('Contract');
		return constractQuery.get(contractId).then(parseContract => {
			contract = parseContract;
			const userQuery = new this._parse.Parse.Query(this._parse.Parse.User);
			userQuery.exists('developer');
			const referrals = new this._parse.Parse.Query('EmployeeReferrals');
			referrals.equalTo('contract', contract);
			referrals.equalTo('Client', this._parse.Parse.User.current().get('Client_Pointer'));
			referrals.matchesQuery('candidate', userQuery);
			referrals.include('candidate');
			referrals.include('candidate.developer');
			referrals.include('candidate.developer.skills');
			referrals.select('candidate');
			return referrals.find();
		}).then(referrals => {
			// console.log(referrals);
			const res = {results: [], weights: {}};
			const users = referrals.map(referral => {
				// console.log(referral.get('candidate'));
				const user = referral.get('candidate');
				user.source = './../../../assets/images/EmployeeReferralsProgram/referral.png';
				// console.log('USER: ', user);
				return (user);
			});
			// console.log(users);
			res.results = users;
			res.weights = this.getPercentageMatch(users, contract);
			return res;
		});
	}

	getAppliedCandidates(contractId: string, from?: number, limit?: number) {
		const contractQuery = new this._parse.Parse.Query('Contract');
		contractQuery.equalTo('objectId', contractId);

		const userQuery = new this._parse.Parse.Query(this._parse.Parse.User);
		userQuery.exists('developer');

		const contractApplyQuery = new this._parse.Parse.Query('ContractApply');
		contractApplyQuery.equalTo('contractId', contractId);
		contractApplyQuery.matchesQuery('contract', contractQuery);
		contractApplyQuery.matchesQuery('user', userQuery);
		contractApplyQuery.notEqualTo('isRemoved', true);
		contractApplyQuery.include('contract');

		contractApplyQuery.include('Source_JobBoard');
		contractApplyQuery.include('contract.programingSkills');
		contractApplyQuery.include('contract.programingSkills.skill');
		contractApplyQuery.include('contract.submits');

		contractApplyQuery.include('user');
		contractApplyQuery.include('user.developer');
		contractApplyQuery.include('user.developer.skills');

		if (from)
			contractApplyQuery.skip(from);

		if (limit)
			contractApplyQuery.limit(limit);

		return contractApplyQuery.find().then(contractApplies => {
			const res = {results: [], weights: {}};

			if (contractApplies && contractApplies.length > 0) {
				const contract = contractApplies[0].get('contract');
				const users = contractApplies.map(contractApply => {
					const user = contractApply.get('user');
					if (contractApply.get('Source_JobBoard')) {
						user.source = contractApply.get('Source_JobBoard').get('Logo').url();
					}
					return user;
				});
				res.results = users;
				res.weights = this.getPercentageMatch(users, contract);
			}
			// console.log(res);
			return res;
		});
	}

	test() {
		// console.log('TEST!!!: ', this._parse.Parse.User.current().get('emailVerified'));
	}

	get contractId() {
		return this._contractId;
	}

	set contractId(value: string) {
		this._contractId = value;
	}

	set userId(value) {
		// console.log('CANDIDATES SERVICE USER ID: ', value);
		this._userId.next(value);
	}

	get userId() {
		return this._userId;
	}

	// get contractId() {
	//   return this._contractId.subscribe();
	// }
	//
	// set contractId(value: string) {
	//   this._contractId.next(value);
	// }

	// getUserById(userId: string): ParsePromise {
	//   let user = this._parse.Query('User');
	//   user.get(userId).then(user => {
	//     return user;
	//   });
	// }


	private getPercentageMatch(users: Array<ParseUser>, contract: ParseObject) {

		const contractsSkills = _.groupBy(contract.get('programingSkills'), skillComponent => {
			return skillComponent.get('skill').id;
		});

		const weights = {};

		if (contract.get('programingSkills') && contract.get('programingSkills').length > 0) {
			let concutUsers = users;
			if (contract.get('submits')) {
				const submitedUsersToSkip = _.map(contract.get('submits'), submit => {
					return submit.get('developer');
				});
				concutUsers = submitedUsersToSkip.concat(users);
			}
			for (const userIndex in concutUsers) {
				const user = concutUsers[userIndex];
				const developer = user.get('developer');
				weights[developer.id] = _.map(developer.get('skills'), skillComponent => {
					if (!skillComponent.get('skill')) {
						return 0;
					}
					const skillMatch = contractsSkills[skillComponent.get('skill').id];
					if (skillMatch && skillMatch[0] && skillMatch[0].get('selectedExperienceDuration') <= skillComponent.get('selectedExperienceDuration')) {
						return 1;
					}
					return 0;
				}).reduce(function(memo, num) {
					return memo + num;
				}, 0) / contract.get('programingSkills').length * 100;

				if (!weights[developer.id]) {
					weights[developer.id] = -1;
				}
			}

			const newWeights = {};

			_.mapObject(weights, (value, weightId)  => {
				newWeights[weightId] = weights[weightId];
			});

			return newWeights;
		} else {
			return weights;
		}
	}



}
