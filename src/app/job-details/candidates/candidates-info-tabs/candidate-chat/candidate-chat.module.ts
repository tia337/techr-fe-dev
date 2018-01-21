import { GmailModule } from './../../../../gmail/gmail.module';
import { Parse } from './../../../../parse.service';
import { AutosizeModule } from './../../../../shared/autosize/autosize.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { CandidateChatComponent } from './candidate-chat.component';
import { CandidateChatService } from './candidate-chat.service';
import { ChatMessageComponent } from './chat-message/chat-message.component';
import { ThreadGmailComponent } from './thread-gmail/thread-gmail.component';
import { RootVCRService } from 'app/root_vcr.service';
import { MatButtonModule } from '@angular/material';

@NgModule({
  imports: [
    BrowserModule,
    CommonModule,
    AutosizeModule,
	FormsModule,
	GmailModule,
	MatButtonModule
  ],
  declarations: [
    CandidateChatComponent,
    ChatMessageComponent,
    ThreadGmailComponent,
  ], exports: [
    CandidateChatComponent, ChatMessageComponent
  ],
  providers: [
    CandidateChatService, RootVCRService
  ]
})
export class CandidateChatModule { }
