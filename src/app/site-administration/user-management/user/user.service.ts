import { Injectable } from '@angular/core';

import { Parse } from '../../../parse.service';

@Injectable()
export class UserService {

	constructor(private _parse: Parse) {}

	getUser(userId: string): any {
		const currentUser = new this._parse.Parse.Query(this._parse.Parse.User);
		currentUser.equalTo('objectId', this._parse.getCurrentUser().id);
		currentUser.include('Client_Pointer');
		return currentUser.first().then( current => {

			const user = this._parse.Query(this._parse.Parse.User);
			user.include('Client_Pointer');
			user.equalTo('Client_Pointer', current.get('Client_Pointer'));
			return user.get(userId).then( userObject => {
				return userObject;
			});

		});

	}

	deactivateUser(userId: string): any {
		return this._parse.Parse.Cloud.run('deactivateUser', {userId: userId});
	}

}
