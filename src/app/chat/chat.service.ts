import { Injectable } from '@angular/core';
import { ParseObject } from 'parse';
import { Parse } from '../parse.service';
import * as _ from 'underscore';

import { environment } from './../../environments/environment';

@Injectable()
export class ChatService {

private _global;
private _stripe;

constructor(private _parse: Parse) {

}

getUserMessages(dialogId) {
    console.log(dialogId.id);
    return this._parse.execCloud('getMessages', {dialog: dialogId.id});
};

}
