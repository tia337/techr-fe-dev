import { Injectable } from '@angular/core';
import { ParseObject }  from 'parse';
import { Parse } from '../../parse.service';
import { StripeService } from '../../shared/services/stripe.service';

@Injectable()
export class SubscriptionsUpgradeService {

	constructor(private _parse: Parse, private _stripe: StripeService) { }


	getPlanId(interval:string, tarifName: string){
		const query = this._parse.Query("Plans");
		query.equalTo("IntervalString", interval);
		query.equalTo("Currency", "GBP");
		query.equalTo("NameSwipeIn", tarifName);
		return query.first().then(results => {
			return results.get("StripeIdPlan");
		});
	}

	// END OF STRIPE FUNCTIONS

	get currentPlan(){
		return this._parse.getCurrentUser().get("Client_Pointer").fetch().then(Client => {
			return Client.get("ActiveSubscription").fetch().then(res => {
				const activeSub: number = +res.get("StripePlanID");
				let query = this._parse.Query("Plans");
				query.equalTo("StripeIdPlan", activeSub);
				return query.first();
			});
		});
	}
	getNewPlan(name: string, paying: string, currency: string){
		const query = this._parse.Query("Plans");
		query.equalTo("NameSwipeIn", name);
		query.equalTo("IntervalString", paying);
		query.equalTo("Currency", currency);
		return query.first().then(results => {
			return results;
		});
	}
	getNewOpositPayingPlan(paying: string, name: string, currency: string){
		const query = this._parse.Query("Plans");
		if (paying === "month") {
			query.equalTo("IntervalString", 'year');
		}
		if (paying === "year") {
			query.equalTo("IntervalString", 'month');
		}
		query.equalTo("NameSwipeIn", name);
		query.equalTo("Currency", currency);
		return query.first().then(results => {
			return results;
		});
	}

	getEndPeriod(){
		return this._parse.getCurrentUser().get("Client_Pointer").fetch().then(res=>{
			return res.get("ActiveSubscription").fetch();
		});
	}

	getNewPayingPlan(paying: string, name: string, currency: string){
		const query = this._parse.Query("Plans");
		query.equalTo("IntervalString", paying);
		query.equalTo("NameSwipeIn", name);
		query.equalTo("Currency", currency);
		return query.first().then(results => {
			return results;
		});
	}

	getClient(){
		return this._parse.getCurrentUser().get("Client_Pointer")
	}

	switchPayment(paymentMethod: string, name: string, currency: string){
		let query = this._parse.Query("Plans");
		query.equalTo("IntervalString", paymentMethod);
		query.equalTo("NameSwipeIn", name);
		query.equalTo("Currency", currency);
		return query.first().then(results => {
			return results;
		});
	}
}
