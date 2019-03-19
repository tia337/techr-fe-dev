import { Injectable } from '@angular/core';
import { Parse } from '../../../../../parse.service';
import { ParseObject, ParsePromise } from 'parse';

@Injectable()
export class PreviewScoringService {

	constructor(private _parse: Parse) { }

	getScorecardsAreas(scorecard: any) {
		const areas = new this._parse.Parse.Query('ScorecardAreas');
		areas.equalTo('Scorecard', scorecard);
		areas.notEqualTo('isDeleted', true);
		return areas.find();
	}

	getScorecardsQuestions(scorecard: any) {
		const questions = new this._parse.Parse.Query('ScorecardQuestions');
		questions.equalTo('Scorecard', scorecard);
		questions.notEqualTo('isDeleted', true);
		return questions.find();
	}

	getScorecardsQuestionNotes(scorecardRelationship: any) {
		const scorecardsQuestionNotes = new this._parse.Parse.Query('ScorecardQuestionNotes');
		scorecardsQuestionNotes.equalTo('Scorecard', scorecardRelationship.get('Scorecard'));
		scorecardsQuestionNotes.equalTo('Author', scorecardRelationship.get('Author'));
		scorecardsQuestionNotes.equalTo('Client', this._parse.Parse.User.current().get('Client_Pointer'));
		scorecardsQuestionNotes.equalTo('Candidate', scorecardRelationship.get('Candidate'));
		scorecardsQuestionNotes.equalTo('contract', scorecardRelationship.get('Job'));
		return scorecardsQuestionNotes.find();
	}

	getScorecardAreaScorings(scorecardWeightedScore: any) {
		const scorecardAreaQuery = new this._parse.Parse.Query('ScorecardAreas');
		scorecardAreaQuery.equalTo('Scorecard', scorecardWeightedScore.get('Scorecard'));
		scorecardAreaQuery.notEqualTo('isDeleted', true);

		const scorecardAreaScorings = new this._parse.Parse.Query('ScorecardAreaScoring');
		scorecardAreaScorings.equalTo('ScoringJob', scorecardWeightedScore.get('Job'));
		scorecardAreaScorings.equalTo('Candidate', scorecardWeightedScore.get('Candidate'));
		scorecardAreaScorings.equalTo('ScoringAuthor', scorecardWeightedScore.get('Author'));
		scorecardAreaScorings.matchesQuery('ScorecardArea', scorecardAreaQuery);
		return scorecardAreaScorings.find();
	}
}
