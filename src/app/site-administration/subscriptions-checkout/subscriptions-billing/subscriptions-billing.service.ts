import { Injectable } from '@angular/core';
import { CheckoutServService } from '../../shared/checkout-serv.service'
import { ParseObject }  from 'parse';
import { Parse } from '../../../parse.service';

@Injectable()
export class SubscriptionsBillingService {

	constructor(private _CheckoutServService: CheckoutServService,private _parse: Parse) { }

	getAmountOfUsers() {
		const curClient: string = this._parse.getCurrentUser().get('Client');
		const query = this._parse.Query('Clients');
		query.equalTo('ClientName', curClient);
		return query.first().then(results => {
			return results
		});
	}

	getMonthlyPrice() {
		const query = this._parse.Query('Plans');
		query.equalTo('IntervalString', 'month');
		query.equalTo('Currency', 'GBP');
		query.equalTo('NameSwipeIn', this._CheckoutServService.curTarif.value);
		query.first().then(results => {
			this._CheckoutServService.monthlyPrice.next(results.get('Amount'));
		});
	}

	getAnuallyPrice() {
		const query = this._parse.Query('Plans');
		query.equalTo('IntervalString', 'year');
		query.equalTo('Currency', 'GBP');
		query.equalTo('NameSwipeIn', this._CheckoutServService.curTarif.value);
		query.first().then(results => {
			this._CheckoutServService.curPrice.next(results.get('Amount'));
		});
	}

	getPlan(period, type, currency) {
		const plan = new this._parse.Parse.Query('Plans');
		plan.equalTo('Currency', currency);
		plan.equalTo('IntervalString', period);
		plan.equalTo('NameSwipeIn', type);
		return plan.first();
	}

	getClient() {
		return this._parse.Parse.User.current().get('Client_Pointer').fetch();
	}

	getStripeCustomer() {
		const clientQuery = new this._parse.Parse.Query('Clients');
		return clientQuery.get(this._parse.Parse.User.current().get('Client_Pointer').id).then(client => {
			if (client.get('stripeCustomerId')) {
				return this._parse.Parse.Cloud.run('getStripeCustomer', { customerId: client.get('stripeCustomerId') });
			} else {
				return null;
			}
		});
	}

	subscribeCustomerToPlan(planId: string, tokenId?: string, trial?) {
		// console.log("zero check");
		return this._parse.Parse.User.current().get('Client_Pointer').fetch().then(client => {
			if (!client.get('stripeCustomerId') && tokenId) {
				// console.log("first if");
				return this._parse.Parse.Cloud.run('createStripeCustomer', {
					email: this._parse.Parse.User.current().get('Work_email'),
					clientName: client.get('ClientName'),
					source: tokenId
				});
			} else if (client.get('stripeCustomerId') && tokenId) {
				// console.log("second if");
				return this._parse.Parse.Cloud.run('stripeAddCard', {tokenId: tokenId});
			}
		}, error => {
			// console.log("promise error");
			return this._parse.Parse.Promise.error(error);
		}).then(res => {
			// console.log("promise error fail");
			const args = {
				planId: planId,
				trial_end: undefined
			};

			if (trial) {
				args.trial_end = trial;
			}
			return this._parse.Parse.Cloud.run('subscribeCustomerToPlan', args);
		}).then(res=>{
			return res;
		});
	}

	deactivateTrial() {
		const client = this._parse.Parse.User.current().get('Client_Pointer');
		client.set('IsTrialActive', false);
		return client.save();
	}
}
