import { Injectable } from '@angular/core';
import { Parse } from '../../parse.service';
import { Login } from '../../login.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from 'types/types';


@Injectable()
export class ConfirmationAlertService {

	constructor(
		private _parse: Parse,
		private loginService: Login,
		private httpClient: HttpClient
	) {}

	// getPositions(): any {
	// 	return this._parse.getCurrentUser().get('positions');
	// }

	// initClient(email: string, companyName: string) {
	// 	return this._parse.Parse.Cloud.run('createClient', {companyName: companyName, email: email})
	// 		.then(() => {
	// 		return this._parse.Parse.User.current().fetch();
	// 	}).then(user => {
	// 		setTimeout(() => {
	// 			this._login.profile = user;
	// 		}, 0);
	// 		return user;
	// 	});
	// }

	initClient(email: string, companyName: string, user: User): Observable<User> {
		return this.httpClient.post('client/createClient', { email, companyName, user }) as Observable<User>;
	}
}

