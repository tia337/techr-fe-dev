import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { BillingOverviewModule } from './billing-overview/billing-overview.module';

import { BillingComponent } from './billing.component';
import { BillingPaymentDetailsModule } from './billing-payment-details/billing-payment-details.module';
import { BillingHistoryModule } from './billing-history/billing-history.module';

import { BillingService } from './billing.service';

@NgModule({
  declarations: [ BillingComponent ],
  imports: [
    BrowserModule,
    CommonModule,
    RouterModule,
    BillingOverviewModule,
    BillingPaymentDetailsModule,
    BillingHistoryModule
  ],
  providers: [ BillingService ]

})
export class BillingModule { }
