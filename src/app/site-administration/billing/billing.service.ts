import { Injectable } from '@angular/core';
import { ParseObject, ParsePromise } from 'parse';
import * as parse from 'parse';
import { Parse } from '../../parse.service';


@Injectable()
export class BillingService {

Parse;

  constructor(
    private _parse: Parse
  ) { }

  getAccessLevel(){
    this._parse.Parse.User.current().fetch().then(res=>{
        console.log(res.get("HR_Access_Level"));
    });
    console.log(this._parse.getCurrentUser());
    // return this._parse.getCurrentUser().get("HR_Access_Level");
    }

    test(){
      console.log("testservice");
    }
}
