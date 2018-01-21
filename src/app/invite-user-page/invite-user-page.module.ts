import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InviteUserPageComponent } from './invite-user-page.component';
import { InviteUserPageService } from './invite-user-page.service';
import { Branch } from '../shared/services/branch.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [ InviteUserPageComponent ],
  providers: [ InviteUserPageService, Branch ]
})
export class InviteUserPageModule { }
