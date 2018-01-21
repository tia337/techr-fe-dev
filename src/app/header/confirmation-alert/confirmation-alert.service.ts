import { Injectable } from '@angular/core';
import { Parse } from '../../parse.service';
import { Login } from '../../login.service';


@Injectable()
export class ConfirmationAlertService {

	constructor(private _parse: Parse, private _login: Login) {}

	// getPositions(): any {
	// 	return this._parse.getCurrentUser().get('positions');
	// }

	initClient(email: string, companyName: string) {
		return this._parse.Parse.Cloud.run('createClient', {companyName: companyName, email: email})
			.then(() => {
			return this._parse.Parse.User.current().fetch();
		}).then(user => {
			setTimeout(() => {
				this._login.profile = user;
			}, 0);
			return user;
		});
	}
}

