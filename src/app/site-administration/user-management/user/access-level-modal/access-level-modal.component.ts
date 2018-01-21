import { Component, OnInit, OnDestroy, Renderer2, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { RootVCRService } from '../../../../root_vcr.service';
import { AccessLevelModalService } from './access-level-modal.service';
import { Parse } from '../../../../parse.service';

@Component({
	selector: 'app-access-level-modal',
	templateUrl: './access-level-modal.component.html',
	styleUrls: ['./access-level-modal.component.scss']
})
export class AccessLevelModalComponent implements OnInit, OnDestroy {

	allowEditAL: boolean;
	private userId: string;
	private permissions = [
		{ name: 'Site-admin', value: 1, tooltip: 'SwipeIn application access. Can invite and manage users and billing.', disabled: false },
		{ name: 'Admin', value: 2, tooltip: 'SwipeIn application access. Can invite and manage users.', disabled: false },
		{ name: 'Contributor', value: 3, tooltip: 'SwipeIn application access. Can invite users.', disabled: false }
	];
	private accessLevel: string;
	private checkedPermission;
	private siteAdmin;
	private bingo;
	private users;
	private permissionType;
	constructor(
		private root_vcr: RootVCRService,
		private _alModalService: AccessLevelModalService,
		private _parse: Parse,
		private _router: Router,
		private _renderer: Renderer2,
		private _elRef: ElementRef
	) { }

	ngOnInit() {
		this._alModalService.getCurrentUserAccessLevel().then(currentUserAL => {
			this._alModalService.getUserAccessLevel(this.userId).then(userAL => {
				this.accessLevel = userAL.toString();
				this.setCheckedPermission();
				if (currentUserAL === 1) {
					this.allowEditAL = true;
				} else if (currentUserAL === 2) {
					this.permissions[0].disabled = true;
					this.allowEditAL = true;
				} else {
					this.allowEditAL = false;
					this.getSiteAdmin();
				}
			});
		});
	}

	setCheckedPermission() {
		this.checkedPermission = this.permissions.find(permission => {
			return permission.value == parseInt(this.accessLevel);
		})
	}

	changePermissions() {
		if (this.users && this.permissionType) {
			this.users.forEach(user => {
				if (user.id === this.userId && user.get('HR_Access_Level') !== parseInt(this.accessLevel, 10)) {
					this.users.splice(this.users.indexOf(user), 1);
				}
			});
		}
		if (this.allowEditAL) {
			this._parse.execCloud('changeAccessLevel', { userId: this.userId, accessLevel: parseInt(this.accessLevel, 10) }).then(() => {
				if (this.bingo) {
					this.bingo.accessLevel = this.accessLevel;
					if (parseInt(this.accessLevel, 10) === 1) {
						this.bingo.accessLevel = 'Site-admin';
					} else if (parseInt(this.accessLevel, 10) === 2) {
						this.bingo.accessLevel = 'Admin';
					}
					if (parseInt(this.accessLevel, 10) === 3) {
						this.bingo.accessLevel = 'Contributor';
					}
				}
				this.root_vcr.clear();
				this._router.navigate(['/', 'administration', 'user-management']);
			});
		}
	}

	getSiteAdmin() {
		this._alModalService.getSiteAdmin().then(siteAdmin => {
			this.siteAdmin = siteAdmin;
		});
	}

	showDropdown() {
		this._renderer.removeClass(this._elRef.nativeElement.querySelector('.al-select'), 'hidden');
		this._renderer.removeClass(this._elRef.nativeElement.querySelector('.al-dropdown-overlay'), 'hidden');
	}

	closeDropdown() {
		this._renderer.addClass(this._elRef.nativeElement.querySelector('.al-select'), 'hidden');
		this._renderer.addClass(this._elRef.nativeElement.querySelector('.al-dropdown-overlay'), 'hidden');

	}

	setUserId(userId) {
		this.userId = userId;
	}

	ngOnDestroy() {

		this.userId = null;
		this.permissions = null;
		this.accessLevel = null;
		this.allowEditAL = null;
		this.checkedPermission = null;
		this.siteAdmin = null;

		this.root_vcr = null;
		this._alModalService = null;
		this._parse = null;
		this._router = null;
		this._renderer = null;
		this._elRef = null;


	}

	closeModal() {
		this.root_vcr.clear();
	}


}
