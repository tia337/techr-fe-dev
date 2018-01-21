import { Parse } from '../../parse.service';
import { Injectable } from '@angular/core';

@Injectable()
export class ErpService {

constructor(private _parse: Parse) {}
    getCurrentUserId() {
		return this._parse.Parse.User.current().id;
	}
}