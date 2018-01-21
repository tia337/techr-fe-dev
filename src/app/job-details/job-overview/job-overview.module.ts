import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JobOverviewComponent } from './job-overview.component';
import { PostJobPageModule } from '../../post-job-page/post-job-page.module';
import { JobOverviewService } from './job-overview.service';

@NgModule({
  imports: [
    CommonModule,
    PostJobPageModule
  ],
  declarations: [JobOverviewComponent],
  providers: [ JobOverviewService ]
})
export class JobOverviewModule { }
