import { Injectable } from '@angular/core';
import { Parse } from '../../../../parse.service';
import { ParsePromise } from 'parse';

@Injectable()
export class CancelSubscriptionAlertService {

	private _stripeSubscrtiption;

	constructor(private _parse: Parse) { }

	cancelSubscription(subscriptionId: string, cancelationReasonNumber: number, cancelationReasonText?: string) {
		return this._parse.Parse.Cloud.run('deleteSubscription', {subscriptionId: subscriptionId}).then(canceledSubscription => {
			this._stripeSubscrtiption = canceledSubscription;
			console.log(this._stripeSubscrtiption);
			const subscription = new this._parse.Parse.Query('Subscriptions');
			subscription.equalTo('StripeID', canceledSubscription.id);
			return subscription.first();
		}).then(parseSubscription => {
			if (cancelationReasonText) {
				parseSubscription.set('CancelationCustomFeedback', cancelationReasonText);
			}
			parseSubscription.set('CanceledAt', this.toDate(this._stripeSubscrtiption.canceled_at));
			parseSubscription.set('CancelationReason', cancelationReasonNumber);
			parseSubscription.set('IsCanceledAtEndPeriod', this._stripeSubscrtiption.cancel_at_period_end);
			// parseSubscription.set('Status', this._stripeSubscrtiption.status);
			return parseSubscription.save();
		});
		// stripeUpdateSubscription

	}

	private toDate(timestamp: number) {
		return new Date(timestamp * 1000);
	}

	getDiscount(couponId: string) {

		let currentUser;

		return this.getCurrentUser().then(me => {
			currentUser = me;

			return this._parse.Parse.Cloud.run('stripeUpdateSubscription', {
				subscriptionId: me.get('Client_Pointer').get('ActiveSubscription').get('StripeID'),
				args: {
					coupon: couponId
				}
			});

		}).then(stripeSubscription => {
			console.log('stripe-to-be-deleted updated subscription: ', stripeSubscription);

			const client = currentUser.get('Client_Pointer');
			client.set('IsCancelationOfferRedeemed', true);
			client.set('CancelationOfferRedeemDate', this.toDate(stripeSubscription.discount.start));
			return client.save();

		});

	}

	getCurrentUser() {
		// return this._parse.Parse.User.current().fetch();

		const me = new this._parse.Parse.Query('User');
		me.include('Client_Pointer');
		me.include('Client_Pointer.ActiveSubscription');
		return me.get(this._parse.Parse.User.current().id);
	}

	// get currentClient() {
	//   const clientQuery = new this._parse.Parse.Query('Clients');
	//   clientQuery.include('ActiveSubscription');
	//   return clientQuery.get(this._parse.Parse.User.current().get('Client_Pointer').id);
	// }

}
