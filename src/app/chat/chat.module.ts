import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatComponent } from './chat.component';
import { ChatService } from './chat.service';
import { FormsModule } from '@angular/forms';
import { MatTooltipModule, MatProgressSpinnerModule } from '@angular/material';
import { MentionModule } from 'angular2-mentions/mention';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

@NgModule({
  imports: [
    CommonModule,
    MatTooltipModule,
    MentionModule,
    MatProgressSpinnerModule,
    InfiniteScrollModule
  ],
    declarations: [ChatComponent],
    providers: [ChatService],
})
export class ChatModule { }
