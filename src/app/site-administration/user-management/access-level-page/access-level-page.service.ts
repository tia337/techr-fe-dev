import { Injectable } from '@angular/core';
import { Parse } from '../../../parse.service';

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
  
}