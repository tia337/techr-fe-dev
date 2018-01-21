import { Component, OnInit } from '@angular/core';
import { RootVCRService } from '../../../../root_vcr.service';

@Component({
	selector: 'app-invitation-confirm-alert',
	templateUrl: './invitation-confirm-alert.component.html',
	styleUrls: ['./invitation-confirm-alert.component.scss']
})
export class InvitationConfirmAlertComponent implements OnInit {

	constructor(private root_vcr: RootVCRService) { }

	private _numberOfInvitations: number;

	ngOnInit() {
	}

	closeAlert() {
		this.root_vcr.clear();
	}

	set numberOfInvitations(value: number) {
		this._numberOfInvitations = value;
	}

	get numberOfInvitations() {
		return this._numberOfInvitations;
	}

}
