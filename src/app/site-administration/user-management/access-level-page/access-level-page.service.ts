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

  

  getUserRoles(): Promise<any> {
    const promise = new Promise ((resolve, reject) => {
      const clientId = this._parse.getClientId();
      this._parse.execCloud('getUserRoles', { clientId }).then(data => {
        resolve(data);
        reject(data);
      });
    });
    return promise;
  }

  getTeamMembersUserRoles(roleName: string) {
    const promise = new Promise ((resolve, reject) => {
      const clientId = this._parse.getCurrentUser().get('Client_Pointer').id;
      this._parse.execCloud('getTeamMembersUserRoles', {clientId: clientId, roleName: roleName }).then(data => {
        resolve(data);
        reject(data);
      });
    });
    return promise;
  }

}
