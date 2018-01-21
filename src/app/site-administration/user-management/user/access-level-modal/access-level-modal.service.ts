import { Injectable } from '@angular/core';
import { Parse } from '../../../../parse.service';

@Injectable()
export class AccessLevelModalService {

  constructor(private _parse: Parse) {}

  getUserAccessLevel(userId: string): any {

    let user = this._parse.Query('User');
    user.equalTo('objectId', userId);
    return user.first().then( userObject => {
      return userObject.get('HR_Access_Level');
    });

  }

  getCurrentUserAccessLevel(): any {
    return this.getUserAccessLevel(this._parse.getCurrentUser().id);
  }

  getSiteAdmin() {
    let currentUser = this._parse.Query('User');
    currentUser.equalTo('objectId', this._parse.getCurrentUser().id);
    currentUser.include('Client_Pointer');
    return currentUser.first().then( current => {

      let user = this._parse.Query('User');
      user.include('Client_Pointer');
      user.equalTo('Client_Pointer', current.get('Client_Pointer'));
      user.equalTo('HR_Access_Level', 1);
      return user.first().then( userObject => {
        return {
          name: userObject.get('firstName'),
          surname: userObject.get('lastName'),
          email: userObject.get('Work_email')

        };
      });

    });
  }

}