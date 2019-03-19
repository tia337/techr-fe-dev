import { Injectable } from '@angular/core';
import { Parse } from '../parse.service';
import { BehaviorSubject } from 'rxjs';
import { ScorecardStatus } from '../shared/utils';

@Injectable()
export class ScorecardsService {

	private _type: BehaviorSubject<number> = new BehaviorSubject(0);
	// private _type: number;
	private _questions: BehaviorSubject<any> = new BehaviorSubject(null);
	// private _questions: any;

	private _activeStage: BehaviorSubject<number> = new BehaviorSubject(0);

	constructor(private _parse: Parse) {}


	createScorecard(): any {
		if (this._type && this._questions) {
			const author = this._parse.getCurrentUser();
			const client = this._parse.getCurrentUser().get('Client_Pointer');
			const clientName = this._parse.getCurrentUser().get('Client');

			const scorecard = this._parse.Object('Scorecards');
			scorecard.set('Scorecard_type', this._type.value);
			scorecard.set('Author', author);
			scorecard.set('Status', 1);
			scorecard.set('Client', client);
			scorecard.set('Client_Name', clientName);
			scorecard.set('ScorecardTitle', this._questions.value.role);
			return scorecard.save().then(scorecardObj => {
				const areasObjects = [];
				this._questions.value.questions.forEach((questionGroup, index) => {
					const scorecardArea = this._parse.Object('ScorecardAreas');
					scorecardArea.set('Scorecard', scorecardObj);
					scorecardArea.set('Author', author);
					scorecardArea.set('Client', client);
					scorecardArea.set('isDeleted', false);
					scorecardArea.set('ClientName', clientName);
					scorecardArea.set('AreaTitle', questionGroup.area);
					scorecardArea.set('order', index);
					areasObjects.push(scorecardArea);
					// areasObjects.push(scorecardArea.save());
				});
				console.log('some stage');
				return this._parse.Parse.Object.saveAll(areasObjects);
				// return this._parse.Parse.Promise.when(areasObjects);
			}).then(areas => {
				const questionsObjects = [];
				areas.map(area => {
					const questionGroup = this._questions.value.questions.find( areaForm => {
						return areaForm.area === area.get('AreaTitle');
					});
					questionGroup.questions.forEach((questionObj, index) => {
						const question = this._parse.Object('ScorecardQuestions');
						question.set('Scorecard', scorecard);
						question.set('Question', questionObj.content);
						question.set('Author', author);
						question.set('Client', client);
						question.set('isDeleted', false);
						question.set('ScorecardArea', area);
						question.set('Client_Name', clientName);
						question.set('order', index);

						questionsObjects.push(question.save());
					});
				});
				return this._parse.Parse.Object.saveAll(questionsObjects);
				// return this._parse.Parse.Promise.when(questionsObjects);
			}).then(() => {
				console.log('final stage');
				return scorecard;
			});
		}
	}

	getScorecard(id: string): any {
		const scorecardQuestionsObj: any = {
			role: '',
			questions: []
		};

		const scorecard = this._parse.Query('Scorecards');
		// scorecard.equalTo('Author', this._parse.getCurrentUser());
		scorecard.notEqualTo('Status', 2);
		return scorecard.get(id).then(scorecardObj => {
			// this._type = scorecardObj.get('Scorecard_type');  //!!!!!!!!!!!!!!!
			scorecardQuestionsObj.role = scorecardObj.get('ScorecardTitle');
			const scorecardsAreas = this._parse.Query('ScorecardAreas');
			scorecardsAreas.equalTo('Scorecard', scorecardObj);
			scorecardsAreas.notEqualTo('isDeleted', true);
			scorecardsAreas.ascending('order');
			return scorecardsAreas.find().then(scorecardAreas => {
				scorecardAreas.forEach(scorecardArea => {

					const areaObj = {
						area: scorecardArea.get('AreaTitle'),
						questions: []
					};

					const areaQuestions = this._parse.Query('ScorecardQuestions');
					areaQuestions.equalTo('Scorecard', scorecardObj);
					areaQuestions.notEqualTo('isDeleted', true);
					// areaQuestions.descending('order');
					areaQuestions.ascending('order');
					// areaQuestions.equalTo('Author', this._parse.getCurrentUser());
					areaQuestions.equalTo('ScorecardArea', scorecardArea);
					areaQuestions.find().then(questions => {
						// questions.forEach(question => {
						//   areaObj.questions.push({content: question.get('Question')});
						// });
						areaObj.questions = questions.map(question => {
							return {content: question.get('Question')};
						});


					});
					scorecardQuestionsObj.questions.push(areaObj);
				});
			})
				.then(() => {
					return {type: scorecardObj.get('Scorecard_type'), questionsObj: scorecardQuestionsObj, author: scorecardObj.get('Author')};
				});

		});
	}

	getScorecards(): any {
		const currentUser = this._parse.Query('User');
		currentUser.include('Client_Pointer');
		return currentUser.get(this._parse.getCurrentUser().id).then(me => {
			const scorecards = this._parse.Query('Scorecards');

			scorecards.equalTo('Client', me.get('Client_Pointer'));
			scorecards.notEqualTo('Status', 2);
			scorecards.include('Author');
			scorecards.descending('createdAt');
			return scorecards.find();
		});
	}

	me() {
		return this._parse.Parse.User.current();
	}

	archiveScorecard(scorecard: any): any {
		scorecard.set('Status', ScorecardStatus.archived);
		return scorecard.save();
	}

	activateScorecard(scorecard: any): any {
		scorecard.set('Status', ScorecardStatus.active);
		return scorecard.save();
	}

	deleteScorecard(scorecard: any): any {
		scorecard.set('Status', ScorecardStatus.deleted);
		return scorecard.save();
	}

	get type(): any {
		return this._type;
	}

	set type(type: any) {
		if (type !== null && type !== undefined) {
			this._type.next(type);
		} else {
			this._type.next(0);
		}
	}

	get questions(): any {
		return this._questions;
	}

	// private removeEmptyQuestions(questions: any): any {
	//
	//   const unfilteredQuestions = questions;
	//
	//   unfilteredQuestions.questions.forEach(area => {
	//     area.questions = area.questions.filter(question => {
	//       return question.content.length > 0;
	//     })
	//   });
	//
	//   return unfilteredQuestions;
	// }

	set questions(questions: any) {
		if (questions && questions.questions) {
			questions.questions.forEach(area => {
				area.questions = area.questions.filter(question => {
					return question.content.length > 0;
				});
			});
		}
		this._questions.next(questions);
	}

	get activeStage(): BehaviorSubject<number> {
		return this._activeStage;
	}

	setActiveStage(stage: number) {
		this._activeStage.next(stage);
	}

}
