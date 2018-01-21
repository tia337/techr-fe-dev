import { Component, OnInit } from '@angular/core';
import { BillingPaymentDetailsService } from './billing-payment-details.service';

@Component({
	selector: 'app-billing-payment-details',
	templateUrl: './billing-payment-details.component.html',
	styleUrls: ['./billing-payment-details.component.scss']
})
export class BillingPaymentDetailsComponent implements OnInit {

	cards;
	customer;

	constructor(private _paymentDetailsService: BillingPaymentDetailsService) { }

	ngOnInit() {
		this.getData();
	}

	getData() {
		console.log('getData func');
		this._paymentDetailsService.getCurrentClient().then( client => {
			return this._paymentDetailsService.getStripeCustomer(client.get('stripeCustomerId'));
		}).then(customer => {
			this.customer = customer;
			this.cards = customer.sources.data;
		});
	}

	checkIsCardDefault(cardId: string): boolean {
		return this.customer.default_source === cardId;
	}

}
