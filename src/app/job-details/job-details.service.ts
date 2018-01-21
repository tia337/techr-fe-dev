import { Injectable } from '@angular/core';
import { Parse } from '../parse.service';
import { ParseObject, ParsePromise } from 'parse';
import { CandidatesService } from './candidates/candidates.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { DeveloperListType, Loading } from '../shared/utils';

@Injectable()
export class JobDetailsService {

	private _contract: ParseObject;
	private _contractId: string;
	private _suggestionsCount: number;

	private _candidatesCount: BehaviorSubject<any> = new BehaviorSubject(null);

	public movedUser: string;
	private _activeStage: BehaviorSubject<number> = new BehaviorSubject(DeveloperListType.suggested);
	private _isStagesDisabled: BehaviorSubject<number> = new BehaviorSubject(Loading.success);

	constructor(private _parse: Parse) { }

	get contract() {
		return this._contract;
	}

	set contractId(value: string) {
		this._contractId = value;
	}

	get contractId() {
		return this._contractId;
	}

	getContract(): ParsePromise {
		const contractQuery = this._parse.Query('Contract');
		contractQuery.include('jobCountry');
		contractQuery.include('salaryCurrency');
		contractQuery.include('programingSkills.skill');
		contractQuery.include('employeeReferralProgram');
		contractQuery.include('employeeReferralProgram.Type');
		return contractQuery.get(this._contractId).then(contract => {
			this._contract = contract;
			return contract;
		});
	}

	getSuggestedCandidatesCount(contractId: string) {
		// return this._parse.Parse.Cloud.run('searchSuggestionCandidates', {profileType: profileType, contractId: contractId});
		return this._parse.Parse.Cloud.run('countSuggestedCandidates', {contractId: contractId}).then(res => {
			this._suggestionsCount = res;
			console.log(res);
			return res;
		}, error => {
			console.error(error);
		});
	}

	getUserList(contract: ParseObject) {
		const userListQuery = new this._parse.Parse.Query('UserList');
		userListQuery.equalTo('contract', contract);
		userListQuery.equalTo('Client', this._parse.Parse.User.current().get('Client_Pointer'));
		return userListQuery.find();
	}

	// getUserListLive(contract: ParseObject) {
	// 	const userListQuery = new this._parse.Parse.Query('UserList');
	// 	userListQuery.equalTo('contract', contract);
	// 	userListQuery.equalTo('Client', this._parse.Parse.User.current().get('Client_Pointer'));
	// 	return userListQuery.subscribe();
	// }

	getCurrentUser() {
		const userQuery = new this._parse.Parse.Query('_User');
		userQuery.include('partner');
		userQuery.include('recruiter');
		return userQuery.get(this._parse.getCurrentUser().id);
	}

	getReferralsCount(contract: ParseObject) {
		const referralsCount = new this._parse.Parse.Query('EmployeeReferrals');
		referralsCount.equalTo('contract', contract);
		referralsCount.equalTo('Client', this._parse.Parse.User.current().get('Client_Pointer'));

		const userQuery = new this._parse.Parse.Query(this._parse.Parse.User);
		userQuery.exists('developer');
		referralsCount.matchesQuery('candidate', userQuery);

		return referralsCount.count();
	}

	set activeStage(value: any) {
		this._activeStage.next(value);
	}

	get activeStage() {
		return this._activeStage;
	}

	get suggestionsCount() {
		return this._suggestionsCount;
	}

	set suggestionsCount(value: number) {
		this._suggestionsCount = value;
	}

	set isStagesDisabled(value: any) {
		this._isStagesDisabled.next(value);
	}

	get isStagesDisabled() {
		return this._isStagesDisabled;
	}

	get candidatesCount() {
		return this._candidatesCount;
	}

	set candidatesCount(value: any) {
		this._candidatesCount.next(value);
	}

}
