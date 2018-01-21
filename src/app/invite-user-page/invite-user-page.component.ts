import { Component, OnInit } from '@angular/core';
import { InviteUserPageService } from './invite-user-page.service';

@Component({
	selector: 'app-invite-user-page',
	templateUrl: './invite-user-page.component.html',
	styleUrls: ['./invite-user-page.component.scss']
})
export class InviteUserPageComponent implements OnInit {

	constructor(private _inviteUserService: InviteUserPageService) { }

	ngOnInit() {
	}

	signIn() {
		// let branchData, client;
		//
		// this._branch.data.then(data => {
		//   console.log('branch data: ', data);
		//   branchData = data;
		//   const clientQuery = new this._parse.Parse.Query('Clients');
		//   return clientQuery.get(branchData.client);
		// }).then(parseClient => {
		//   client = parseClient;
		//   console.log('client: ', client);
		//   return this._login.signIn();
		// }).then(user => {
		//   user.set('Work_email', branchData.work_email);
		//   user.set('HR_Access_Level', branchData.access_level);
		//   user.set('Client_Pointer', client.toPointer());
		//   user.set('Client', client.get('ClientName'));
		//   return user.save();
		// }).then(user => {
		//   const teamMembers = client.get('TeamMembers');
		//   const existingTeamMember = teamMembers.find(member => {
		//     return member.id === user.id;
		//   });
		//   if (!existingTeamMember) {
		//     teamMembers.push(user.toPointer());
		//     client.set('TeamMembers', teamMembers);
		//     return client.save();
		//   } else {
		//     return client;
		//   }
		// });
		this._inviteUserService.signIn();
	}

}
