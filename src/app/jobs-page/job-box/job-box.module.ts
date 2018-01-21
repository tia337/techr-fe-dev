import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JobBoxComponent } from './job-box.component';
import { JobBoxService } from './job-box.service';
import { MatIconModule, MatTooltipModule } from '@angular/material';
import { RouterModule } from '@angular/router';
import { ShareDirective } from '../../shared/share/share.component';
import { ShareModule } from '../../shared/share/share.module';
import { UploadCvModule } from 'app/upload-cv/upload-cv.module';

@NgModule({
	imports: [
		CommonModule,
		MatIconModule,
		MatTooltipModule,
		RouterModule,
		ShareModule,
		UploadCvModule
	],
	declarations: [ JobBoxComponent ],
	providers: [ JobBoxService ],
	exports: [ JobBoxComponent ]
})
export class JobBoxModule { }
