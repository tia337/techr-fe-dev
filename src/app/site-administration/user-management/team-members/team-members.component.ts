import { Component, OnInit, OnDestroy } from '@angular/core';
import { TeamMembersService } from './team-members.service';
import { Router } from '@angular/router';
import { RootVCRService } from '../../../root_vcr.service';
import { AlertComponent } from '../../../shared/alert/alert.component';
import * as _ from 'underscore';

@Component({
	selector: 'app-team-members',
	templateUrl: './team-members.component.html',
	styleUrls: ['./team-members.component.scss']
})
export class TeamMembersComponent implements OnInit, OnDestroy {

	teamMembers: Array<any> = [];
	inactiveMembers: Array<any> = [];
	invitations: Array<any> = [];
	userFilter: 'all' | 'active' | 'pending' | 'inactive' = 'all';
	searchInput = '';
	allMembers: Array<any> = [];

	constructor(private _teamMembersService: TeamMembersService, private _router: Router, private _root_vcr: RootVCRService) { }

	ngOnInit() {
		// this._root_vcr = null;
		this.allMembers = [];
		this.invitations = [];
		this.teamMembers = [];
		this.loadMembers();
		this.loadInvitations(true);
		this.loadInactive();
	}

	loadInvitations(first?) {
		this._teamMembersService.getInvitations().then(invitations => {
			this.invitations = invitations;
			if (first) {
				this.allMembers = this.allMembers.concat(invitations);
			}
		});
	}

	loadMembers() {
		this._teamMembersService.getUsers().then(members => {
			this.teamMembers = members;
			members.reverse();
			members.forEach(element => {
				element.active = 1;
				const existingMember = this.allMembers.find(user => {
					return user.id === element.id;
				});
				if (!existingMember) {
					console.log(!existingMember);
					this.allMembers.unshift(element);
				}
			});
			// console.log(this.allMembers);
			//   this.allMembers = this.allMembers.concat(members);
		});
	}

	loadInactive() {
		this._teamMembersService.getDeletedUsers().then(members => {
			this.inactiveMembers = members;
			members.forEach(element => {
				this.allMembers.push(element);
			});
			//   this.allMembers = this.allMembers.concat(members);
		});
	}

	goToUser(userId: string, inactive?) {
		// console.log(userId);
		if (inactive)
		{
			this._router.navigate(['/', 'administration', 'user-management', { outlets: { 'user-management-sections': ['user', userId] } }], {skipLocationChange: true});
		}
		// {skipLocationChange: true}
	}

	deleteInvitation(invitiation) {
		this._teamMembersService.deleteInvitation(invitiation.id).then(() => {
			// console.log(this.allMembers);
			const index = this.allMembers.indexOf(invitiation);
			this.allMembers.splice(index, 1);
			// this.allMembers.forEach(element => {

			// });
			this.loadInvitations();
		});
	}

	resendInvitation(invitiationId: string) {
		this._teamMembersService.resendInvitation(invitiationId).then(() => {
			this.loadMembers();
			this.loadInvitations();

			let alert = this._root_vcr.createComponent(AlertComponent);
			alert.title = 'Invitation sent';
			alert.content = `
        Congratulations! Your invitation(s) successfully sent!
      `;
			alert.addButton({
				type: 'primary',
				title: 'OK, got it',
				onClick: () => {
					this._root_vcr.clear();
					alert = null;
				}
			});
		});
	}

	ngOnDestroy() {
		this._root_vcr = null;
	}

}
