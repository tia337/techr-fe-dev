import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material';

import { BillingOverviewComponent } from './billing-overview.component';
import { BillingOverviewService } from './billing-overview.service';
import { CancelSubscriptionAlertComponent } from './cancel-subscription-alert/cancel-subscription-alert.component';

import { CancelSubscriptionAlertService } from './cancel-subscription-alert/cancel-subscription-alert.service';

@NgModule({
  declarations: [ BillingOverviewComponent, CancelSubscriptionAlertComponent ],
  imports: [
    BrowserModule,
    CommonModule,
    RouterModule,
    FormsModule,
    MatSelectModule
  ],
  providers: [ BillingOverviewService, CancelSubscriptionAlertService ],
  entryComponents: [ CancelSubscriptionAlertComponent ]

})
export class BillingOverviewModule { }
