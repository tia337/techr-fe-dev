import {
	Component, OnInit, OnDestroy, ViewContainerRef, ComponentFactoryResolver, ViewRef, ElementRef, Renderer2
} from '@angular/core';
import { InviteVCR } from '../inviteVCR.service';
import { InviteFormService } from './invite-form.service';
import { Parse } from '../../../../parse.service';
import { UserRole, User } from 'types/types';
import { Login } from 'app/login.service';

@Component({
	selector: 'app-invite-form',
	templateUrl: './invite-form.component.html',
	styleUrls: ['./invite-form.component.scss']
})
export class InviteFormComponent implements OnInit, OnDestroy {

	viewRef: ViewRef;
	currentUser: User;

	email: string;
	fullName: string;
	inviteMessage: string;

	emailErrorMessage: string;
	formIndex: number;

	permissions = [
		{
			name: 'Site-admin',
			value: 1,
			tooltip: 'TechR application access. Can invite and manage users, company settings and billing',
			disabled: false
		},
		{
			name: 'Admin',
			value: 2,
			tooltip: 'TechR application access. Can invite and manage users and company settings.',
			disabled: false
		},
		{
			name: 'Contributor',
			value: 3,
			tooltip: 'TechR application access. Can invite users.',
			disabled: false
		}
	];

	checkedPermission = this.permissions.find(al => { return al.value === 3; });
	private accessLevel = this.checkedPermission.value.toString();
	userRoles = new Array<UserRole>();
	userRolesArray = new Array<UserRole>();

	constructor(
		private _inviteVCR: InviteVCR,
		private _inviteFormService: InviteFormService,
		private _elRef: ElementRef,
		private _renderer: Renderer2,
		private _parse: Parse,
		private readonly loginService: Login
	) { }

	ngOnInit() {

		this.getUser();

		this.formIndex = this._inviteVCR.getIndex(this.viewRef);

		this._inviteFormService.getCurrentUserAccessLevel().then(userAL => {
			if (userAL > 0)
				this.permissions.filter(al => {
					return al.value < userAL;
				}).forEach(al => {
					al.disabled = true;
				});

		});


		this.getUserRoles().then(roles => {
			this.userRoles = roles;
		});
	}

	ngOnDestroy() {
		this.viewRef = null;
		this.currentUser = null;
	}

	deleteForm() {
		if (this.formIndex >= 1)
			this._inviteVCR.removeComponent(this.formIndex, this);
	}

	showDropdown() {
		this._renderer.removeClass(this._elRef.nativeElement.querySelector('.al-select'), 'hidden');
		this._renderer.removeClass(this._elRef.nativeElement.querySelector('.al-dropdown-overlay'), 'hidden');
	}

	closeDropdown() {
		this._renderer.addClass(this._elRef.nativeElement.querySelector('.al-select'), 'hidden');
		this._renderer.addClass(this._elRef.nativeElement.querySelector('.al-dropdown-overlay'), 'hidden');

	}

	setCheckedPermission() {
		this.checkedPermission = this.permissions.find(permission => {
			return permission.value == parseInt(this.accessLevel, 10) && !permission.disabled;
		});
	}

	submitForm() {
		this._inviteFormService.
			createInvitation(this.email,
				this.fullName,
				parseInt(this.accessLevel, 10),
				this.inviteMessage,
				this.userRolesArray
			);
	}

	validateEmail(): boolean {
		if (!this.email || this.email.length == 0) {
			this.emailErrorMessage = 'Please, enter your work email';
			return false;
		}
		else if (!/[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*/g.test(this.email)) {
			this.emailErrorMessage = 'Invalid email address!';
			return false;
		}
		else if (!/[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@(?!gmail|hotmail)[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*/g.test(this.email)) {
			this.emailErrorMessage = 'You should enter a company email address';
			return false;
		}
		this.emailErrorMessage = '';
		return true;
	}

	getViewRefIndex() {
		return this._inviteVCR.getIndex(this.viewRef);
	}

	getUserRoles() {
		const clientId = this._parse.getCurrentUser().get('Client_Pointer').id;
		return this._parse.execCloud('getUserRoles', { clientId: clientId });
	}

	private getUser(): void {
		this.loginService.profile.subscribe((user: User) => {
			this.currentUser = user;
			this.inviteMessage = `Hi,\n\n ${this.currentUser.firstName} ${this.currentUser.lastName} wants to collaborate with you on TechR. Join now to the ${this.currentUser.clientName} recruitment team on the following link.`;
		});
	}

}
