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

	constructor(private _parse: Parse, private _router: Router, private _vcr: RootVCRService) {
		this._global = window as any;
		if (this._parse.getCurrentUser()) {
			this._profile.next(this._parse.Parse.User.current());
		}
	}

	signInWithMicrosoft(code: String) {
		this._parse.execCloud('getTokenFromCode', { code: code })
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
			this._vcr.clear();
		})
		.catch(err => {
			console.error(err);
		})
	}

	signIn(): Promise<ParseUser> {
		return new Promise( (resolve, reject) => {
			this._global.IN.User.authorize(() => {
				this._vcr.createComponent(PreloaderComponent);
				this._global.IN.API.Raw(
					'/people/~:(id,first-name,last-name,picture-url,headline,location,industry,num-connections,summary,positions,email-address,picture-urls::(original))?format=json'
				).result( data => {
					console.log(data);
					this._parse.Parse.Cloud.run('signUp', {data: data}).then(user => {
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

	getPassword(username: string) {
		return md5(username).toString().toUpperCase();
	}

	signOut() {
		this._parse.logOut().then(() => {
			this._global.IN.User.logout();
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
