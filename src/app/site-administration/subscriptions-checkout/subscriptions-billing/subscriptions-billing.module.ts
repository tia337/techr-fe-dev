import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubscriptionsBillingComponent } from './subscriptions-billing.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SubscriptionsBillingService } from './subscriptions-billing.service';
import { MatSelectModule, MatButtonModule } from '@angular/material';
import { BillingCardModule } from '../../billing/billing-payment-details/billing-card/billing-card.module';
import { AlertComponent } from '../../../shared/alert/alert.component';
import { MatProgressSpinnerModule } from '@angular/material';


@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		MatSelectModule,
		BillingCardModule,
		MatButtonModule,
		MatProgressSpinnerModule
	],
	declarations: [ SubscriptionsBillingComponent ],
	providers: [ SubscriptionsBillingService ],
	entryComponents: [AlertComponent]
})
export class SubscriptionsBillingModule { }
