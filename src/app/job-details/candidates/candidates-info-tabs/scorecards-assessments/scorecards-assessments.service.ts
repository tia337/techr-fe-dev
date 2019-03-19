import { Injectable } from '@angular/core';
import { Parse } from '../../../../parse.service';
import * as _ from 'underscore';

@Injectable()
export class ScorecardsAssessmentsService {

	constructor(private _parse: Parse) { }

	getCandidate(id: string): any {
		// console.log(id);
		const user = new this._parse.Parse.Query('User');
		return user.get(id).then(parseUser => {
			return parseUser;
		});
	}

	getCompanyScorecards() {
		const scorecards = new this._parse.Parse.Query('Scorecards');
		scorecards.equalTo('Status', 1);
		scorecards.equalTo('Client', this._parse.Parse.User.current().get('Client_Pointer'));
		return scorecards.find().then(parseScorecards => {
			return parseScorecards;
		});
	}

	getContract(id: string): any {
		const contract = new this._parse.Parse.Query('Contract');
		return contract.get(id).then(parseContract => {
			return parseContract;
		});
	}

	attachScorecard(candidate: any, scorecard: any, contract: any): any {
		const currentUser = this._parse.Parse.User.current();
		const scorecardRelationship = new this._parse.Parse.Object('ScorecardRelationship');
		scorecardRelationship.set('Linking_Author', currentUser);
		scorecardRelationship.set('Scorecard', scorecard);
		scorecardRelationship.set('Candidate', candidate);
		scorecardRelationship.set('Client', currentUser.get('Client_Pointer'));
		scorecardRelationship.set('Job', contract);
		scorecardRelationship.set('Client_Name', currentUser.get('Client'));
		scorecardRelationship.set('isDeleted', false);
		return scorecardRelationship.save();
	}

	getAttachedScorecards(candidate: any, contract: any): any {
		const scorecardRelationship = new this._parse.Parse.Query('ScorecardRelationship');
		scorecardRelationship.equalTo('Job', contract);
		scorecardRelationship.equalTo('Candidate', candidate);
		scorecardRelationship.notEqualTo('isDeleted', true);
		scorecardRelationship.equalTo('Client', this._parse.Parse.User.current().get('Client_Pointer'));
		scorecardRelationship.include('Scorecard');
		scorecardRelationship.select('Scorecard');
		return scorecardRelationship.find();
	}

	removeAttachedScorecard(scorecardRelationship: any): any {
		scorecardRelationship.set('isDeleted', true);
		return scorecardRelationship.save();
	}

	getWeightedScores(candidate, contract) {
		const scorecardWeightedScore = new this._parse.Parse.Query('ScorecardWeightedScore');
		//scorecardWeightedScore.equalTo('Scorecard', scorecard);
		scorecardWeightedScore.equalTo('Candidate', candidate);
		scorecardWeightedScore.equalTo('Author', this._parse.Parse.User.current());
		scorecardWeightedScore.equalTo('Job', contract);
		return scorecardWeightedScore.find();
	}

}
