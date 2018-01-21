import { Injectable } from '@angular/core';
import { Parse } from '../../../parse.service';

@Injectable()
export class BillingOverviewService {

	constructor(private _parse: Parse) { }

	getCurrentClient() {
		const clientQuery = new this._parse.Parse.Query('Clients');
		clientQuery.include('ActiveSubscription');
		return clientQuery.get(this._parse.Parse.User.current().get('Client_Pointer').id);

		// return this._parse.Parse.User.current().get('Client_Pointer').fetch();
	}

	isTrialActive() {
		const clientQuery = new this._parse.Parse.Query('Clients');
		return clientQuery.get(this._parse.Parse.User.current().get('Client_Pointer').id).then(client => {
			return client.get('IsTrialActive');
		});
	}

	// getActiveSubscription() {
	//   return this._parse.Parse.User.current().get('Client_Pointer').fetch().then(parseClient => {
	//     return parseClient.get('ActiveSubscription').fetch();
	//   });
	// }

	getUpcomingInvoice() {
		return this._parse.Parse.Cloud.run('getUpcomingInvoice').then(res=>{
			console.log(res);
			return res;
		});
	}

	getStripeCustomer(customerId: string) {
		return this._parse.Parse.Cloud.run('getStripeCustomer', {customerId: customerId});
	}

	getSubscription(subscriptionId: string) {
		return this._parse.Parse.Cloud.run('getStripeSubscription', {subscriptionId: subscriptionId});
	}

	getParsePlan(planId: number) {
		const planQuery = new this._parse.Parse.Query('Plans');
		planQuery.equalTo('StripeIdPlan', planId);
		return planQuery.first();
	}

	reactivateSubscription(subscriptionId: string) {
		return this._parse.Parse.Cloud.run('reactivateSubscription', {subscriptionId: subscriptionId});
	}

	getInvoices(subscriptionId: string) {
		return this._parse.Parse.Cloud.run('getInvoices', {subscription: subscriptionId});
	}

	// cancelSubscription(subscriptionId: string) {
	//   return this._parse.Parse.Cloud.run('deleteSubscription', {subscriptionId: subscriptionId});
	// }

}
