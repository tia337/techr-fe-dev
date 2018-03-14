import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatComponent } from './chat.component';
import { ChatService } from './chat.service';
import { FormsModule } from '@angular/forms';
import { MatTabsModule, MatSelectModule, MatButtonToggleModule, MatButtonModule, MatProgressSpinnerModule } from '@angular/material';
import { LoaderModule } from "app/shared/loader/loader.module";
import { MatTooltipModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    MatTooltipModule
  ],
    declarations: [ChatComponent],
    providers: [ChatService],
})
export class ChatModule { }
