import { GmailComponent } from './../gmail/gmail.component';
import { GmailModule } from './../gmail/gmail.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material';

import { TestComponent } from './test.component';
import { TestStripeFormComponent } from './test-stripe-form/test-stripe-form.component'

import { StarRatingModule } from '../shared/star-rating/star-rating.module';
import { AlertModule } from '../shared/alert/alert.module';

import { TestSkillsComponent } from './test-skills/test-skills.component';
import { TestSkillsService } from './test-skills/test-skills.service';
import { MatFormFieldModule, MatInputModule, MatMenuModule, MatButtonModule } from "@angular/material";

import { UploadCvModule } from './../upload-cv/upload-cv.module';

import {ReactiveFormsModule} from '@angular/forms';


@NgModule({
	declarations: [
		TestComponent,
		TestStripeFormComponent,
		TestSkillsComponent,
		//GoogleAuthComponent
	],
	imports: [
		MatAutocompleteModule,
		MatInputModule,
		CommonModule,
		FormsModule,
		StarRatingModule,
		AlertModule,
		ReactiveFormsModule,
		MatFormFieldModule,
		MatInputModule,
		UploadCvModule,
		MatMenuModule,
		GmailModule
		//MatButtonModule

	],
	exports: [],
	providers: [TestSkillsService]
})
export class TestModule { }
