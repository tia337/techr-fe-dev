import { Injectable } from '@angular/core';
import { Parse } from '../parse.service';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class CoreService {

	public deactivatedUser: BehaviorSubject<string> = new BehaviorSubject('');
	currentDeactivatedUser = this.deactivatedUser.asObservable();

	constructor(private _parse: Parse) { }

	getClientLogo() {
		if (this._parse.getCurrentUser()) {
			const user = this._parse.Query('User');
			user.include('');
			user.equalTo('objectId', this._parse.getCurrentUser().id);

			return user.first().then(userResult => {
				if (userResult.get('Client_Pointer') && userResult.get('Client_Pointer').get('ClientLogo')) {
					return userResult.get('Client_Pointer').get('ClientLogo');
				}
			},
			error => {
				console.error(error);
			});
		}
	}

	getTeamMembers(): any {
		const client = this._parse.getCurrentUser().get('Client_Pointer');
		let clientId;
		if (client) {
			clientId = this._parse.getCurrentUser().get('Client_Pointer').id;
		}
		const query = this._parse.Query('Clients');
		query.equalTo('objectId', clientId);
		return query.first().then(clientResult => {
			return this._parse.staticObject().fetchAllIfNeeded(clientResult.get('TeamMembers'));
		});
	}

	getInactiveTeamMembers(): any {
		const client = this._parse.getCurrentUser().get('Client_Pointer');
		let clientId;
		if (client) {
			clientId = this._parse.getCurrentUser().get('Client_Pointer').id;
		}
		const query = this._parse.Query('Clients');
		query.equalTo('objectId', clientId);
		return query.first().then(clientResult => {
			return this._parse.staticObject().fetchAllIfNeeded(clientResult.get('InactiveUsers'));
		});
	}

	getInvitations(): any {
		return this._parse.getCurrentUser().fetch().then(user=>{
			return user.get('Client_Pointer').fetch();
		}).then(clientp=>{
			const clientId = clientp.id;
			const query = this._parse.Query('Clients');
			query.equalTo('objectId', clientId);
			return query.first()}).then(client => {
				const invitations = this._parse.Query('Invitations');
				invitations.equalTo('ClientPointer', client);
				invitations.equalTo('Invitation_Status', 0);
				return invitations.find(invitation => {
					return invitation;
			});
		});
	}

	throwDeactivatedUser(user: string) {
		this.deactivatedUser.next(user);
	}
}
