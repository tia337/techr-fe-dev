import { Parse } from './../../../../parse.service';
import { AutosizeModule } from './../../../../shared/autosize/autosize.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { CandidateNotesComponent } from './candidate-notes.component';
import { CandidateNotesService } from './candidate-notes.service';
import { NoteMessageComponent } from './note-message/note-message.component';
import { MatSelectModule } from '@angular/material';
import { MatButtonModule } from '@angular/material';
import { MatAutocompleteModule } from '@angular/material';
import { MentionModule } from 'angular2-mentions/mention';
import { TextInputHighlightModule } from 'angular-text-input-highlight';

@NgModule({
	imports: [
		BrowserModule,
		CommonModule,
		AutosizeModule,
		FormsModule,
		MatSelectModule,
		MatButtonModule,
		MatAutocompleteModule,
		MentionModule,
		TextInputHighlightModule
	],
	declarations: [
		CandidateNotesComponent,
		NoteMessageComponent,
	], exports: [
		CandidateNotesComponent, NoteMessageComponent
	],
	providers: [
		CandidateNotesService
	]
})

export class CandidateNotesModule { }
