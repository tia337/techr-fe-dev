import { Injectable } from '@angular/core';
import { Parse } from '../../../parse.service';
import { ParseUser, ParsePromise, ParseObject } from 'parse';
import { Subject } from 'rxjs';

@Injectable()
export class CandidateProfileService {

	scoreSum = 0;
	scoreCount = 0;
	verdicts = {
		definitely: 0,
		yes: 0,
		notSure: 0
	};

	public _rejectedHiring: Subject<any> = new Subject();

	constructor(private _parse: Parse) {}

	getCandidate(userId: string): any {
		const user = this._parse.Query('User');
		user.include('developer');
		user.include('developer.roles');
		return user.get(userId).then(candidateResult => {
			this.scoreSum = 0;
			this.scoreCount = 0;
			return candidateResult;
		});
	}

	getScorecardWeightedScores(contractId: string, candidate: any): any {
		let currentUser;

		return this._parse.getCurrentUser().fetch().then(me => {
			currentUser = me;
			const contractQuery = this._parse.Query('Contract');
			return contractQuery.get(contractId);
		}).then(contract => {
			const weightedScoreQuery = new this._parse.Parse.Query('ScorecardWeightedScore');
			weightedScoreQuery.equalTo('Client', currentUser.get('Client_Pointer'));
			weightedScoreQuery.equalTo('Job', contract);
			weightedScoreQuery.equalTo('Candidate', candidate);
			weightedScoreQuery.select('WeightedScore');
			weightedScoreQuery.select('FinalVerdict');
			return weightedScoreQuery.find();
		});
	}

	getUserList(id: string) {
		const userListQuery = new this._parse.Parse.Query('UserList');
		return userListQuery.get(id);
	}

	rejectedHiring(value) {
		this._rejectedHiring.next(value);
	}
}
