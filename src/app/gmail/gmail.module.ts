import { CandidateChatService } from './../job-details/candidates/candidates-info-tabs/candidate-chat/candidate-chat.service';
import { MentionModule } from 'angular2-mentions/mention';
import { GmailDraftsService } from './gmail-drafts.service';
import { AlertComponent } from './../shared/alert/alert.component';
import { MatSelectModule, MatAutocompleteModule, MatInputModule } from '@angular/material';
import { GmailNotesChatsIntegrationService } from './gmail-notes-chats-integration.service';
import { Parse } from './../parse.service';
import { GmailService } from './gmail.service';
import { GmailComponent } from './gmail.component';
import { MatButtonModule, MatMenuModule, MatProgressSpinnerModule } from '@angular/material';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
@NgModule({
	imports: [
		CommonModule,
		MatButtonModule,
		MatMenuModule,
		FormsModule,
		MatSelectModule,
		MatAutocompleteModule,
		MatInputModule,
		ReactiveFormsModule,
		MentionModule,
		MatProgressSpinnerModule
	],
	declarations: [GmailComponent],
	exports: [GmailComponent],
	providers: [GmailService,
		Parse,
		GmailNotesChatsIntegrationService,
		GmailDraftsService,
		CandidateChatService
	],
	entryComponents: [AlertComponent]
})
export class GmailModule { }
