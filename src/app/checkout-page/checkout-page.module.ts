import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckoutPageComponent } from './checkout-page.component';
import { CheckoutPageService } from './checkout-page.service';
import { FormsModule } from '@angular/forms';
import { MatTabsModule, MatSelectModule, MatButtonToggleModule, MatButtonModule, MatProgressSpinnerModule } from '@angular/material';
import { AddCardModule } from '../shared/stripe/add-card/add-card.module';
import { AddCardComponent } from '../shared/stripe/add-card/add-card.component';
import { LoaderModule } from "app/shared/loader/loader.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatTabsModule,
    MatSelectModule,
    MatButtonToggleModule,
    MatButtonModule,
    LoaderModule,
    MatProgressSpinnerModule
  ],
  declarations: [CheckoutPageComponent],
  providers: [CheckoutPageService],
  entryComponents: [ AddCardComponent ]
})
export class CheckoutPageModule { }
