import { Injectable } from '@angular/core';
import { Parse } from '../../../parse.service';
//tslint:disable:indent
@Injectable()
export class AccessLevelPageService {

  constructor(private _parse: Parse) {}

  findUsersByAL(al: number) {
    let currentUser = this._parse.Query('User');
    currentUser.equalTo('objectId', this._parse.getCurrentUser().id);
    currentUser.include('Client_Pointer');
    return currentUser.first().then( current => {

      let user = this._parse.Query('User');
      user.include('Client_Pointer');
      user.equalTo('Client_Pointer', current.get('Client_Pointer'));
      user.equalTo('HR_Access_Level', al);
      return user.find().then( userObject => {
        return userObject;
      });
    });
  }

  setCurrentAccessLevel(roleName) {
    console.log(roleName.role);
    this.getTeamMembersUserRoles().then(data => {
      console.log('Team Members User Roles', data);
    });
  }

  getUserRoles() {
    const clientId = this._parse.getCurrentUser().get('Client_Pointer').id;
    return this._parse.execCloud('getUserRoles', {clientId});
  }

  getTeamMembersUserRoles() {
    const clientId = this._parse.getCurrentUser().get('Client_Pointer').id;
    return this._parse.execCloud('getTeamMembersUserRoles', {clientId: clientId});
  }

}
