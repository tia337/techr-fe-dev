import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { BillingPaymentDetailsComponent } from './billing-payment-details.component';
import { BillingPaymentDetailsService } from './billing-payment-details.service';
import { BillingCardModule } from './billing-card/billing-card.module';

@NgModule({
	declarations: [ BillingPaymentDetailsComponent ],
	imports: [
		BrowserModule,
		CommonModule,
		RouterModule,
		BillingCardModule
	],
	providers: [ BillingPaymentDetailsService ]

})
export class BillingPaymentDetailsModule { }
