import { Injectable } from '@angular/core';

import { Parse } from './../../../../parse.service';

@Injectable()
export class CandidateChatService {

	constructor(private _parse: Parse) { }

	createPointer(objectClass, objectID) {
		const Foo = this._parse.Parse.Object.extend(objectClass);
		const pointerToFoo = new Foo();
		pointerToFoo.id = objectID;
		return pointerToFoo;
	}
	getContractOwner(contractId: string): any {
		const owner = this._parse.Query('Contract');
		owner.include('owner');
		return owner.get(contractId).then((contract: any) => {
			return (contract.get('owner'));
		});
	}
	getCandidate(userId: string): any {
		const user = this._parse.Query('User');
		user.include('voted_user_ids');
		return user.get(userId).then((user: any) => {
			return user;
		});
	}
	getMessage(messageId: string): any {
		const message = this._parse.Query('Message');
		message.include('author');
		message.include('documentCV');
		return message.get(messageId).then((msg: any) => {
			return msg;
		});
	}
	setIsReaded(messageId: string) {
		const message = this._parse.Query('Message');
		message.get(messageId).then((msg) => {
			msg.save({ 'isReaded': true });
		});
	}
	getDialogForContract(user1Id: string, user2Id: string, contractId: string): any {
		const user1Pointer = this.createPointer('_User', user1Id);
		const user2Pointer = this.createPointer('_User', user2Id);
		const contractPointer = this.createPointer('Contract', contractId);
		const query = this._parse.Query('Dialog');
		console.log('user1Pointer', user1Pointer);
		console.log('user2Pointer', user2Pointer);
		console.log('contractPointer', contractPointer);
		query.containedIn('userFirst', [user1Pointer, user2Pointer]);
		query.containedIn('userSecond', [user1Pointer, user2Pointer]);
		query.containedIn('Job', [contractPointer]);
		return (query.first().then((dialog) => {
			console.log('dialog', dialog);

			return (dialog);
		}));
	}
	createDialog(user1Id: string, user2Id: string, contractId: string): any {
		const user1Pointer = this.createPointer('_User', user1Id);
		const user2Pointer = this.createPointer('_User', user2Id);
		const contractPointer = this.createPointer('Contract', contractId);

		const newDialog = this._parse.Object('Dialog');
		newDialog.set('userFirst', user1Pointer);
		newDialog.set('userSecond', user2Pointer);
		newDialog.set('Job', contractPointer);
		return newDialog.save().then(savedDialog => {
			const query = this._parse.Query('Dialog');
			query.equalTo('objectId', savedDialog.id);
			return query.first().then(dialog => {
				return (dialog);
			});
		});
	}
	createCVFile(file: File, filename: string): any {
		const newAttachedFile = this._parse.Object('CVFile');
		newAttachedFile.set('documentFile', file);
		newAttachedFile.set('fileName', filename);

		return newAttachedFile.save().then(savedCV => {
			const query = this._parse.Query('CVFile');
			query.equalTo('objectId', savedCV.id);
			return query.first().then(CV => {
				return (CV);
			});
		});
	}
	getDialogHistory(options, user) {
		const lastMessageDate = options.lastMessageDate;
		const dialogID = options.dialogID;
		const isNeedOldMessages = (options.typeMessages === 'old');

		const query = this._parse.Query('Message');
		query.equalTo('dialog', this.createPointer('Dialog', dialogID));
		query.descending('createdAt');
		if (isNeedOldMessages) {
			query.lessThanOrEqualTo('createdAt', lastMessageDate);
			query.limit(1000);
		} else {
			query.greaterThan('createdAt', lastMessageDate);
		};
		query.include('documentCV');
		return query.find().then(messages => {
			const data = [];
			for (let i = 0; i < messages.length; i++) {
				const messageC = messages[i];
				data[i] = {
					dialog: messageC.get('dialog'),
					message: messageC.get('message'),
					author: messageC.get('author'),
					createdAt: messageC.get('createdAt').toISOString(),
					updatedAt: messageC.get('updatedAt').toISOString(),
					objectId: messageC.id,
					threadId: messageC.get('gmailThreadId')
				};
				data[i].author.objectId = data[i].author.id;
				if (messageC.get('documentCV')) {
					data[i].documentCV = messageC.get('documentCV');
				}
				if (messageC.get('author').id !== user.id) {
					messageC.set('isReaded', true);
					messages[i] = messageC;
				};
			};
			this._parse.Parse.Object.saveAll(messages, {
				success: savedMessages => {
					console.log('All messages are saved successfully!');
				},
				error: error => {
					console.log(`We have an error while saving the message: ${error}`);
				}
			});
			return (data);
		});
	}

	getGmailThreadId(messages) {
		const thread = [];
		messages.forEach(element => {
			if (element['threadId'] && !thread.includes(element['threadId'])) {
				thread.push(element['threadId']);
			}
		});
		if (thread.length > 0) {
			return thread;
		} else {
			return null;
		}
	}
}
