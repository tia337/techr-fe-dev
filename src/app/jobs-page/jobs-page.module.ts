import {
	BrowserModule
} from '@angular/platform-browser';
import {
	NgModule
} from '@angular/core';
import {
	CommonModule
} from '@angular/common';
import {
	ReactiveFormsModule,
	FormsModule
} from '@angular/forms';
import {
	RouterModule
} from '@angular/router';

import {
	JobsPageComponent
} from './jobs-page.component';
import {
	ShareComponent
} from './share/share.component';

import {
	Parse
} from '../parse.service';
import {
	DataService
} from '../data.service';
import {
	FacebookService
} from 'ngx-facebook';

import {
	MatButtonToggleModule,
	MatSelectModule,
	MatButtonModule,
	MatInputModule
} from '@angular/material';
import {
	MatAutocompleteModule
} from '@angular/material/autocomplete';
import {
	MatListModule
} from '@angular/material';
import {
	MatIconModule
} from '@angular/material';

import {
	JobsPageService
} from './jobs-page.service';
import {
	JobBoxModule
} from './job-box/job-box.module';
import {
	FiltersService
} from 'app/shared/filters.service';



@NgModule({
	declarations: [
		JobsPageComponent,
		ShareComponent
	],
	imports: [
		BrowserModule,
		CommonModule,
		ReactiveFormsModule,
		FormsModule,
		RouterModule,
		MatSelectModule,
		MatListModule,
		MatIconModule,
		JobBoxModule,
		MatButtonToggleModule,
		MatButtonModule,
		MatAutocompleteModule,
		MatInputModule
	],
	entryComponents: [ShareComponent],
	providers: [Parse, DataService, FacebookService, JobsPageService, FiltersService],
	exports: [JobsPageComponent]
})
export class JobsPageModule {}

