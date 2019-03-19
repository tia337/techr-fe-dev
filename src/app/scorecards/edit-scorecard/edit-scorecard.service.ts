import { Injectable } from '@angular/core';
import { Parse } from '../../parse.service';
import { ParseObject, ParsePromise } from 'parse';

@Injectable()
export class EditScorecardService {

	private _author = this._parse.getCurrentUser();
	private _client = this._parse.getCurrentUser().get('Client_Pointer');
	private _clientName = this._parse.getCurrentUser().get('Client');

	constructor(private _parse: Parse) {}

	getScorecard(id: string): any {
		const scorecard = this._parse.Query('Scorecards');
		scorecard.equalTo('Author', this._parse.getCurrentUser());
		return scorecard.get(id);
	}

	getAreas(scorecard: any): any {
		const areas = this._parse.Query('ScorecardAreas');
		areas.equalTo('Author', this._parse.getCurrentUser());
		areas.equalTo('Scorecard', scorecard);
		// areas.descending('order');
		areas.ascending('order');
		areas.notEqualTo('isDeleted', true);
		return areas.find();
	}

	getQuestions(area: any): any {
		const questions = this._parse.Query('ScorecardQuestions');
		questions.equalTo('ScorecardArea', area);
		questions.equalTo('Scorecard', area.get('Scorecard'));
		questions.notEqualTo('isDeleted', true);
		questions.ascending('order');
		questions.equalTo('Author', this._parse.getCurrentUser());
		return questions.find();
	}

	addArea(scorecardId: string, areaTitle: string, index: number): any {
		// const scorecardQuery = new this._parse.Parse.Query('Scorecards');
		// scorecardQuery.equalTo('objectId', scorecardId);
		// let scorecardObj;
		// return this.getScorecard(scorecardId).then(scorecard => {
		// 	scorecardObj = scorecard;
		// 	const lastAreaQuery = new this._parse.Parse.Query('ScorecardAreas');
		// 	lastAreaQuery.descending('order');
		// 	lastAreaQuery.equalTo('Scorecard', scorecard);
		// 	lastAreaQuery.select('order');
		// 	return lastAreaQuery.count();

			// const newArea = this._parse.Object('ScorecardAreas');
			// newArea.set('Scorecard', scorecard);
			// newArea.set('Author', this._author);
			// newArea.set('Client', this._client);
			// newArea.set('ClientName', this._clientName);
			// newArea.set('AreaTitle', areaTitle);
			// return newArea.save();
		// }).then(count => {
			const newArea = this._parse.Object('ScorecardAreas');
			newArea.set('Scorecard', this.createPointer('Scorecards', scorecardId));
			newArea.set('Author', this._author);
			newArea.set('Client', this._client);
			newArea.set('ClientName', this._clientName);
			newArea.set('AreaTitle', areaTitle);
			newArea.set('order', index);
			return newArea.save();
			// return newArea.save();
		// });
	}

	private createPointer(objectClass, objectID) {
		const Foo = this._parse.Parse.Object.extend(objectClass);
		const pointerToFoo = new Foo();
		pointerToFoo.id = objectID;
		return pointerToFoo;
	}

	deleteArea(area: any): any {
		area.set('isDeleted', true);
		return area.save().then(area => {
			const deletedAreaQuestions = this._parse.Query('ScorecardQuestions');
			deletedAreaQuestions.equalTo('ScorecardArea', area);
			deletedAreaQuestions.equalTo('Author', this._parse.getCurrentUser());
			deletedAreaQuestions.equalTo('ScorecardArea', area);
			deletedAreaQuestions.notEqualTo('isDeleted', true);
			return deletedAreaQuestions.find().then(questions => {
				return questions.map(question => {
					this.deleteQuestion(question);
				});
			});
		});
	}

	addQuestion(area: any, question: string, order): any {
		// const lastQuestionQuery = new this._parse.Parse.Query('ScorecardQuestions');
		// lastQuestionQuery.descending('order');
		// lastQuestionQuery.equalTo('ScorecardArea', area);
		// lastQuestionQuery.count().then(count => {
			// console.log(parseQuestion);
			// let order = parseQuestion.get('order');
			const questionObject = this._parse.Object('ScorecardQuestions');
			questionObject.set('Scorecard', area.get('Scorecard'));
			questionObject.set('ScorecardArea', area);
			questionObject.set('Author', this._author);
			questionObject.set('Client', this._client);
			questionObject.set('Client_Name', this._clientName);
			questionObject.set('Question', question);
			questionObject.set('order', order);
			return questionObject.save();
		// }, error => {
		// 	console.error(error);
		// });
	}

	deleteQuestion(question: any): any {
		question.set('isDeleted', true);
		return question.save();
	}

	get author() { return this._author; }
	get client() { return this._client; }
	get clientName() { return this._clientName; }

}
