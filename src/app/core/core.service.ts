import { Injectable, OnInit } from '@angular/core';
import { Parse } from '../parse.service';
import { BehaviorSubject } from 'rxjs';
import { Login } from 'app/login.service';
import { User, TokenLi } from 'types/types';
import { Router } from '@angular/router';

@Injectable()
export class CoreService implements OnInit {

	public deactivatedUser: BehaviorSubject<string> = new BehaviorSubject('');
	public readMessages: BehaviorSubject<string> = new BehaviorSubject('');
	public typingStatus: BehaviorSubject<string> = new BehaviorSubject('');
	public highlighter: BehaviorSubject<string> = new BehaviorSubject('');
	currentDeactivatedUser = this.deactivatedUser.asObservable();
	readCurrentMessages = this.readMessages.asObservable();
	currentTypingStatus = this.typingStatus.asObservable();
	currentHighlighter = this.highlighter.asObservable();

	constructor(
		private _parse: Parse,
		private readonly loginService: Login,
		private readonly router: Router
	) { }

	ngOnInit(): void {
	}

	getClientLogo() {
		// if (this._parse.getCurrentUser()) {
		// 	const user = this._parse.Query('User');
		// 	user.include('');
		// 	user.equalTo('objectId', this._parse.getCurrentUser().id);

		// 	return user.first().then(userResult => {
		// 		if (userResult.get('Client_Pointer') && userResult.get('Client_Pointer').get('ClientLogo')) {
		// 			return userResult.get('Client_Pointer').get('ClientLogo');
		// 		}
		// 	},
		// 	error => {
		// 		console.error(error);
		// 	});
		// }
	}

	getTeamMembers(): any {
		// const client = this._parse.getCurrentUser().get('Client_Pointer');
		// let clientId;
		// if (client) {
		// 	clientId = this._parse.getCurrentUser().get('Client_Pointer').id;
		// }
		// const query = this._parse.Query('Clients');
		// query.equalTo('objectId', clientId);
		// return query.first().then(clientResult => {
		// 	return this._parse.staticObject().fetchAllIfNeeded(clientResult.get('TeamMembers'));
		// });
	}

	getStatuses(members) {
		// const query = this._parse.Query('Session');
		// return query.first().then(clientResult => {
		// 	return this._parse.staticObject().fetchAllIfNeeded(clientResult.get('user'));
		// });
	}

	getInactiveTeamMembers(): any {
		// const client = this._parse.getCurrentUser().get('Client_Pointer');
		// let clientId;
		// if (client) {
		// 	clientId = this._parse.getCurrentUser().get('Client_Pointer').id;
		// }
		// const query = this._parse.Query('Clients');
		// query.equalTo('objectId', clientId);
		// return query.first().then(clientResult => {
		// 	return this._parse.staticObject().fetchAllIfNeeded(clientResult.get('InactiveUsers'));
		// });
	}

	getInvitations(): any {
		// return this._parse.getCurrentUser().fetch().then(user => {
		// 	return user.get('Client_Pointer').fetch();
		// }).then(clientp => {
		// 	const clientId = clientp.id;
		// 	const query = this._parse.Query('Clients');
		// 	query.equalTo('objectId', clientId);
		// 	return query.first()}).then(client => {
		// 		const invitations = this._parse.Query('Invitations');
		// 		invitations.equalTo('ClientPointer', client);
		// 		invitations.equalTo('Invitation_Status', 0);
		// 		return invitations.find(invitation => {
		// 			return invitation;
		// 	});
		// });
	}

	throwDeactivatedUser(user: string) {
		this.deactivatedUser.next(user);
	}

	clearMessagesCount(id) {
		this.readMessages.next(id);
	}

	closeTypingStatus(id) {
		this.typingStatus.next(id);
	}

	removeHighlighter(id) {
		this.highlighter.next(id);
	}
}
