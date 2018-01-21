import {
	Component,
	OnInit,
	OnDestroy,
	ViewContainerRef,
	ComponentFactoryResolver,
	ViewRef,
	ElementRef,
	Renderer2
} from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { InviteVCR } from '../inviteVCR.service';
import { InviteFormService } from './invite-form.service';

@Component({
	selector: 'app-invite-form',
	templateUrl: './invite-form.component.html',
	styleUrls: ['./invite-form.component.scss']
})
export class InviteFormComponent implements OnInit, OnDestroy {

	viewRef: ViewRef;
	currentUser;

	email: string;
	fullName: string;
	inviteMessage: string;

	emailErrorMessage: string;


	formIndex: number;

	permissions = [
		{ name: 'Site-admin', value: 1, tooltip: 'SwipeIn application access. Can invite and manage users, company settings and billing', disabled: false },
		{ name: 'Admin', value: 2, tooltip: 'Swipe in application access. Can invite and manage users and company settings.', disabled: false  },
		{ name: 'Contributor', value: 3, tooltip: 'SwipeIn application access. Can invite users.', disabled: false }
	];

	checkedPermission = this.permissions.find(al => {return al.value === 3});
	private accessLevel: string = this.checkedPermission.value.toString();

	constructor(
		private _vcr: ViewContainerRef,
		private _cfr: ComponentFactoryResolver,
		private _inviteVCR: InviteVCR,
		private _inviteFormService: InviteFormService,
		private _elRef: ElementRef,
		private _renderer: Renderer2
	) {}

	ngOnInit() {
		console.log('Form was created');
		// console.log(this.checkedPermission);
		this._inviteFormService.getCurrentUser().then(user => {
			this.currentUser = user;
			this.inviteMessage = 'Hi,\n\n'+this.currentUser.get('firstName')+' '+this.currentUser.get('lastName')+' wants to collaborate with you on SwipeIn.hr. Join now to the '+user.get('Client_Pointer').get('ClientName')+' recruitment team on the following link.';
		});

		this.formIndex = this._inviteVCR.getIndex(this.viewRef);

		this._inviteFormService.getCurrentUserAccessLevel().then( userAL => {
			// this.accessLevel = userAL.toString();
			// this.setCheckedPermission();
			if(userAL > 0)
				this.permissions.filter(al => {
					return al.value < userAL;
				}).forEach(al => {
					al.disabled = true;
				});

		});


		// this.inviteForm = this._formBuilder.group({
		//   email: '',
		//   fullName: '',
		//   inviteMessage: '',
		//   accessLevel: 3
		// });
	}

	ngOnDestroy() {
		console.log('destroy');
		this.viewRef = null;
		this.currentUser = null;
	}

	deleteForm() {
		if(this.formIndex >= 1)
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
		// if(this.validateEmail())
		this._inviteFormService.createInvitation(this.email, this.fullName, parseInt(this.accessLevel, 10), this.inviteMessage);
	}

	validateEmail(): boolean {
		if(!this.email || this.email.length == 0) {
			this.emailErrorMessage = 'Please, enter your work email';
			return false;
		}
		else if(!/[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*/g.test(this.email)) {
			this.emailErrorMessage = 'Invalid email address!';
			return false;
		}
		else if(!/[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@(?!gmail|hotmail)[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*/g.test(this.email)) {
			this.emailErrorMessage = 'You should enter a company email address';
			return false;
		}
		this.emailErrorMessage = '';
		return true;
	}

	getViewRefIndex() {
		return this._inviteVCR.getIndex(this.viewRef);
	}

}
