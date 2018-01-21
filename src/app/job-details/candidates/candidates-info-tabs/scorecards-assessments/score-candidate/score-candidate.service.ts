import { Injectable } from '@angular/core';
import { ParseObject, ParsePromise } from 'parse';
import { Parse } from '../../../../../parse.service';
import { IScoringOptions } from './score-candidate.interface';

@Injectable()
export class ScoreCandidateService {

	constructor(private _parse: Parse) {}

	getScorecardAreas(scorecard: ParseObject): ParsePromise {
		const areasQuery = new this._parse.Parse.Query('ScorecardAreas');
		areasQuery.equalTo('Scorecard', scorecard);
		areasQuery.notEqualTo('isDeleted', true);
		areasQuery.ascending('order');
		return areasQuery.find();
	}

	getScorecardQuestions(scorecard: ParseObject): ParsePromise {
		const questionsQuery = new this._parse.Parse.Query('ScorecardQuestions');
		questionsQuery.equalTo('Scorecard', scorecard);
		questionsQuery.notEqualTo('isDeleted', true);
		questionsQuery.ascending('order');
		// questionsQuery.equalTo('ScorecardArea', area);
		return questionsQuery.find();
	}


	scoreCandidate(options: IScoringOptions) {
		const userQuery = new this._parse.Parse.Query(this._parse.Parse.User);
		userQuery.include('Client_Pointer');
		return userQuery.get(this._parse.Parse.User.current().id).then(currentUser => {
			console.log(currentUser);
			// const currentUser = this._parse.Parse.User.current();

			let weightedScore;

			const scoringPromises = [];

			if (options.ScorecardWeightedScore) {
				weightedScore = options.ScorecardWeightedScore;
			} else {
				weightedScore = new this._parse.Parse.Object('ScorecardWeightedScore');
			}

			weightedScore.set('Scorecard', options.scorecard);
			weightedScore.set('Candidate', options.candidate);
			weightedScore.set('FinalVerdictNotes', options.verdict);
			weightedScore.set('WeightedScore', options.weightedScore);
			weightedScore.set('Author', currentUser);
			weightedScore.set('Client', currentUser.get('Client_Pointer'));
			weightedScore.set('TaggedColleagues', options.taggedUsers);
			weightedScore.set('Job', options.contract);
			weightedScore.set('ClientName', currentUser.get('Client_Pointer').get('ClientName'));
			weightedScore.set('FinalVerdict', options.finalMark);

			scoringPromises.push(weightedScore.save());

			const areas = [];
			options.areas.forEach(area => {
				let areaScoring;
				if (area.parseObj) {
					areaScoring = area.parseObj
				} else {
					areaScoring = new this._parse.Parse.Object('ScorecardAreaScoring');
				}

				areaScoring.set('Candidate', options.candidate);
				areaScoring.set('ScoringJob', options.contract);
				areaScoring.set('ScoringAuthor', currentUser);
				areaScoring.set('Scoring', area.rating.value);
				areaScoring.set('ScorecardArea', area.area);

				console.log('areaScoring: ', areaScoring);
				areas.push(areaScoring);
			});
			scoringPromises.push(this._parse.Parse.Object.saveAll(areas));

			const questions = [];
			options.questions.forEach(question => {

				let questionNotes;

				if (question.parseObj) {
					questionNotes = question.parseObj;
				} else {
					questionNotes = new this._parse.Parse.Object('ScorecardQuestionNotes');
				}

				questionNotes.set('Scorecard', options.scorecard);
				questionNotes.set('Author', currentUser);
				questionNotes.set('Client', currentUser.get('Client_Pointer'));
				questionNotes.set('ClientName', currentUser.get('Client_Pointer').get('ClientName'));
				questionNotes.set('Candidate', options.candidate);
				questionNotes.set('Question', question.question);
				questionNotes.set('QuestionNote', question.note.value);
				questionNotes.set('contract', options.contract);
				questionNotes.set('ScorecardArea', question.question.get('ScorecardArea'));

				console.log('questionNotes: ', questionNotes);
				questions.push(questionNotes);
			});
			scoringPromises.push(this._parse.Parse.Object.saveAll(questions));

			console.log('promises: ', scoringPromises);

			return this._parse.Parse.Promise.when(scoringPromises);

		}, error => {
			console.error(error);
		});

	}

	getTeamMembers() {
		const userQuery = new this._parse.Parse.Query(this._parse.Parse.User);
		userQuery.include('Client_Pointer');
		return userQuery.get(this._parse.Parse.User.current().id).then(me => {
			return this._parse.Parse.Object.fetchAllIfNeeded(me.get('Client_Pointer').get('TeamMembers'));
		});
	}

	getScorecardWeightedScores(candidate: ParseObject, contract: ParseObject, scorecard: ParseObject) {
		const weightedScoreQuery = new this._parse.Parse.Query('ScorecardWeightedScore');
		weightedScoreQuery.equalTo('Scorecard', scorecard);
		weightedScoreQuery.equalTo('Candidate', candidate);
		weightedScoreQuery.equalTo('Job', contract);
		weightedScoreQuery.equalTo('Author', this._parse.Parse.User.current());
		return weightedScoreQuery.first();
	}

	getScorecardQuestionNotes(candidate: ParseObject, contract: ParseObject, scorecardQuestions: Array<ParseObject>) {
		const questionNoteQuery = new this._parse.Parse.Query('ScorecardQuestionNotes');
		questionNoteQuery.equalTo('Candidate', candidate);
		questionNoteQuery.equalTo('contract', contract);
		questionNoteQuery.equalTo('Author', this._parse.Parse.User.current());
		questionNoteQuery.containedIn('Question', scorecardQuestions);
		return questionNoteQuery.find();
	}

	getScorecardAreaScoring(candidate: ParseObject, contract: ParseObject, scorecardAreas: Array<ParseObject>) {
		const areaScoringQuery = new this._parse.Parse.Query('ScorecardAreaScoring');
		areaScoringQuery.equalTo('Candidate', candidate);
		areaScoringQuery.equalTo('ScoringJob', contract);
		areaScoringQuery.equalTo('ScoringAuthor', this._parse.Parse.User.current());
		areaScoringQuery.containedIn('ScorecardArea', scorecardAreas);
		return areaScoringQuery.find();
	}

	// export interface IScoringOptions {
	//   scorecard: ParseObject;
	//   candidate: ParseUser;
	//   verdict: string;
	//   weightedScore: number;
	//   finalMark: number;
	//   contract: ParseObject;
	//   questions: Array<IQuestionObject>;
	//   areas: Array<IAreaObject>;
	// }
	//
	// interface IQuestionObject {
	//   question: ParseObject;
	//   note: FormControl;
	// }
	//
	// interface IAreaObject {
	//   area: ParseObject;
	//   rating: FormControl;
	// }

}
