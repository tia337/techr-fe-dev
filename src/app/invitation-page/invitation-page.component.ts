import { Component, OnInit } from '@angular/core';
import { InvitationPageService } from './invitation-page.service';
import { Branch } from '../shared/services/branch.service';
import { Loading } from '../shared/utils';
import { Login } from '../login.service';

@Component({
	selector: 'app-invitation-page',
	templateUrl: './invitation-page.component.html',
	styleUrls: ['./invitation-page.component.scss']
})
export class InvitationPageComponent implements OnInit {

	authorName;
	invitedUserName;
	clientName: string;
	loading: number;

	constructor(
		private _invitationPageService: InvitationPageService,
		private _branch: Branch,
		private _login: Login
	) { }

	ngOnInit() {
		this.loading = Loading.loading;
		this._branch.data.then(branchData => {
			console.log(branchData);

			localStorage.setItem('branchdata', JSON.stringify(branchData));
			
			if (branchData.invitation_author && branchData.invited_user && branchData.client_name) {
				this.authorName = branchData.invitation_author;
				this.invitedUserName = branchData.invited_user;
				this.clientName = branchData.client_name;
				this.loading = Loading.success;
			} else {
				this.loading = Loading.error;
			}
		});
	}

	signInWithLinkedin() {
		this._login.getAuthUrl('linkedin');
	}

	signInWithMicrosoft() {
		this._login.getAuthUrl('microsoft');
	}

	get Loading() {
		return Loading;
	}

}
