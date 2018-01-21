import { Injectable } from '@angular/core';
import { Parse } from 'app/parse.service';

@Injectable()
export class FeedbackService {

	constructor(private _parse: Parse) { }

	getFeedbackTypes() {
		const query = this._parse.Query('UserFeedbackType');
		return query.find();
	}
	saveUserFeedbacks(typeId, text) {
		const newFeedback = this._parse.Object('UserFeedback');
		newFeedback.set('user', this.createPointer('_User', this._parse.Parse.User.current().id));
		newFeedback.set('feedbackText', text);
		newFeedback.set('type', this.createPointer('UserFeedbackType', typeId));
		newFeedback.save();
	}
	createPointer(className, id) {
		const object = this._parse.Object(className);
		object.id = id;
		return object;
	}
}
