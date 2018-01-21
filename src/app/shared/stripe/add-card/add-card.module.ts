import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AddCardComponent } from './add-card.component';
import { AddCardService } from './add-card.service';
import { MatProgressSpinnerModule } from '@angular/material';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		MatProgressSpinnerModule
	],
	declarations: [ AddCardComponent ],
	exports: [ AddCardComponent ],
	providers: [ AddCardService ]
})
export class AddCardModule { }
