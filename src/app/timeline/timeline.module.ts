import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimelineComponent } from './timeline.component';
import { TimelineService } from './timeline.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [TimelineComponent],
  providers: [TimelineService],
})
export class TimelineModule { }
