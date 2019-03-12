import { Component, OnInit } from '@angular/core';
import { CheckoutServService } from '../../shared/checkout-serv.service';
import { SubscriptionsBillingService } from './subscriptions-billing.service';
import { FormBuilder } from '@angular/forms';
import { StripeService } from '../../../shared/services/stripe.service';
import { RootVCRService } from '../../../root_vcr.service';
import { AddCardComponent } from '../../../shared/stripe/add-card/add-card.component';
import { Loading } from '../../../shared/utils';
import { AlertComponent } from '../../../shared/alert/alert.component';
import { Router } from '@angular/router';

@Component({
	selector: 'app-subscriptions-billing',
	templateUrl: './subscriptions-billing.component.html',
	styleUrls: ['./subscriptions-billing.component.scss']
})
export class SubscriptionsBillingComponent implements OnInit {

	curTarif: string = '';
	anualPrice: number;
	curCurrency: string;
	monthlyPrice: number;
	curPayingPlan: string;
	teamMembers: number;
	private _subscriptionPeriod;
	private _client;


	private _cardNumber;
	private _cardCvc;
	private _cardExpiry;
	private _postalCode;

	private error: any;

	defaultPaymentSource;

	loading = Loading.loading;

	transactionActive: boolean = false;

	// stripeCustomer;
	hasCustomer: boolean;

	constructor(
		private _CheckoutServService: CheckoutServService,
		private _SubscriptionBillingService: SubscriptionsBillingService,
		private _formBuilder: FormBuilder,
		private _stripe: StripeService,
		private _root_vcr: RootVCRService,
		private _router: Router
	) { }

	ngOnInit() {

		// this.loading = Loading.loading;

		this._SubscriptionBillingService.getStripeCustomer().then(res => {
			// this.loading = Loading.success;
			console.log(res);
			if (res) {
				this.hasCustomer = true;
				// this.stripeCustomer = res;
				this.defaultPaymentSource = res.sources.data.find(source => {
					return source.id == res.default_source;
				});

				if (!this.defaultPaymentSource) {
					const elements = this._stripe.stripe.elements();

					const style = {
						base: {
							fontSize: '16px',
							lineHeight: '30px'
						}
					};

					this.loading = Loading.success;

					this._cardNumber = elements.create('cardNumber', {style});
					this._cardCvc = elements.create('cardCvc', {style});
					this._cardExpiry = elements.create('cardExpiry', {style});
					this._postalCode = elements.create('postalCode', {style});

					setTimeout(() => {
						this._cardNumber.mount('#card-number');
						this._cardCvc.mount('#card-cvc');
						this._cardExpiry.mount('#card-expiry');
						this._postalCode.mount('#postal-code');
					}, 0);
				}

				this.loading = Loading.success;
			} else {
				this.hasCustomer = false;
				const elements = this._stripe.stripe.elements();

				const style = {
					base: {
						fontSize: '16px',
						lineHeight: '30px'
					}
				};

				this.loading = Loading.success;

				this._cardNumber = elements.create('cardNumber', {style});
				this._cardCvc = elements.create('cardCvc', {style});
				this._cardExpiry = elements.create('cardExpiry', {style});
				this._postalCode = elements.create('postalCode', {style});

				setTimeout(() => {
					this._cardNumber.mount('#card-number');
					this._cardCvc.mount('#card-cvc');
					this._cardExpiry.mount('#card-expiry');
					this._postalCode.mount('#postal-code');
				}, 0);

			}
		}, error => {
			console.log(error);
			this.loading = Loading.error;
		});

		this._SubscriptionBillingService.getClient().then(client => {
			this._client = client;
		});

		this._CheckoutServService.curTarif.subscribe(curTarif => {
			this.curTarif = curTarif;
		});
		this._CheckoutServService.curPrice.subscribe(curPrice => {
			this.anualPrice = curPrice;
		});
		this._CheckoutServService.curCurrency.subscribe(curCurrency => {
			this.curCurrency = curCurrency;
		});
		this._CheckoutServService.monthlyPrice.subscribe(monthlyPrice => {
			this.monthlyPrice = monthlyPrice;
		});
		this._CheckoutServService.curPayingPlan.subscribe(curPayingPlan => {
			this._subscriptionPeriod = curPayingPlan;
			if (curPayingPlan == 'year') {
				this.curPayingPlan = 'anually';
			}
			if (curPayingPlan == 'month') {
				this.curPayingPlan = 'monthly';
			}
		});
		if(!this.curCurrency) {
			this._CheckoutServService.getCartObj().then(() => {
				this._SubscriptionBillingService.getAmountOfUsers().then(results => {
					this._SubscriptionBillingService.getAnuallyPrice();
					this._SubscriptionBillingService.getMonthlyPrice();
					this.teamMembers = results.get('TeamMembers').length;
				});
			});
		} else {
			this._SubscriptionBillingService.getAmountOfUsers().then(results => {
				this.teamMembers = results.get('TeamMembers').length;
			});
		}

	}

	subscribeNewCustomer() {
		let planId;
		this.transactionActive = true;
		this._SubscriptionBillingService.getPlan(this._subscriptionPeriod, this.curTarif, this.curCurrency).then(plan => {
			// console.log("new test");
			planId = plan.get('StripeIdPlan');
			return this._stripe.stripe.createToken(this._cardNumber);
		}).then(token => {
			if(token.token){
				if (this.hasCustomer && this.defaultPaymentSource) {
					// console.log("subscribeCustomerToPlan 1");
					return this._SubscriptionBillingService.subscribeCustomerToPlan(planId);
				} else {
					// console.log("subscribeCustomerToPlan 2");
					return this._SubscriptionBillingService.subscribeCustomerToPlan(planId, token.token.id);
				}
			}else if(token.error){
				if(!this.error)
					console.log("error:");
				console.log(token.error);
				this.error = token.error;
			}
		}).then(res => {
			if(!this.error)
				return this._SubscriptionBillingService.deactivateTrial();
		}, error =>{
			// console.log("error:");
			console.log(error);
			this.error = error;
		}).then(() => {
			this.transactionActive = false;
			if(!this.error){
				this.showAlert();
			}else{
				this.showErrorAlert(this.error);
			}

		});
	}

	subscribeExistingCustomer() {
		this.transactionActive = true;
		this._SubscriptionBillingService.getPlan(this._subscriptionPeriod, this.curTarif, this.curCurrency).then(plan => {
			return this._SubscriptionBillingService.subscribeCustomerToPlan(plan.get('StripeIdPlan'));
		}).then(res => {
			console.log(res);
			return this._SubscriptionBillingService.deactivateTrial();
		},error=>{
			console.log("error:");
			console.log(error);
			this.error = error;
		}).then(() => {
			this.transactionActive = false;
			if(!this.error){
				this.showAlert();
			}else if(this.error){
				this.showErrorAlert(this.error);
			}
		});

	}

	private showAlert() {
		this._router.navigate(['/', 'dashboard']);
		const alert = this._root_vcr.createComponent(AlertComponent);
		alert.title = 'Congratulations';
		alert.type = 'happy';
		if(this._client.get('TeamMembers').length == 1){
			alert.content = this._client.get('ClientName') + ` is now subscribed to the SwipeIn ` + this.curTarif +
			` plan for ` + this._client.get('TeamMembers').length + ` user`;
		}else if(this._client.get('TeamMembers').length > 1){
			alert.content = this._client.get('ClientName') + ` is now subscribed to the SwipeIn ` + this.curTarif +
			` plan for ` + this._client.get('TeamMembers').length + ` users`;
		}
		alert.addButton({
			title: 'OK',
			type: 'primary',
			onClick: () => {
				this._root_vcr.clear();
			}
		});
	}

	private showErrorAlert(error : any) {
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
		this.error = false;
	}

	changeCurTarif(newTarif: string) {
		this._CheckoutServService.curTarif.next(newTarif);
		this._CheckoutServService.setNewTarif(newTarif);
		this._SubscriptionBillingService.getAnuallyPrice();
		this._SubscriptionBillingService.getMonthlyPrice();
	}

	updateCurPaying(payingType: string) {
		this._CheckoutServService.curPayingPlan.next(payingType);
		this._CheckoutServService.setNewPayingPlan(payingType);
	}

	addCard() {
		const addCardAlert = this._root_vcr.createComponent(AddCardComponent);
		addCardAlert.alwaysDefault = true;
		addCardAlert.updateCardEvent.subscribe(event => {
			this._SubscriptionBillingService.getStripeCustomer().then(res => {
				// this.stripeCustomer = res;
				this.defaultPaymentSource = res.sources.data.find(source => {
					return source.id == res.default_source;
				});
			});
		});
	}

	get Loading() {
		return Loading;
	}

	// ----------- FOR TESTING ONLY -----------

	createUnpaidSubscription() {
		return this._SubscriptionBillingService.subscribeCustomerToPlan('100', undefined, (Math.floor(Date.now() / 1000) + 60)).then(() => {
			console.log('Unpaid plan created');
		});
	}

}
