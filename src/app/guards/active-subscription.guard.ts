import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Parse } from '../parse.service';
import { RootVCRService } from '../root_vcr.service';
import { AlertComponent } from '../shared/alert/alert.component';
import { DatePipe } from '@angular/common';

@Injectable()
export class ActiveSubscriptionGuard implements CanActivate {

	constructor(
		private _parse: Parse,
		private _router: Router,
		private _root_vcr: RootVCRService,
		private _date: DatePipe
	) { }

	canActivate(): Observable<boolean> | Promise<boolean> | boolean {
		return true;
		// const user = this._parse.Parse.User.current().toJSON();
		// let currentClient;
		// return this._parse.Parse.User.current().get('Client_Pointer').fetch().then(client => {
		// 	currentClient = client.toJSON();
		// 	if (client.get('IsTrialActive') === true) {
		// 		// Client is still on trial
		// 		return new this._parse.Parse.Promise.error(true);
		// 	} else if (!client.get('IsTrialActive') && client.has('ActiveSubscription')) {
		// 		// retrieving active subscription
		// 		return client.get('ActiveSubscription').fetch();
		// 	} else {
		// 		// Client doesn't have active subscription
		// 		const subscriptionQuery = new this._parse.Parse.Query('Subscriptions');
		// 		subscriptionQuery.equalTo('Client', client.toPointer());
		// 		subscriptionQuery.descending('updatedAt');
		// 		return subscriptionQuery.first();
		// 	}
		// }).then(subscription => {
		// 	if (!subscription) {
		// 		// Client's trial period is finished and he didn't buy a subscription
		// 		const title = 'Your trial period expired!';
		// 		const content = `
		// 			Hi ` + user.firstName + `, the trial period for ` + currentClient.ClientName + ` expired on ` + this._date.transform(currentClient.TrialExpiresOn.iso, 'shortDate') + `
		// 			<br/>
		// 			you need an active Subscription, in order to use the SwipeIn Services
		// 		`;

		// 		this.alert(title, content).addButton({
		// 			type: 'primary',
		// 			title: 'Go to Subscriptions',
		// 			onClick: () => {
		// 				this._router.navigate(['/', 'administration', 'subscriptions']);
		// 				this._root_vcr.clear();
		// 			}
		// 		});
		// 		return false;
		// 	}
		// 	if (subscription.get('Status') == 'active') {
		// 		// Subscription active
		// 		return true;
		// 	} else if (subscription.get('Status') == 'unpaid') {
		// 		// Client's subscription is unpaid

		// 		const title = 'Unpaid subscription, renew payment method';
		// 		const content = `
		// 			Hi ` + user.firstName + `, we could not process the payment to renew the subscription for ` + currentClient.ClientName + `.
		// 			<br/>
		// 			Update payment method to continue using SwipeIn Services
		// 		`;

		// 		this.alert(title, content).addButton({
		// 			type: 'primary',
		// 			title: 'Go to payment methods',
		// 			onClick: () => {
		// 				this._router.navigate(['/', 'administration', 'billing']);
		// 				setTimeout(() => {
		// 					this._router.navigate(['/', 'administration', 'billing', { outlets: { 'billing-sections': ['payment-details'] }}], {skipLocationChange: true});
		// 				}, 0);
		// 				this._root_vcr.clear();
		// 			}
		// 		});
		// 		return false;
		// 	} else if (subscription.get('Status') == 'canceled') {
		// 		// Client canceled subscription

		// 		const title = 'New subscription required';
		// 		const content = `
		// 			Hi ` + user.firstName + `, the subscription for ` + currentClient.ClientName + ` was canceled on ` + this._date.transform(subscription.get('CanceledAt'), 'shortDate') + `
		// 			<br/>
		// 			You need a new subscription to access SwipeIn Services
		// 		`;

		// 		this.alert(title, content).addButton({
		// 			type: 'primary',
		// 			title: 'Go to Subscriptions',
		// 			onClick: () => {
		// 				this._router.navigate(['/', 'administration', 'subscriptions']);
		// 				this._root_vcr.clear();
		// 			}
		// 		});

		// 		return false;
		// 	}
		// }).fail(e => {
		// 	if (e === true) {
		// 		return true;
		// 	} else {
		// 		console.error(e);
		// 	}
		// });
	}

	canActivateChild(): Observable<boolean> | Promise<boolean> | boolean {
		return this.canActivate();
	}

	private alert(title: string, content: string): AlertComponent {
		const alert = this._root_vcr.createComponent(AlertComponent);
		alert.type = 'sad';
		alert.title = title;
		alert.content = content;
		return alert;
	}
}
