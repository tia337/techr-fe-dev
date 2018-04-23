import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimelineComponent } from './timeline.component';
import { TimelineService } from './timeline.service';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    RouterModule
  ],
  declarations: [TimelineComponent],
  providers: [TimelineService],
})
export class TimelineModule { }
