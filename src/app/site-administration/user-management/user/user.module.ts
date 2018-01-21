import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserComponent } from './user.component';
import { AccessLevelModalComponent } from './access-level-modal/access-level-modal.component';
import { AccessLevelModalService } from './access-level-modal/access-level-modal.service';
import { UserService } from './user.service';
import { MatIconModule, MatTooltipModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { AlertModule } from '../../../shared/alert/alert.module';

@NgModule({
  declarations: [
    UserComponent,
    AccessLevelModalComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    RouterModule,
    MatIconModule,
    FormsModule,
    MatTooltipModule,
    AlertModule
  ],
  providers: [
    UserService,
    AccessLevelModalService
  ],
  entryComponents: [
    AccessLevelModalComponent
  ]

})
export class UserModule { }
