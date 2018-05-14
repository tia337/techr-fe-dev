import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AccessLevelPageService } from './access-level-page.service';
import { Parse } from '../../../parse.service';

import { RootVCRService } from '../../../root_vcr.service';
import { AccessLevelModalComponent } from '../user/access-level-modal/access-level-modal.component';

@Component({
	selector: 'app-access-level-page',
	templateUrl: './access-level-page.component.html',
	styleUrls: ['./access-level-page.component.scss']
})
export class AccessLevelPageComponent implements OnInit {

	public permissionType: number = parseInt(this._activatedRoute.snapshot.params['id'], 10);
	currentAccessLevel: any;
	currentCustomAccessLevel = {
		roleName: null,
		roleDescription: null,
		roleRights: []
	};
	users;
	private currentUser = this._parse.getCurrentUser();


	accessLevels = [
		{ type: 1, name: 'Site-admin', rights: 'SwipeIn application access. Can invite and manage users, company settings and billing' },
		{ type: 2, name: 'Admin', rights: 'Swipe in application access. Can invite and manage users and company settings.' },
		{ type: 3, name: 'Contributor', rights: 'SwipeIn application access. Can invite users.' }
	];

	constructor(
		private _activatedRoute: ActivatedRoute,
		private _alService: AccessLevelPageService,
		private root_vcr: RootVCRService,
		private _parse: Parse
	) { }

	ngOnInit() {
		if (this.permissionType !== 4) {
			this.currentAccessLevel = this.accessLevels.find(accessLevel => {
				return accessLevel.type == this.permissionType;
			});
			this._alService.findUsersByAL(this.permissionType).then(users => {
				this.users = users;
			});
		};
		if (this.permissionType === 4) {
			this._activatedRoute.queryParams.subscribe(params => {
				this.currentCustomAccessLevel.roleName = params.role;
				this._alService.getUserRoles().then(data => {
					this.currentCustomAccessLevel = data.find(role => {
						return role.roleName = this.currentCustomAccessLevel.roleName;
					});
				}).catch(error => {
					console.log(error);
				});
				this._alService.getTeamMembersUserRoles(params.role).then(data => {
					this.users = data;
				}).catch(error => {
					console.log(error);
				});
			});
		}

	}

	openModal(userId) {
		const modal = this.root_vcr.createComponent(AccessLevelModalComponent);
		modal.users = this.users;
		modal.permissionType = this.permissionType;
		modal.setUserId(userId);
	}

}
