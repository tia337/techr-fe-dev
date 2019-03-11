import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Parse } from './parse.service';
import * as md5 from 'crypto-js/md5';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { RootVCRService } from 'app/root_vcr.service';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class Login {

	private _profile: BehaviorSubject<any> = new BehaviorSubject(null);
	private _maxTrialDays = 15;
	private global: any;

	constructor(
		private readonly parse: Parse,
		private readonly router: Router,
		private readonly httpService: HttpClient
	) {
		this.global = window as any;
		if (this.parse.getCurrentUser()) {
			this._profile.next(this.parse.Parse.User.current());
			router.navigate(['/dashboard']);
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
	getAuthUrl(provider: string) {
		// this.parse
		// 	.execCloud('getAuthUrl', { provider: provider })
		// 	.then(authUrl => {
		// 		window.location.href = authUrl;
		// 	});

		const params = { params: { provider } };

		this.httpService
			.post('login/getAuthUrl', params)
			.subscribe((result: string) => {
			
			});
	}

	signInWithLinkedin(code: String, branchData?: Object) {
		const providerFuncName = 'signInWithLinkedin';
		const provider = 'linkedin';
		const tokenName = 'token-li';
		if (!localStorage.getItem(tokenName) || Object.keys(JSON.parse(localStorage.getItem(tokenName)) === 0)) {
			this.parse.execCloud('getAccessToken', { provider: provider, code: code })
			.then(token => {
				localStorage.setItem(tokenName, JSON.stringify(token));
				this.signIn(providerFuncName, token, branchData);
			})
			return;
		}

		let token = localStorage.getItem(tokenName);
		token = JSON.parse(token);
		this.signIn(providerFuncName, token, branchData);
	}

	signInWithMicrosoft(code: String, branchData?: Object) {
		const providerFuncName = 'signInWithMicrosoft';
		const provider = 'microsoft';
		const tokenName = 'token-ms';
		if (!localStorage.getItem(tokenName) || Object.keys(JSON.parse(localStorage.getItem(tokenName)) === 0)) {
			this.parse.execCloud('getAccessToken', { provider: provider, code: code })
			.then(token => {
				localStorage.setItem(tokenName, JSON.stringify(token));
				this.signIn(providerFuncName, token, branchData);
			})
			return;
		}

		let token = localStorage.getItem(tokenName);
		token = JSON.parse(token);
		this.signIn(providerFuncName, token, branchData);
	}

	signIn(provider: string, token: Object, branchData?: Object) {
		this.parse.execCloud(provider, { token: token, branchData: branchData })
		.then(user => {
			if (user === 'unauthorized') {
				throw 'unauthorized';
			}
			console.log(user);
			if (!user.authenticated()) {
				console.log('authenticating user'); // debug
				return this.parse.Parse.User.logIn(user.get('username'), this.getPassword(user.get('username')));
			} else {
				return user;
			}
		})
		.then(user => {
			this._profile.next(user);
			this.router.navigate(['/dashboard']);
		})
		.catch(err => {
			console.error(err);
			this.router.navigate(['/login'])
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
		this.parse.Parse.User.logOut().then(() => {
			localStorage.removeItem('token-li');
			localStorage.removeItem('token-ms');

			// this._global.IN.User.logout(); Linkedin JS SDK deprecated
			// add ms logout, remove token from localStorage
			console.log('redirecting to /login')
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

	get maxTrialDays() {
		return this._maxTrialDays;
	}




}
