import { Injectable } from '@angular/core';
import { ParseObject, ParsePromise } from 'parse';
import * as parse from 'parse';
import { Parse } from '../parse.service';
import { Subject } from 'rxjs/Subject';

@Injectable()

  export class SiteAdministrationService {

  private userRolesRights = [
    'Has access to all company jobs',
    'Has access to jobs where he is a Team Manager',
    'Can access billing & payment details',
    'Can remove users',
    'Can manage user roles',
    'Has access to the following reports'
  ];

  private userRoles = [
    {
      roleName: 'Default',
      roleDescription: 'Some Default Descriptinon',
      roleRights: ['some right 1', 'some right 2']
    }
  ];
  
  newUserRoleSubject = new Subject();

constructor(private _parse: Parse) { }

  getAccessLevel() {
    this._parse.Parse.User.current().fetch().then(res => {
      console.log(res.get('HR_Access_Level'));
    });
    console.log(this._parse.getCurrentUser());
    return this._parse.Parse.User.current().fetch().then(res=>{
        return res.get('HR_Access_Level');
    });
}
  getAdmins() {
    return this._parse.Parse.User.current().get('Client_Pointer').fetch().then(client => {
      console.log(client);
      let admins: any[] = [];
      return this._parse.Parse.Object.fetchAllIfNeeded(client.get('TeamMembers')).then(teamMembers => {
        console.log(teamMembers);
      for (let teamMember of teamMembers){
        console.log(teamMember.get('HR_Access_Level'));
        if (teamMember.get('HR_Access_Level') === 1){
          admins.push(teamMember);
        }
      }
      if (admins.length > 1){
          return admins[0].get('firstName') + ' ' + admins[0].get('lastName') + ' or ' + admins[1].get('firstName') + ' ' + admins[1].get('lastName');
        }else{
          return admins[0].get('firstName') + ' ' + admins[0].get('lastName');
        }
      });
  });
}

  getUserRolesRights() {
    return this.userRolesRights.slice();
  }

  getUserRoles() {
    return this.userRoles.slice();
  }

  addUserRoles(user) {
    this.userRoles.push(user);
    this.newUserRoleSubject.next(user);
  }
}