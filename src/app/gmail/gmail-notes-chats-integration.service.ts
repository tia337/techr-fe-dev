import { CandidateChatService } from './../job-details/candidates/candidates-info-tabs/candidate-chat/candidate-chat.service';
import { CandidateNotesService } from './../job-details/candidates/candidates-info-tabs/candidate-notes/candidate-notes.service';
import { Injectable } from '@angular/core';
import { Socket } from 'ng-socket-io';
import { Parse } from './../parse.service';
import { ParsePromise, ParseObject, ParseUser } from 'parse';

@Injectable()
export class GmailNotesChatsIntegrationService {

	private currUser: any = this._parse.getCurrentUser();

	constructor(
		private _chats: CandidateChatService,
		private _notes: CandidateNotesService,
		private _parse: Parse,
		private _socket: Socket
	) { }

	saveGmailToChat(email, candidateId: string, contractId: string, threadId?: string): any {
		return this._chats.getDialogForContract(this.currUser.id, candidateId, contractId).then(
			dialog => {
				const message = [`Subject: ${email.sub.value}`, `Body: ${email.body.value}`].join('\n');
				if (!dialog) {
					return this._chats.createDialog(this.currUser.id, candidateId, contractId).then(dialogObj => {
						this._socket.emit('outgoing', {
							'author': this.currUser.id,
							'message': { message: message },
							'dialog': dialogObj.id,
							'type': 'rlhaC5GXC4',
							'threadId': threadId ? threadId : null
						});
						return 1;
					});
				} else {
					this._socket.emit('outgoing', {
						'author': this.currUser.id,
						'message': { message: message },
						'dialog': dialog.id,
						'type': 'rlhaC5GXC4',
						'threadId': threadId ? threadId : null
					});
					return 1;
				}
			});
	}

	saveGmailToNotes(email, candidateId: string, contractId: string, emailTemplate: string, isPrivate: string) {
		return this.currUser.fetch('Client_Pointer').then(user => {
			const query = this._parse.Query('User');
			let note;
			if (emailTemplate) {
				emailTemplate = emailTemplate.trim();
			}
			return query.get(candidateId).then(candidate => {
				let message = [user.get('firstName'),
				user.get('lastName')];
				if (emailTemplate) {
					message.push([`sent a`, emailTemplate, `email to`]);
				} else {
					message.push(['sent an email to']);
				}
				message.push([candidate.get('firstName')]);
				message.push([candidate.get('lastName')]);
				note = message.join(' ');
				this._socket.emit('outgoing-note', {
					author: ``,
					candidate: candidateId,
					message: { message: note },
					client: user.get('Client_Pointer').id,
					contract: contractId,
					roomName: contractId + candidateId,
					isPrivate: isPrivate === 'true' ? true : false,
				});
				return 1;
			});
		});
	}
}