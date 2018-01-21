import { JobDetailsGuard } from './../guards/job-details.guard';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ErpService } from './erp-job/erp.service';
import { EmReferralService } from '../employee-referral/em-referral.service';
// import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { JobDetailsComponent } from './job-details.component';
import { Parse } from '../parse.service';


import {
	MatTabsModule,
	MatMenuModule,
	MatSlideToggleModule,
	MatIconModule,
	MatButtonModule
} from '@angular/material';
import { MatSelectModule } from '@angular/material';
import { JobBoardsModule } from './job-boards/job-boards.module';
import { CandidatesModule } from './candidates/candidates.module';

import { ShareModule } from '../shared/share/share.module';
import { ErpJobComponent } from './erp-job/erp-job.component';
import { SocialMediaShareComponent } from './social-media-share/social-media-share.component';

import { JobDetailsService } from './job-details.service';
import { JobOverviewModule } from './job-overview/job-overview.module';
import { GmailModule } from './../gmail/gmail.module';

// import { JobDetailsRoutingModule } from './job-details-routing.module';
// import { AlertModule } from '../shared/alert/alert.module';

@NgModule({
	imports: [
		CommonModule,
		// JobDetailsRoutingModule,
		// BrowserModule,
		CommonModule,
		RouterModule,
		FormsModule,
		MatTabsModule,
		JobBoardsModule,
		MatIconModule,
		ShareModule,
		CandidatesModule,
		MatSlideToggleModule,
		MatMenuModule,
		MatButtonModule,
		MatSelectModule,
		JobOverviewModule,
		GmailModule
		// AlertModule
	],
	declarations: [
		JobDetailsComponent,
		ErpJobComponent,
		SocialMediaShareComponent
	],
	providers: [ JobDetailsService, Parse, EmReferralService, ErpService, JobDetailsGuard ]
})
export class JobDetailsModule { }
