import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvitationPageComponent } from './invitation-page.component';
import { InvitationPageService } from './invitation-page.service';

@NgModule({
	imports: [
		CommonModule
	],
	declarations: [InvitationPageComponent],
	providers: [InvitationPageService]
})
export class InvitationPageModule { }
