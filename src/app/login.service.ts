import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Parse } from './parse.service';
import * as md5 from 'crypto-js/md5';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { RootVCRService } from 'app/root_vcr.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class Login {

	global: Window;

	private _profile = new BehaviorSubject(null);
	private _maxTrialDays = 15;

	constructor(
		private readonly parse: Parse,
		private readonly router: Router,
		private readonly httpService: HttpClient
	) {
		this.global = window;

		this.checkCurrentUser();
	}

	getAuthUrl(provider: string): void {
		// this.parse
		// 	.execCloud('getAuthUrl', { provider: provider })
		// 	.then(authUrl => {
		// 		window.location.href = authUrl;
		// 	});

		const params = { params: { provider } };

		this.httpService
			.post('login/getAuthUrl', params)
			.subscribe((result: string) => {
				console.log(result);

				window.location.href = result;
			});
	}

	signInWithLinkedin(code: string, branchData?: Object): void {
		const providerFuncName = 'signInWithLinkedin';
		const provider = 'linkedin';
		const tokenName = 'token-li';

		this.processSocialSignIn(provider, code, tokenName, branchData, providerFuncName);
	}

	signInWithMicrosoft(code: string, branchData?: Object): void {
		const providerFuncName = 'signInWithMicrosoft';
		const provider = 'microsoft';
		const tokenName = 'token-ms';

		this.processSocialSignIn(provider, code, tokenName, branchData, providerFuncName);
	}

	signIn(providerFuncName: string, token: Object, branchData?: Object): void {
		// this.parse.execCloud(provider, { token: token, branchData: branchData })
		// 	.then(user => {
		// 		if (user === 'unauthorized') {
		// 			throw 'unauthorized';
		// 		}

		// 		if (!user.authenticated()) {
		// 			return this.parse.Parse.User.logIn(user.get('username'), this.getPassword(user.get('username')));
		// 		} else {
		// 			return user;
		// 		}

		// 	})
		// 	.then(user => {
		// 		this._profile.next(user);
		// 		this.router.navigate(['/dashboard']);
		// 	})
		// 	.catch(err => {
		// 		this.router.navigate(['/login']);
		// 	});
		this.httpService
			.post(`login/${providerFuncName}`, { token: token, branchData: branchData })
			.subscribe((user: any) => {
				console.log(user);
				if (user === 'unauthorized') {
					throw 'unauthorized';
				}

				// if (!user.authenticated()) {
				// 	return this.parse.Parse.User.logIn(user.get('username'), this.getPassword(user.get('username')));
				// } else {
				// 	return user;
				// }

			});
			// .then(user => {
			// 	this._profile.next(user);
			// 	this.router.navigate(['/dashboard']);
			// })
			// .catch(err => {
			// 	this.router.navigate(['/login']);
			// });
	}

	private getAccessToken(
		provider: string,
		code: string,
		tokenName: string,
		branchData: Object,
		providerFuncName: string
	): void {

		const body = { provider, code };

		// this.parse
		// 	.execCloud('getAccessToken', { provider, code })
		// 	.then(token => {
		// 		localStorage.setItem(tokenName, JSON.stringify(token));
		// 		this.signIn(providerFuncName, token, branchData);
		// 	});

		const headers = new HttpHeaders({
			// 'Content-Type': 'application/x-www-form-urlencoded'
		});

		this.httpService
			.request('POST', 'login/getAccessToken', { body, headers })
			.subscribe((token: any) => {
				localStorage.setItem(tokenName, JSON.stringify(token));
				this.signIn(providerFuncName, token, branchData);
			});
	}

	private processSocialSignIn(
		provider: string,
		code: string,
		tokenName: string,
		branchData: Object,
		providerFuncName: string
	): void {

		if (!localStorage.getItem(tokenName) || Object.keys(JSON.parse(localStorage.getItem(tokenName)) === 0)) {
			this.getAccessToken(provider, code, tokenName, branchData, providerFuncName);

			return;
		}

		const token = JSON.parse(localStorage.getItem(tokenName));

		this.signIn(providerFuncName, token, branchData);
	}

	private checkCurrentUser(): void {
		if (this.parse.getCurrentUser()) {
			this._profile.next(this.parse.Parse.User.current());
			this.router.navigate(['/dashboard']);
		}
	}

/*
	signUpWithMicrosoft(code: String, branchData: Object) {
		this._parse.execCloud('invitationSignUpWithMicrosoft', { code: code, branchData: branchData })
		.then(user => {
			console.log(user);
			if (!user.authenticated()) {
				return this._parse.Parse.User.logIn(user.get('username'), this.getPassword(user.get('username')));
			} else {
				return user;
			}
		})
		.then(user => {
			this._profile.next(user);
			this._router.navigate(['/dashboard']);
		})
		.catch(err => {
			console.error(err);
		})
	}
*/
	getPassword(username: string) {
		return md5(username).toString().toUpperCase();
	}

	signOut(): void {
		this.parse.Parse.User.logOut().then(() => {
			localStorage.removeItem('token-li');
			localStorage.removeItem('token-ms');

			// this._global.IN.User.logout(); Linkedin JS SDK deprecated
			// add ms logout, remove token from localStorage
			this.router.navigate(['/login']);
			this.profile.next(null);
		});
	}

	get profile() {
		return this._profile;
	}

	set profile(value) {
		this._profile.next(value);
	}

	get maxTrialDays(): number {
		return this._maxTrialDays;
	}
}
