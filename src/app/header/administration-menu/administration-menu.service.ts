import { Injectable } from '@angular/core';
import { ParseObject, ParsePromise } from 'parse';
import * as parse from 'parse';
import { Parse } from '../../parse.service';

@Injectable()
export class AdministrationMenuService {

  constructor(private _parse: Parse) { }

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
}
