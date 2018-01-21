import { Component, OnInit } from '@angular/core';
import { BillingOverviewService } from './billing-overview.service';
import { ParseObject } from 'parse';
import { RootVCRService } from '../../../root_vcr.service';
import { Router } from '@angular/router';
import { CancelSubscriptionAlertComponent } from './cancel-subscription-alert/cancel-subscription-alert.component';
import { Loading } from '../../../shared/utils';
import { AlertComponent } from '../../../shared/alert/alert.component';
import { UpgradeDataService } from '../../shared/upgrade-data.service';
import { Parse } from '../../../parse.service';

import { ContactUsComponent } from 'app/contact-us/contact-us.component';

@Component({
	selector: 'app-billing-overview',
	templateUrl: './billing-overview.component.html',
	styleUrls: ['./billing-overview.component.scss']
})
export class BillingOverviewComponent implements OnInit {

	client: ParseObject;
	isTrial: boolean;
	subscription;
	parsePlan;
	upcomingSubscriptionItem;
	unpaidInvoice;
	// addons;
	// stripeCustomer;
	loader = Loading.loading;

	upcomingInvoice;

	dafaultCard;

	constructor(
		private _billingOverviewService: BillingOverviewService,
		private _root_vcr: RootVCRService,
		private router: Router,
		private _UpgradeDataService: UpgradeDataService,
		private _parse: Parse
	) { }

	ngOnInit() {
		this.initBillingOverview();
	}

	initBillingOverview() {
		this._billingOverviewService.getCurrentClient().then(client => {
			this.client = client;
			this.isTrial = client.get('IsTrialActive');
			if (this.isTrial) {
				this.loader = Loading.success;
			}

			if (!this.isTrial && client.has('stripeCustomerId')) {
				this.initBillingInfo(client).then(() => {
					this.loader = Loading.success;
				}, error => {
					console.error(error);
				}).fail(e => {
					console.error(e);
				});
			}
		});
	}

	initBillingInfo(client) {
		const promises = [];
		promises.push(this.getUpcomingInvoice());

		const stripeCustomerPromise = this._billingOverviewService.getStripeCustomer(client.get('stripeCustomerId')).then(stripeCustomer => {
			this.dafaultCard = stripeCustomer.sources.data.find(source => {
				return source.object === 'card' && source.id === stripeCustomer.default_source;
			});
		}, error => {
			console.error(error);
		});
		promises.push(stripeCustomerPromise);
		return this._parse.Parse.Promise.when(promises);
	}

	getUpcomingInvoice() {
		this.upcomingInvoice = null;
		this.subscription = null;
		this.upcomingSubscriptionItem = null;

		if (this.client.has('ActiveSubscription')) {
		return this._billingOverviewService.getSubscription(this.client.get('ActiveSubscription').get('StripeID'))
			.then(subscription => {
				console.log('SUBSCRIPTION: ', subscription);
				this.subscription = subscription;
				// return subscription;
			// }).then(stripeSubscription => {
				const planId = parseInt(subscription.plan.id, 10);
				return this._billingOverviewService.getParsePlan(planId);
			}).then(plan => {
				this.parsePlan = plan;
				return this._billingOverviewService.getUpcomingInvoice();
			}).then(invoice => {
				console.log(invoice);
				this.upcomingInvoice = invoice;
				if (invoice) {
					this.upcomingSubscriptionItem = invoice.lines.data.find(lineItem => {
						return lineItem.id === this.subscription.id;
					});
				}
				console.log(invoice);
				return invoice;
			}, error => {
				console.log('something went wrong');
				this.upcomingInvoice = null;
				console.error(error);
			}).then(() => {
				// if (this.subscription.status === 'unpaid')
					return this._billingOverviewService.getInvoices(this.subscription.id);
				// else return this._parse.Parse.Promise.error('break');
			}).then(invoices => {
				console.log('INVOICES: ', invoices);
				this.unpaidInvoice = invoices
					.sort((a, b) => b.date - a.date)
					.filter(invoice => invoice.subscription === this.subscription.id && !invoice.forgiven)
					.find(invoice => !invoice.paid && invoice.attempted);
				// console.log('UNPAID INVOICE: ', this.unpaidInvoice);

			}).fail(e => {
				if (e !== 'break')
					console.error(e);
			});
		} else {
			this.loader = Loading.success;
		}
	}

	toDate(timestamp: number) {
		return new Date(timestamp * 1000);
	}

	cancelSubscription() {
		const alert = this._root_vcr.createComponent(CancelSubscriptionAlertComponent);
		alert.subscriptionId = this.subscription.id;
		alert.nextPeriodStart = this.toDate(this.upcomingInvoice.period_start);
		alert.nextPeriodEnd = this.toDate(this.upcomingInvoice.period_end);
		alert.updateInvoice = () => this.getUpcomingInvoice();

		// this._billingOverviewService.cancelSubscription(this.subscription.id).then(response => {
		//   this.client.set('ActiveSubscription', null);
		//   return this.client.save();
		// }).then(() => {
		//   this.getUpcomingInvoice();
		// });
	}

	reactivateSubscription() {
		const alert = this._root_vcr.createComponent(AlertComponent);
		alert.title = 'Reactivate Subscription';
		alert.content = `By reactivating your account you will keep your same billing cycle and subscription. <br/>
		You can change it any time on your subscription section`;
		alert.addButton({
			title: 'Yes, Reactivate',
			type: 'primary',
			onClick: () => {
				this._billingOverviewService.reactivateSubscription(this.subscription.id).then(res => {
					console.log(res);
					this.initBillingInfo(this.client);
					this._root_vcr.clear();
				});
			}
		});


		// subscriptionId
		// console.log(this.subscription.id);
		// console.log(this.subscription.id);

	}

	upgrade() {

	}

	downgrade() {

	}

	get Loading() {
		return Loading;
	}

	setNewPayingPlan(){
		console.log(this.parsePlan);
		let payingPlan : string;
		if(this.parsePlan.get('IntervalString') == 'year'){
			payingPlan = 'month';
		}else if(this.parsePlan.get('IntervalString') == 'month'){
			payingPlan = 'year';
		}
		this._UpgradeDataService.createCartObj(this.parsePlan.get('NameSwipeIn'), this.parsePlan.get('Currency'), payingPlan).then(res=>{
			this.router.navigate(['/', 'administration', 'subscriptions-upgrade']);
		});
	}

	contactUs(){
		let contactForm = this._root_vcr.createComponent(ContactUsComponent);
		contactForm.contactType = "eWOOHBiZlT";
	}
	contactUsSales(){
		let contactForm = this._root_vcr.createComponent(ContactUsComponent);
		contactForm.contactType = "beVsGdTy1P";
	}

	payAnUnpaidInvoice() {
		this._parse.Parse.Cloud.run('payInvoice', {invoice: this.unpaidInvoice.id}).then(res => {
			console.log(res);
			this.initBillingOverview();
			this.unpaidInvoice = null;
			const alert = this._root_vcr.createComponent(AlertComponent);
			alert.title = 'Invoice was successfully paid';
			alert.content = 'Thank you, invoice was successfully paid';
			alert.type = 'happy';
			alert.addButton({
				type: 'primary',
				title: 'Okay',
				onClick: () => {
					this._root_vcr.clear();
				}
			});

		}, error => {
			console.error(error);
			const errorAlert = this._root_vcr.createComponent(AlertComponent);
			errorAlert.title = 'Ooops, something went wrong';
			errorAlert.content = 'Error: ' + error.message.raw.message;
			errorAlert.type = 'sad';
			errorAlert.addButton({
				type: 'primary',
				title: 'Okay',
				onClick: () => {
					this._root_vcr.clear();
				}
			});
		});
	}

}
