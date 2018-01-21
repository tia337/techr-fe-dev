import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { Parse } from '../../parse.service';
import { JobBoardsComponent, RoundPipe, ReversePipe } from './job-boards.component';
import { JobBoardsService } from './job-boards.service';
import { InfoModalModule } from '../../shared/info-modal/info-modal.module';

import { MatIconModule, MatButtonModule, MatInputModule } from '@angular/material';
import { InfoTabComponent } from './info-tab/info-tab.component';
import { ClickOutsideModule } from 'ng-click-outside';
import { MatProgressSpinnerModule } from '@angular/material';
import { UrlInputComponent } from './url-input/url-input.component';
import { ReedAuthComponent } from './reed-auth/reed-auth.component';


@NgModule({
	declarations: [
		JobBoardsComponent,
		InfoTabComponent,
		UrlInputComponent,
		RoundPipe,
		ReversePipe,
		ReedAuthComponent,
	],
	imports: [
		BrowserModule,
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		MatIconModule,
		MatProgressSpinnerModule,
		InfoModalModule,
		ClickOutsideModule,
		MatButtonModule,
		MatInputModule
	],
	exports: [ JobBoardsComponent ],
	providers: [ Parse, JobBoardsService ],
	entryComponents: [ InfoTabComponent, UrlInputComponent, ReedAuthComponent ]

})
export class JobBoardsModule { }
