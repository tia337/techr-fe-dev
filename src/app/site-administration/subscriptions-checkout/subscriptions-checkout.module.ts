import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubscriptionsCheckoutComponent } from './subscriptions-checkout.component';
import { TarifsComponent } from './tarifs/tarifs.component';
// import { SubscriptionsBillingComponent } from './subscriptions-billing/subscriptions-billing.component';
import { RouterModule } from '@angular/router';
import { MatSelectModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
// import { SubscriptionsBillingService } from './subscriptions-billing/subscriptions-billing.service';
import { TarifsService } from './tarifs/tarifs.service';
// import { StripeModule } from '../../shared/stripe-to-be-deleted/stripe.module';
import { SubscriptionsBillingModule } from './subscriptions-billing/subscriptions-billing.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MatSelectModule,
    FormsModule,
    SubscriptionsBillingModule,
    // StripeModule
  ],
  declarations: [ SubscriptionsCheckoutComponent, TarifsComponent ],
  providers: [ TarifsService ]
})
export class SubscriptionsCheckoutModule { }
