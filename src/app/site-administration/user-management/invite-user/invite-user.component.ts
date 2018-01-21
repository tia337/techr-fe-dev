import { Component, OnInit, OnDestroy, ViewContainerRef, ViewChild, ComponentFactoryResolver } from '@angular/core';
import { Router } from '@angular/router';
import { InviteVCR } from './inviteVCR.service';
import { InviteFormComponent } from './invite-form/invite-form.component';
import { RootVCRService } from '../../../root_vcr.service';
import { InvitationConfirmAlertComponent } from './invitation-confirm-alert/invitation-confirm-alert.component';

@Component({
	selector: 'app-invite-user',
	templateUrl: './invite-user.component.html',
	styleUrls: ['./invite-user.component.scss']
})
export class InviteUserComponent implements OnInit, OnDestroy {

	@ViewChild('rootInviteForm', {read: ViewContainerRef}) rootInviteForm: ViewContainerRef;

	constructor(
		// private _vcr: ViewContainerRef,
		private _inviteVCR: InviteVCR,
		// private cfr: ComponentFactoryResolver,
		private root_vcr: RootVCRService,
		private _router: Router
	) { }

	ngOnInit() {
		this._inviteVCR.setVCR(this.rootInviteForm);
		// this._inviteVCR.createComponent(InviteFormComponent)
		// let formCompRef = this._inviteVCR.createComponent(InviteFormComponent);
		// let  a = formCompRef.instance;
		// a.viewRef = formCompRef.hostView;
		this.createForm();
	}

	createForm() {
		const formCompRef = this._inviteVCR.createComponent(InviteFormComponent);
		const  form = formCompRef.instance;
		form.viewRef = formCompRef.hostView;
	}

	submitAll() {
		// submitForm
		let invitationsCount;
		this._inviteVCR.getForms().then(forms => {
			invitationsCount = forms.length;
			forms.forEach(form => {
				form.submitForm();
			});
		})
			.then((result) => {
				console.log(result);
				const alert = this.root_vcr.createComponent(InvitationConfirmAlertComponent);
				alert.numberOfInvitations = invitationsCount;
			})
			.then(() => {
				this._router.navigateByUrl('/');
			});

	}

	ngOnDestroy() {
		this._inviteVCR.forms = [];
	}


}
