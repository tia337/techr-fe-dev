import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';

import { BillingHistoryComponent } from './billing-history.component';
import { BillingHistoryService } from './billing-history.service';
import { InvoicePreviewComponent } from './invoice-preview/invoice-preview.component';

@NgModule({
  declarations: [ BillingHistoryComponent, InvoicePreviewComponent ],
  imports: [
    BrowserModule,
    CommonModule,
    RouterModule,
  ],
  providers: [ BillingHistoryService, CurrencyPipe, DatePipe ],
  entryComponents: [ InvoicePreviewComponent ]

})
export class BillingHistoryModule { }
