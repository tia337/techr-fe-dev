import { Injectable } from '@angular/core';
import { Parse } from '../parse.service';
import { Login } from 'app/login.service';


@Injectable()
export class DashboardService {

	currentUser;
	isFirst;

	constructor(private _parse: Parse, private _login: Login) { }

	getClient() {
		const clientQuery = new this._parse.Parse.Query('Clients');
		clientQuery.include('ActiveSubscription.StripePlanID');
		return clientQuery.get(this._parse.Parse.User.current().get('Client_Pointer').id);
	}

	checkContractsCount() {
		const q = this._parse.Query('Contract');
		q.equalTo('Client', this._parse.Parse.User.current().get('Client_Pointer'));
		q.equalTo('status', 1);
		return q.count();
	}

	getPlan(stripeId: string) {
		const planQuery = new this._parse.Parse.Query('Plans');
		planQuery.equalTo('StripeIdPlan', parseInt(stripeId, 10));
		planQuery.include('NameSwipeIn');
		return planQuery.first();
	}

}
