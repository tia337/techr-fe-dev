import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { InviteUserComponent } from './invite-user.component';
import { InviteUserService } from './invite-user.service';
import { InviteVCR } from './inviteVCR.service';
import { InviteFormService } from './invite-form/invite-form.service';
import { InviteFormComponent } from './invite-form/invite-form.component';
import { MatIconModule, MatTooltipModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { InvitationConfirmAlertComponent } from './invitation-confirm-alert/invitation-confirm-alert.component';

@NgModule({
  declarations: [
    InviteUserComponent,
    InviteFormComponent,
    InvitationConfirmAlertComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    RouterModule,
    MatIconModule,
    FormsModule,
    MatTooltipModule
  ],
  providers: [
    InviteUserService,
    InviteVCR,
    InviteFormService,
  ],
  entryComponents: [ InviteFormComponent, InvitationConfirmAlertComponent ]

})
export class InviteUserModule { }
