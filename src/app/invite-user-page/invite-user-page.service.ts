import { Injectable } from '@angular/core';
import {Parse} from "../parse.service";
import {Login} from "../login.service";
import {Branch} from "../shared/services/branch.service";

@Injectable()
export class InviteUserPageService {

	constructor(private _branch: Branch, private _login: Login, private _parse: Parse) { }

	signIn() {
		let branchData, client;

		this._branch.data.then(data => {
			console.log('branch data: ', data);
			branchData = data;
			const clientQuery = new this._parse.Parse.Query('Clients');
			return clientQuery.get(branchData.client);
		}).then(parseClient => {
			client = parseClient;
			console.log('client: ', client);
			return this._login.getAuthUrl('linkedin');
		}).then(user => {
			user.set('Work_email', branchData.work_email);
			user.set('HR_Access_Level', branchData.access_level);
			user.set('Client_Pointer', client.toPointer());
			user.set('Client', client.get('ClientName'));
			return user.save();
		}).then(user => {
			const teamMembers = client.get('TeamMembers');
			const existingTeamMember = teamMembers.find(member => {
				return member.id === user.id;
			});
			if (!existingTeamMember) {
				teamMembers.push(user.toPointer());
				client.set('TeamMembers', teamMembers);
				return client.save();
			} else {
				return client;
			}
		}, error => {
			console.error(error);
		});
	}

}
