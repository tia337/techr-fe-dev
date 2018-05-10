import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { PostJobPageComponent } from './post-job-page.component';
import { PostJobService } from './post-job.service';
import { SearchPipe, sortSkillsPipe, SearchCountryPipe, FilterProjects } from './post-job-page.pipes';
import { NouisliderModule } from 'ng2-nouislider';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatSnackBarModule} from '@angular/material/snack-bar';

// NouisliderModule
import { ModalComponent } from './modal/modal.component';
import { InfoModalModule } from '../shared/info-modal/info-modal.module';
import {
	MatProgressSpinnerModule,
	MatAutocompleteModule,
	MatNativeDateModule,
	MatInputModule,
	MatSelectModule,
	MatIconModule,
	MatButtonToggleModule,
	MatDatepickerModule,
	MatButtonModule
} from '@angular/material';

import { Login } from '../login.service';
import { Parse } from '../parse.service';
import { AlertComponentPost } from './alert/alert.component';

import { ClickOutsideModule } from 'ng-click-outside';
import { DashboardService } from 'app/dashboard/dashboard.service';
import { Modal1Component } from './modal1/modal1.component';
import { ApprovalComponent } from './approval/approval.component';

@NgModule({
	declarations: [
		PostJobPageComponent,
		ModalComponent,
		SearchPipe,
		sortSkillsPipe,
		AlertComponentPost,
		SearchCountryPipe,
		Modal1Component,
		ApprovalComponent,
		FilterProjects
	],
	imports: [
		BrowserModule,
		CommonModule,
		ReactiveFormsModule,
		FormsModule,
		MatDatepickerModule,
		InfoModalModule,
		MatNativeDateModule,
		MatInputModule,
		MatSelectModule,
		MatIconModule,
		MatButtonToggleModule,
		MatButtonModule,
		MatAutocompleteModule,
		MatProgressSpinnerModule,
		ClickOutsideModule,
		MatTooltipModule,
		NouisliderModule,
		MatSnackBarModule
	],
	entryComponents: [ AlertComponentPost, Modal1Component, ApprovalComponent ],
	providers: [ Login, Parse, PostJobService, DashboardService, FilterProjects ],
	exports: [PostJobPageComponent, AlertComponentPost]
})
export class PostJobPageModule {}
