import { AlertComponent } from 'app/shared/alert/alert.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreComponent } from './core.component';
import { RouterModule } from '@angular/router';
import { MatIconModule, MatSidenavModule, MatButtonModule } from '@angular/material';
import { MatSelectModule } from '@angular/material/select';
import { CoreService } from './core.service';
import { FeedbackAlertComponent } from './feedback-alert/feedback-alert.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FeedbackService } from './feedback-alert/feedback.service';
import { HeaderModule } from '../header/header.module';
import { ClickOutsideModule } from 'ng-click-outside';

@NgModule({
	imports: [
		CommonModule,
		RouterModule,
		MatSidenavModule,
		MatIconModule,
		FormsModule,
		ReactiveFormsModule,
		MatButtonModule,
		MatSelectModule,
		HeaderModule,
		ClickOutsideModule
	],
	declarations: [CoreComponent, FeedbackAlertComponent],
	providers: [CoreService, FeedbackService],
	entryComponents: [AlertComponent, FeedbackAlertComponent]
})
export class CoreModule { }
