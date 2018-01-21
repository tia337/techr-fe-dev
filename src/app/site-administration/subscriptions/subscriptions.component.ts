import { Component, OnInit } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ParseObject, ParsePromise } from 'parse';
import * as parse from 'parse';
import { Parse } from '../../parse.service';
import { SubscriptionService } from './subscriptions.service';
import { Router } from '@angular/router';
import { CheckoutServService } from '../shared/checkout-serv.service';
import { UpgradeDataService } from '../shared/upgrade-data.service';
import { RootVCRService } from '../../root_vcr.service';

import { FeedbackAlertComponent } from 'app/core/feedback-alert/feedback-alert.component';

import { ContactUsComponent } from "app/contact-us/contact-us.component";

@Component({
	selector: 'app-subscriptions',
	templateUrl: './subscriptions.component.html',
	styleUrls: ['./subscriptions.component.scss']
})
export class SubscriptionsComponent implements OnInit {

	Subscriptions: ParseObject[];
	standardPrice: any[] = [];
	standardMonthPrice: any[] = [];
	professionalPrice: any[] = [];
	professionalMonthPrice: any[] = [];
	activeSubscription: ParseObject;
	activePlan: string;
	proButton: string;
	standardButton: string;
	client: ParseObject;
	trialActive: boolean;
	trialPeople: number;
	proBackgroundPannel: string;
	standBackgroundPannel: string;
	currency: string = '';

	constructor(
		private _SubscriptionService: SubscriptionService,
		private _CheckoutServService: CheckoutServService,
		private _parse: Parse, private router: Router,
		private _UpgradeDataService: UpgradeDataService,
		private _root_vcr:RootVCRService
	) { }

	ngOnInit() {
		this._SubscriptionService.getTrialActive().then(client => {
			this.trialActive = client.get('IsTrialActive');
			this.client = client;
			if (client.get('IsTrialActive')) {
				this.trialPeople = client.get('TeamMembers').length;
				console.log(this.trialPeople);
			}
		}).then(
			this._parse.getCurrentUser().get('Client_Pointer').fetch().then(Client => {
				return Client.get('ActiveSubscription').fetch();
			}).then(Subscription => {
				this.activeSubscription = Subscription;
				console.log(this.activeSubscription);
				this._SubscriptionService.getActivePlan(this.activeSubscription).then(res => {
					console.log(res);
					this.activePlan = res;
					if (this.activePlan == 'standard') {
						this.standBackgroundPannel = '#e6f2ff';
						this.proButton = 'blue';
					}
					if (this.activePlan == 'professional') {
						this.proBackgroundPannel = '#e6f2ff';
						this.proButton = 'green';
					}
				});
			}));

		this._SubscriptionService.getSubscriptions().then(result => {
			this.Subscriptions = result;
			console.log(this.Subscriptions);
			for (const sub of this.Subscriptions) {
				if (sub.get('NameSwipeIn') == 'standard' && sub.get('IntervalString') == 'year') {
					this.standardPrice.push(sub.get('Amount'));
					this.currency = sub.get('Currency');
					const query = this._parse.Query('Currencies');
					query.equalTo('Currency', sub.get('Currency'));
					query.first().then(results => {
						this.standardPrice.push(results.get('Symbol'));
					});
				}
				if (sub.get('NameSwipeIn') == 'standard' && sub.get('IntervalString') == 'month') {
					this.standardMonthPrice.push(sub.get('Amount'));
				}
				if (sub.get('NameSwipeIn') == 'professional' && sub.get('IntervalString') == 'year') {
					this.professionalPrice.push(sub.get('Amount'));
					const query = this._parse.Query('Currencies');
					query.equalTo('Currency', sub.get('Currency'));
					query.first().then(results => {
						this.professionalPrice.push(results.get('Symbol'));
						this._CheckoutServService.curCurrency.next(results.get('Currency'));
						// this._CheckoutServService.curCurrency.next(results.get('Symbol'));
					});
				}
				if (sub.get('NameSwipeIn') == 'professional' && sub.get('IntervalString') == 'month') {
					this.professionalMonthPrice.push(sub.get('Amount'));
				}

			}
		});
	}


	setNewTarif(newTarif: string, newPrice: number) {
		this._CheckoutServService.curTarif.next(newTarif);
		this._CheckoutServService.curPrice.next(newPrice);
		this._CheckoutServService.createCartObj(newTarif, this.currency, 'year');
	}

	setNewPayingPlan(newTarif: string, payingPlan: string){
		this._UpgradeDataService.createCartObj(newTarif, this.currency, payingPlan).then(res=>{
			this.router.navigate(['/', 'administration', 'subscriptions-upgrade']);
		})
	}

	setUpgradeData(newPlan: string) {
		return this._UpgradeDataService.setNewTarifSC(newPlan).then(()=>{
			return "success";
		});
	}

	redirect() {
		this.router.navigate(['/', 'administration', 'subscriptions-checkout', 'tarifs']);
	}

	redirectBilling() {
		this.router.navigate(['/', 'administration', 'billing']);
	}

	redirectUpgrade(name) {
		this.setUpgradeData(name).then(()=>{
			this.router.navigate(['/', 'administration', 'subscriptions-upgrade']);
		});
	}

	feedbackCreation() {
		this._root_vcr.createComponent(FeedbackAlertComponent);
	}

	contactUs(){
		let contactForm = this._root_vcr.createComponent(ContactUsComponent);
		contactForm.contactType = "beVsGdTy1P";
	}

}
