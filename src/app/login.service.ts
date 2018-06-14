import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Parse } from './parse.service';
import { ParsePromise, ParseUser } from 'parse';
import * as md5 from 'crypto-js/md5';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { PreloaderComponent } from 'app/shared/preloader/preloader.component';
import { RootVCRService } from 'app/root_vcr.service';

@Injectable()
export class Login {

	private _profile: BehaviorSubject<ParseUser> = new BehaviorSubject(null);
	private _maxTrialDays = 15;
	private _global: any;

	constructor(
		private _parse: Parse,
		private _router: Router,
		private _vcr: RootVCRService
	) {
		this._global = window as any;
		if (this._parse.getCurrentUser()) {
			this._profile.next(this._parse.Parse.User.current());
			_router.navigate(['/dashboard']);
		}
	}
/*
	signIn(): Promise<ParseUser> {
		return new Promise( (resolve, reject) => {
			this._global.IN.User.authorize(() => {
				this._vcr.createComponent(PreloaderComponent);
				this._global.IN.API.Raw(
					'/people/~:(id,first-name,last-name,picture-url,headline,location,industry,num-connections,summary,positions,email-address,picture-urls::(original))?format=json'
				).result( data => {
					console.log(data);
					this._parse.Parse.Cloud.run('signUp', {data: data})
					.then(user => {
						if (!user.authenticated()) {
							return this._parse.Parse.User.logIn(user.get('username'), this.getPassword(user.get('username')));
						} else {
							return user;
						}
					}).then(user => {
						this._profile.next(user);
						this._router.navigate(['/dashboard']);
						resolve(user);
						this._vcr.clear();
					}, error => {
						reject(error);
					});
				});
			});
		});
	}
*/
	getAuthUrl(provider: String) {
		this._parse.execCloud('getAuthUrl', { provider: provider })
		.then(authUrl => {
			window.location.href = authUrl;
		});
	}

	signInWithLinkedin(code: String, branchData?: Object) {
		const provider = 'signInWithLinkedin';
		const tokenName = 'token-li';
		if (!localStorage.getItem(tokenName) || Object.keys(JSON.parse(localStorage.getItem('token-li')) === 0)) {
			this._parse.execCloud('getAccessToken', { provider: 'linkedin', code: code })
			.then(token => {
				console.log(token);
				localStorage.setItem(tokenName, JSON.stringify(token));
				this.signIn(provider, token, branchData);
			})
			return;
		}

		let token = localStorage.getItem(tokenName);
		token = JSON.parse(token);
		this.signIn(provider, token, branchData);
	}

	signInWithMicrosoft(code: String, branchData?: Object) {
		const provider = 'signInWithMicrosoft';
		const tokenName = 'token-ms';
		if (!localStorage.getItem(tokenName) || Object.keys(JSON.parse(localStorage.getItem('token-li')) === 0)) {
			this._parse.execCloud('getAccessToken', { provider: 'microsoft', code: code })
			.then(token => {
				console.log(token);
				localStorage.setItem(tokenName, JSON.stringify(token));
				this.signIn(provider, token, branchData);
			})
			return;
		}

		let token = localStorage.getItem(tokenName);
		token = JSON.parse(token);
		this.signIn(provider, token, branchData);
	}

	signIn(provider: string, token: Object, branchData?: Object) {
		this._parse.execCloud(provider, { token: token, branchData: branchData })
		.then(user => {
			if (user === 'unauthorized') {
				throw 'unauthorized';
			}
			console.log(user);
			if (!user.authenticated()) {
				console.log('authenticating user'); // debug
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
			this._router.navigate(['/login'])
		})
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

	signOut() {
		console.log('logout')
		this._parse.Parse.User.logOut().then(() => {
			localStorage.removeItem('token-li');
			localStorage.removeItem('token-ms');

			// this._global.IN.User.logout(); Linkedin JS SDK deprecated
			// add ms logout, remove token from localStorage
			console.log('redirecting to /login')
			this._router.navigate(['/login']);
			this.profile.next(null);
		});
	}

	get profile() {
		return this._profile;
	}

	set profile(value) {
		this._profile.next(value);
	}

	get maxTrialDays() {
		return this._maxTrialDays;
	}




}
