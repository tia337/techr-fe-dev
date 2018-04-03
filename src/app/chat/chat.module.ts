import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatComponent } from './chat.component';
import { ChatService } from './chat.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTooltipModule, MatProgressSpinnerModule } from '@angular/material';
import { MentionModule } from 'angular2-mentions/mention';
import { ClickOutsideModule } from 'ng-click-outside';
import { AutosizeModule } from '../shared/autosize/autosize.module';
import { RouterModule } from '@angular/router';
import { SanitizePipe } from './sanitize.pipe';
import { SanitizeMessagePipe } from './sanitize-message.pipe';
import { ContenteditableDirective } from 'ng-contenteditable';

@NgModule({
  imports: [
    CommonModule,
    MatTooltipModule,
    MentionModule,
    MatProgressSpinnerModule,
    ClickOutsideModule,
    AutosizeModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule
  ],
    declarations: [ChatComponent, SanitizePipe, SanitizeMessagePipe, ContenteditableDirective],
    providers: [ChatService],
})
export class ChatModule { }
