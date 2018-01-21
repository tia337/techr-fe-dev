import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatIconModule, MatSelectModule } from '@angular/material';

import { HeaderComponent } from './header.component';
import { CartAdding } from './cartadding.service';

import { ConfirmationAlertComponent } from './confirmation-alert/confirmation-alert.component';
import { ConfirmationAlertService } from './confirmation-alert/confirmation-alert.service';

import { Login } from '../login.service';
import { Parse } from '../parse.service';
import { AdministrationMenuComponent } from './administration-menu/administration-menu.component';
import { AdministrationMenuService } from './administration-menu/administration-menu.service';
import { RootVCRService } from '../root_vcr.service';
import { HeaderService } from 'app/header/header.service';

import { MatInputModule, MatProgressSpinnerModule } from '@angular/material';

@NgModule({
	declarations: [ HeaderComponent, ConfirmationAlertComponent, AdministrationMenuComponent ],
	imports: [
		BrowserModule,
		CommonModule,
		RouterModule,
		FormsModule,
		MatIconModule,
		MatSelectModule,
		MatInputModule,
		MatProgressSpinnerModule
	],
	entryComponents: [ ConfirmationAlertComponent, AdministrationMenuComponent ],
	providers: [ Login, Parse, ConfirmationAlertService, CartAdding, AdministrationMenuService, HeaderService ],
	exports: [ HeaderComponent ]

})
export class HeaderModule { }
