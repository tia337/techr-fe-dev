import { Injectable } from '@angular/core';
import { Parse } from '../../../parse.service';

@Injectable()
export class BillingHistoryService {

	constructor(private _parse: Parse) { }

	getInvoices() {
		return this._parse.Parse.Cloud.run('getInvoices');
	}

}
