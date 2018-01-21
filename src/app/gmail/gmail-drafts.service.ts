import { Parse } from './../parse.service';
import { Injectable } from '@angular/core';
import { ParsePromise } from 'parse';

@Injectable()
export class GmailDraftsService {

	constructor(
		private _parse: Parse
	) { }

	createPointer(objectClass, objectID) {
		const Foo = this._parse.Parse.Object.extend(objectClass);
		const pointerToFoo = new Foo();
		pointerToFoo.id = objectID;
		return pointerToFoo;
	}

	listDrafts(gapi, userId, callback) {
		const request = gapi.client.gmail.users.drafts.list({
			'userId': userId
		});
		request.execute((resp) => {
			const drafts = resp.drafts;
			callback(drafts);
		});
	}
	getDraft(gapi, userId, draftId, callback) {
		const request = gapi.client.gmail.users.drafts.get({
			'id': draftId,
			'userId': userId
		});
		request.execute(callback);
	}
	createTemplate(template): ParsePromise {
		const firstAuthor = this.createPointer('_User', this._parse.getCurrentUser().id);
		let clientId;
		let type;
		return firstAuthor.fetch('Client_Pointer').then(fetchedAthor => {
			clientId = fetchedAthor.get('Client_Pointer').id;
		}).then(() => {
			type = this.createPointer('TemplatesType', template.typeId);
			const newTemplate = this._parse.Object('TemplatesCustomized');
			newTemplate.set('Author', firstAuthor);
			newTemplate.set('Client', this.createPointer('Clients', clientId));
			newTemplate.set('Type', type);
			newTemplate.set('Title', template.title);
			newTemplate.set('EmailBody', template.body);
			newTemplate.set('EmailSubject', template.subject);
			newTemplate.set('LastEdited', [{ user: firstAuthor.id, modDate: new Date }]);
			return newTemplate.save().then(suc => {
				return ('Template created and saved!');
			},
				err => {
					return (`We have an error : ${err}`);
				});
		});
	};
}
