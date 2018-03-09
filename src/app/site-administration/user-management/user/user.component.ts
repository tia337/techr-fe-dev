import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from './user.service';
import { RootVCRService } from '../../../root_vcr.service';
import { AccessLevelModalComponent } from './access-level-modal/access-level-modal.component';
import { AlertComponent } from '../../../shared/alert/alert.component';
import { Router } from '@angular/router';
import { Parse } from 'app/parse.service';
import { CoreService } from '../../../core/core.service';

@Component({
	selector: 'app-user',
	templateUrl: './user.component.html',
	styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

	userId: string = this._activatedRoute.snapshot.params['id'];
	user: any;
	accessLevel: string;

	constructor(
		private _userService: UserService,
		private _activatedRoute: ActivatedRoute,
		private _root_vcr: RootVCRService,
		private _router: Router,
		private _parse: Parse,
		public _coreService: CoreService
	) { }

	ngOnInit() {
		console.log(this._activatedRoute.snapshot);
		this._userService.getUser(this.userId).then(user => {
			this.user = user;
			if (user.get('HR_Access_Level') === 1) {
				this.accessLevel = 'Site-admin';
			} else if (user.get('HR_Access_Level') === 2) {
				this.accessLevel = 'Admin';
			} else if (user.get('HR_Access_Level') === 3) {
				this.accessLevel = 'Contributor';
			}
		});
	}

	openModal() {
		this._userService.getUser(this.userId).then(user => {
			this.user = user;
		});
		const modal = this._root_vcr.createComponent(AccessLevelModalComponent);
		modal.bingo = this;
		modal.setUserId(this.userId);
	}

	deactivateUser() {
		console.log(this._parse.getCurrentUser().get('HR_Access_Level'));

		if (this._parse.getCurrentUser().get('HR_Access_Level') === 1) {

			const alert = this._root_vcr.createComponent(AlertComponent);
			alert.title = 'Are you sure?';
			alert.content = `
      Are you sure you want to deactivate ` + this.user.get('firstName') + ` ` + this.user.get('lastName') + `?
      <br/>
      He won't be able  to see, edit or create jobs
    `;
			alert.addButton({
				type: 'warn',
				title: 'Yes, deactivate',
				onClick: () => {
					this._coreService.throwDeactivatedUser(this.userId);
					this._userService.deactivateUser(this.userId).then(success => {
						this._root_vcr.clear();

						const successAlert = this._root_vcr.createComponent(AlertComponent);

						this._router.navigate(['/', 'administration', 'user-management']);

						successAlert.title = 'User was deactivated';
						successAlert.content = this.user.get('firstName') + ` ` + this.user.get('lastName') + ` was successfully deactivated`;
						successAlert.addButton({
							type: 'primary',
							title: 'OK, got it',
							onClick: () => {
								this._root_vcr.clear();
							}
						});
					}, error => {

						this._root_vcr.clear();
					});
				}
			});

		} else {
			const rejectAlert = this._root_vcr.createComponent(AlertComponent);

			rejectAlert.title = 'Sorry, you don\'t have permissions';
			rejectAlert.type = 'sad';
			rejectAlert.content = `
				Sorry, only site-admins can deactivate users
			  `;
			rejectAlert.addButton({
				type: 'primary',
				title: 'OK, got it',
				onClick: () => {
					this._root_vcr.clear();
				}
			});
		}
	}

	get currentUser() {
		return this._parse.getCurrentUser();
	}
}
