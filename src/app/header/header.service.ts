import { Injectable } from '@angular/core';
import { Parse } from '../parse.service';

@Injectable()
export class HeaderService {

	constructor(private _parse: Parse) { }

	getClientLogo() {
		if(this._parse.getCurrentUser()) {
			const user = this._parse.Query('User');
			user.include('');
			user.equalTo('objectId', this._parse.getCurrentUser().id);

			return user.first().then( user => {
					if(user.get('Client_Pointer') && user.get('Client_Pointer').get('ClientLogo'))
						return user.get('Client_Pointer').get('ClientLogo');
				},
				error => {
					console.error(error);
				});

		}

	}

	getAccessLevel(){
		this._parse.Parse.User.current().fetch().then(res=>{
			console.log(res.get("HR_Access_Level"));
		});
		console.log(this._parse.getCurrentUser());
		return this._parse.Parse.User.current().fetch().then(res=>{
			return res.get("HR_Access_Level");
		});
	}
	getAdmins(){
		return this._parse.Parse.User.current().get("Client_Pointer").fetch().then(client=>{
			console.log(client);
			let admins: any[] = [];
			return this._parse.Parse.Object.fetchAllIfNeeded(client.get("TeamMembers")).then(teamMembers=>{
				console.log(teamMembers);
				for(let teamMember of teamMembers){
					console.log(teamMember.get("HR_Access_Level"));
					if(teamMember.get("HR_Access_Level") === 1){
						admins.push(teamMember);
					}
				}
				if(admins.length > 1){
					return admins[0].get('firstName') + ' ' + admins[0].get('lastName') + ' or ' + admins[1].get('firstName') + ' ' + admins[1].get('lastName');
				}else if(admins.length === 1){
					return admins[0].get('firstName') + ' ' + admins[0].get('lastName');
				}else{
					return;
				}
			});
		});
	}

	updateNotificationsCount (count) {
		
	}

}
