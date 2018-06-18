import { Injectable } from '@angular/core';
import { Branch } from '../shared/services/branch.service';
import { Parse } from '../parse.service';
import * as md5 from 'crypto-js/md5';
import { Router } from '@angular/router';
import { Login } from '../login.service';
import { RootVCRService } from '../root_vcr.service';
import { PreloaderComponent } from '../shared/preloader/preloader.component';

@Injectable()
export class InvitationPageService {

	private _global;

	constructor(
		private _branch: Branch,
		private _parse: Parse,
		private _router: Router,
		private _login: Login,
		private _root_vcr: RootVCRService
	) {
		this._global = window as any;
	}
	/*
	signUpWithLinkedin() {
		console.log('signUpWithLinkedin');
		this._parse.execCloud('getAuthUrl', {}).then(authUrl => {
			window.location.href = authUrl;
		});

		this._root_vcr.createComponent(PreloaderComponent);
		this._global.IN.User.authorize(() => {
			this._global.IN.API.Raw(
				'/people/~:(id,first-name,last-name,picture-url,headline,location,industry,num-connections,summary,positions,email-address,picture-urls::(original))?format=json'
			).result( data => {
				this._branch.data.then(branchData => {
					return this._parse.Parse.Cloud.run('invitationSignUp', {data: data, branchData: branchData});
				}, error => {
					console.error(error);
				}).then(user => {
					if (!user.authenticated()) {
						return this._parse.Parse.User.logIn(user.get('username'), this._login.getPassword(user.get('username')));
					} else {
						return user;
					}
				}, error => {
					console.error(error);
				}).then(user => {
					this._login.profile = user;
					this._root_vcr.clear();
					this._router.navigate(['/', 'dashboard']);
				});
			});
		});

	}
	*/
/*
	signUpWithMicrosoft() {
		this._login.getAuthUrl('microsoft');
	}
	*/

}
