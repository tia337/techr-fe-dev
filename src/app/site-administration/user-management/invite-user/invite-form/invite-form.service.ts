import { Injectable } from '@angular/core';
import { Parse } from '../../../../parse.service';

@Injectable()
export class InviteFormService {

	constructor(private _parse: Parse) {}

	getCurrentUser() {
		const user = this._parse.Query('User');
		user.include('Client_Pointer.ClientName');
		return user.get(this._parse.getCurrentUser().id);
	}

	getCurrentUserAccessLevel(): any {
		const user = this._parse.Query('User');
		user.equalTo('objectId', this._parse.getCurrentUser().id);
		return user.first().then( userObject => {
			return userObject.get('HR_Access_Level');
		});
	}

	createInvitation(email: string, fullName: string, accessLevel: number, message: string, userRoles: Array<UserRole>) {
		// const user = this._parse.Query('User');
		// user.equalTo('objectId', this._parse.getCurrentUser().id);
		// user.first().then(currentUser => {
		//   const invitation = this._parse.Object('Invitations');
		//   invitation.set('Access_Level', accessLevel);
		//   invitation.set('Email_Address', email);
		//   invitation.set('Full_Name', fullName);
		//   invitation.set('Access_Level', accessLevel);
		//   invitation.set('Invitation_Author', currentUser);
		//   invitation.set('ClientPointer', currentUser.get('Client_Pointer'));
		//   invitation.set('Invitation_Date', new Date());
		//   invitation.set('Invitation_Status', 0);
		//   invitation.set('isExpired', false);
		//   invitation.set('Days_Left_Expiration', 15);
		//   invitation.set('InvitationMessage', message);
		//   invitation.save().then(() => {
		//     console.log('invitation saved');
		//     // console.log(currentUser.get('Work_email'));
		//     this._parse.execCloud('sendEmail', {
		//       to: email,
		//       from: currentUser.get('Work_email'),
		//       subject: 'SwipeIn Invitation',
		//       text: message
		//     });
		//   });
		// });

		console.log('email: ', email);
		console.log('full name: ', fullName);
		console.log('access level: ', accessLevel);
		console.log('message: ', message);
		console.log('userRoles: ', userRoles);
		this._parse.Parse.Cloud.run('inviteUser', {
			email: email,
			fullName: fullName,
			accessLevel: accessLevel,
			message: message,
			userRoles: userRoles
		}).then(res => {
			console.log(res);
		}, error => {
			console.error(error);
		});


	}

}
