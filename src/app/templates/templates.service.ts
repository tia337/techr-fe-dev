import { Parse } from './../parse.service';
import { Injectable } from '@angular/core';
import { ParsePromise, ParseObject } from 'parse';
@Injectable()
export class TemplatesService {

	constructor(
		private _parse: Parse
	) { };



	createPointer(objectClass, objectID) {
		const Foo = this._parse.Parse.Object.extend(objectClass);
		const pointerToFoo = new Foo();
		pointerToFoo.id = objectID;
		return pointerToFoo;
	}

	getTemplateTypes(): ParsePromise {
		let types = [];
		const query = this._parse.Query('TemplatesType');
		query.exists('Name');
		return query.find().then(foundTypes => {
			foundTypes.forEach(foundType => {
				if (!types.includes(foundType)) {
					types.push(foundType);
				};
			});
			return types;
		});
	};

	getStandardTemplates(): ParsePromise {
		let templates = [];
		const query = this._parse.Query('TemplatesStandard');
		query.include('Type');
		return query.find().then(foundTempaltes => {
			templates = foundTempaltes;
			return templates;
		});
	};

	getCustomTemplates(): ParsePromise {
		const author = this.createPointer('_User', this._parse.getCurrentUser().id);
		let clientId;
		return author.fetch('Client_Pointer').then(fetchedAthor => {
			clientId = fetchedAthor.get('Client_Pointer').id;
		}).then(() => {
			let templates = [];
			const query = this._parse.Query('TemplatesCustomized');
			query.equalTo('Client', this.createPointer('Clients', clientId));
			query.notEqualTo('isDeleted', true);
			query.include('Type');
			query.include('Author');
			return query.find().then(foundTempaltes => {
				templates = foundTempaltes;
				return templates;
			});
		});
	};

	createCustomTemplate(template): ParsePromise {
		const firstAuthor = this.createPointer('_User', this._parse.getCurrentUser().id);
		let clientId;
		let type;
		return firstAuthor.fetch('Client_Pointer').then(fetchedAthor => {
			clientId = fetchedAthor.get('Client_Pointer').id;
		}).then(() => {
			if (template.id) {
				type = template.get('Type');
			} else {
				type = this.createPointer('TemplatesType', template.typeId);
			}
			const newTemplate = this._parse.Object('TemplatesCustomized');
			console.log(newTemplate);
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

	updateCustomTemplate(template: ParseObject): ParsePromise {
		const redactor = this.createPointer('_User', this._parse.getCurrentUser().id);
		const query = this._parse.Query('TemplatesCustomized');
		let redactingHistory = template.get('LastEdited');
		redactingHistory.push({ user: redactor.id, modDate: new Date });
		return query.get(template.id).then(newTemplate => {
			newTemplate.set('Title', template.title);
			newTemplate.set('EmailBody', template.body);
			newTemplate.set('EmailSubject', template.subject);
			newTemplate.set('LastEdited', redactingHistory);
			return newTemplate.save().then(suc => {
				return ('Template saved!');
			},
				err => {
					return (`We have an error : ${err}`);
				});
		});
	};

	getCompanyName(): ParsePromise {
		const query = this._parse.Query('User');
		return query.get(this._parse.getCurrentUser().id).then(user => {
			return user.get('Client');
		});
	};

	getLastModifier(template: ParseObject): ParsePromise {
		let lastMod = {
			date: Date,
			author: ''
		};
		const modifications = template.get('LastEdited');
		if (modifications && modifications[0]) {
			modifications.sort(function compare(a, b) {
				const dateA = (a.modDate);
				const dateB = (b.modDate);
				return dateB.getTime() - dateA.getTime();
			});
			lastMod.date = modifications[0].modDate;
			const query = this._parse.Query('User');
			return query.get(modifications[0].user).then(author => {
				lastMod.author = `${author.get('firstName')} ${author.get('lastName')}`;
				return lastMod;
			});
		}
	}

	removeTemplate(tempId): ParsePromise {
		const query = this._parse.Query('TemplatesCustomized');
		return query.get(tempId).then(temp => {
			temp.set('isDeleted', true);
			return temp.save({
				success: suc => {
					return `Succesfully deleted`;
				},
				error: err => {
					return `Something went wrong. Not deleted!`;
				}
			});
		});
	}
}
