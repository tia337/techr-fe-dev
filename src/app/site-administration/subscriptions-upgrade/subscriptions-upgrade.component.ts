import { Component, OnInit } from '@angular/core';
import { SubscriptionsUpgradeService } from './subscriptions-upgrade.service';
import { UpgradeDataService } from '../shared/upgrade-data.service';
import { RootVCRService } from '../../root_vcr.service';
import { AlertComponent } from '../../shared/alert/alert.component';
import { Router } from '@angular/router';

import { ParseObject } from 'parse';
import { Parse } from '../../parse.service';

@Component({
	selector: 'app-subscriptions-upgrade',
	templateUrl: './subscriptions-upgrade.component.html',
	styleUrls: ['./subscriptions-upgrade.component.scss']
})
export class SubscriptionsUpgradeComponent implements OnInit {

	newTarif: any = '';
	curSubscription: any;
	newTarifName: string = '';
	opositPayingPlan: any;
	client: any;
	today: number = Date.now();
	endPeriod: any;
	upgradingAnnual: boolean;
	subCart: any;
	upgradingInProgress: boolean = false;

	constructor(
		private _SubscriptionsUpgradeService: SubscriptionsUpgradeService,
		private _UpgradeDataService: UpgradeDataService,
		private _parse: Parse,
		private _root_vcr: RootVCRService,
		private _router: Router
	) { }

	ngOnInit() {
		this._UpgradeDataService.getSC().then(subCart=>{
			this.subCart = subCart;
			this.newTarifName = subCart.tarif;
			// console.log(this.newTarifName);
			this.client = this._SubscriptionsUpgradeService.getClient();
			return this._SubscriptionsUpgradeService.currentPlan;
		}).then(res=>{
			if(this.newTarifName === 'professional' || this.newTarifName === 'standard'){
				this.curSubscription = res;
				if(this.subCart.payingplan){
					if(this.subCart.payingplan === 'year'){
						this.upgradingAnnual = true;
						return this._SubscriptionsUpgradeService.getNewPlan(this.newTarifName, 'year', this.curSubscription.get("Currency"))
					}else if(this.subCart.payingplan === 'month'){
						this.upgradingAnnual = false;
						return this._SubscriptionsUpgradeService.getNewPlan(this.newTarifName, 'month', this.curSubscription.get("Currency"))
					}
				}else{
					return this._SubscriptionsUpgradeService.getNewPlan(this.newTarifName, this.curSubscription.get("IntervalString"), this.curSubscription.get("Currency"))
				}
			}
		}).then(res => {
			this.newTarif = res;
			return this._SubscriptionsUpgradeService.getEndPeriod()
		}).then(endPer=>{
			this.endPeriod = endPer.get("CurrentEndPeriod");
			return this._SubscriptionsUpgradeService.getNewOpositPayingPlan(this.newTarif.get("IntervalString"), this.newTarifName, this.newTarif.get("Currency"))
		}).then(res=>{
			this.opositPayingPlan = res;
			// console.log(res);
			if(this.newTarifName === 'month' || this.newTarifName === 'year'){
				this.curSubscription = res;
				this._SubscriptionsUpgradeService.getNewPayingPlan(this.newTarifName, this.curSubscription.get("NameSwipeIn"), this.curSubscription.get("Currency")).then(res=>{
					this.newTarif = res;
				});
			}
		});
	}


	switchPayment(paymentMethod:string) {
		this._SubscriptionsUpgradeService.switchPayment(paymentMethod, this.newTarif.get("NameSwipeIn"), this.newTarif.get("Currency")).then(
			res => {
				this.newTarif = res;
				this.newTarifName = this.newTarif.get("NameSwipeIn");
				return res;}).then(res=>{
			this._SubscriptionsUpgradeService.getEndPeriod().then(res => {
				this.endPeriod = res.get("CurrentEndPeriod");
			});
			this._SubscriptionsUpgradeService.getNewOpositPayingPlan(res.get("IntervalString"), res.get("NameSwipeIn"), res.get("Currency")).then(result=>{
				this.opositPayingPlan = result;
			});
		});
	}

	updatePlan() {
		this.upgradingInProgress = true;
		this._parse.Parse.Cloud.run('stripeUpdatePlan', {planId: this.newTarif.get('StripeIdPlan').toString()}).then(res => {
			this._router.navigate(['/', 'administration', 'billing']);

			const alert = this._root_vcr.createComponent(AlertComponent);

			if (this.curSubscription.get('StripeIdPlan') > this.newTarif.get('StripeIdPlan')) {
				alert.title = 'Congratulations! Downgrade Successful';
			} else {
				alert.title = 'Congratulations! Upgrade Successful';
			}

			alert.content = `
        Your recruitment team is now on <b>` + this.newTarif.get('Name') + `</b> plan
      `;

			alert.addButton({
				title: 'Okay',
				type: 'primary',
				onClick: () => {
					this._root_vcr.clear();
				}
			});
			this.upgradingInProgress = false;
		},error =>{
			// console.log(error);
			this.upgradingInProgress = false;
			const alert = this._root_vcr.createComponent(AlertComponent);
			alert.title = 'Error';
			alert.icon = 'frown-o';
			alert.type = "sad";
			alert.contentAlign = 'left';
			alert.content = `<a>
			Sorry, an error occurred while processing the payment.<br>Check your Internet connection, payment details and try again later.<br>
			<a style = "margin-top:10px">Error: ` + error.code + `</a>` + `Message: ` + error.message + `</a>`;
			alert.addButton({
				title: 'Close',
				type: 'primary',
				onClick: () => this._root_vcr.clear()
			});
		});
	}



}
