import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { BillingCardComponent } from './billing-card.component';
import { BillingCardService } from './billing-card.service';

// import { AddCardComponent } from './add-card/add-card.component';
import { AddCardComponent } from '../../../../shared/stripe/add-card/add-card.component';
import { AddCardModule } from '../../../../shared/stripe/add-card/add-card.module';

// import { AddCardService } from './add-card/add-card.service';

import { UpdateCardComponent } from './update-card/update-card.component';
import { UpdateCardService } from './update-card/update-card.service';

import { AlertModule } from '../../../../shared/alert/alert.module';

@NgModule({
	declarations: [ BillingCardComponent, UpdateCardComponent ],
	imports: [
		BrowserModule,
		CommonModule,
		RouterModule,
		FormsModule,
		ReactiveFormsModule,
		AlertModule,
		AddCardModule
	],
	exports: [ BillingCardComponent ],
	providers: [ BillingCardService, UpdateCardService ],
	entryComponents: [ UpdateCardComponent, AddCardComponent ]

})
export class BillingCardModule { }
