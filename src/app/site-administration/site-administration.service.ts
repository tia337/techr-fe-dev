import { Injectable } from '@angular/core';
import { ParseObject, ParsePromise } from 'parse';
import * as parse from 'parse';
import { Parse } from '../parse.service';
import { Subject } from 'rxjs/Subject';
//tslint:disable:indent
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

  private recruitmentTeams= [ ];
  
  newUserRoleSubject = new Subject();

  constructor(private _parse: Parse) { }

  getAccessLevel() {
    this._parse.Parse.User.current().fetch().then(res => {
      // console.log(res.get('HR_Access_Level'));
    });
    // console.log(this._parse.getCurrentUser());
    return this._parse.Parse.User.current().fetch().then(res => {
        return res.get('HR_Access_Level');
    });
}
  getAdmins() {
    return this._parse.Parse.User.current().get('Client_Pointer').fetch().then(client => {
      // console.log(client);
      let admins: any[] = [];
      return this._parse.Parse.Object.fetchAllIfNeeded(client.get('TeamMembers')).then(teamMembers => {
        // console.log(teamMembers);
      for (let teamMember of teamMembers){
        // console.log(teamMember.get('HR_Access_Level'));
        if (teamMember.get('HR_Access_Level') === 1){
          admins.push(teamMember);
        }
      }
      if (admins.length > 1) {
          return admins[0].get('firstName') + ' ' + admins[0].get('lastName') + ' or ' + admins[1].get('firstName') + ' ' + admins[1].get('lastName');
        }else {
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

  addNewRecruitmentTeam(recruitmentTeam) {
    this.recruitmentTeams.push(recruitmentTeam);
  }

  getRecruitmentTeams() {
    return this.recruitmentTeams.slice();
  }
  
  getTeamMembers() {
    const team = [];
    let i = 0;
    const client = this._parse.getCurrentUser().get('Client_Pointer');
    let clientId;
    if (client) {
        clientId = this._parse.getCurrentUser().get('Client_Pointer').id;
    }
    const query = this._parse.Query('Clients');
    query.include('TeamMembers');
    return query.get(clientId).then(clientC => {
        clientC.get('TeamMembers').forEach(teamMember => {
        team[i] = {
            name: `${teamMember.get('firstName')} ${teamMember.get('lastName')}`,
            teamMemberPoint: teamMember.toPointer(),
            id: teamMember.id,
            checked: false,
            type: 'user',
        };
        i++;
        });
        return (team);
    });
  }

  getInitialUserRights() {
    const rights = [];
    this._parse.execCloud('getUserRights', {}).then(data => {
      data.forEach(right => {
        const item = {
          id: right.get('rightId'),
          description: right.get('rightDesc')
        };
        rights.push(item);
      });
      localStorage.setItem('roles', JSON.stringify(rights));
    });
    return rights;
  }

}
