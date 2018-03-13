import { Injectable } from '@angular/core';
import { ParseObject } from 'parse';
import { Parse } from '../parse.service';
import * as _ from 'underscore';

import { environment } from './../../environments/environment';

@Injectable()
export class ChatService {

constructor(private _parse: Parse) {}

getUserMessages(id) {
   const data = {
       dialogId: id
   };
    return this._parse.execCloud('getMessages', {dialogId: data.dialogId}).then(result => {
        return result;
    });
};

}
