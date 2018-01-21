import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReachAndManageCandidatesComponent } from './reach-and-manage-candidates/reach-and-manage-candidates.component';
import { HireComponent } from './hire/hire.component';
import { EmployeeReferralCultureComponent } from './employee-referral-culture/employee-referral-culture.component';
import { DataDrivenRecruitmentComponent } from './data-driven-recruitment/data-driven-recruitment.component';
import { CrossPlatformComponent } from './cross-platform/cross-platform.component';
import { MatIconModule } from '@angular/material';
import { RouterModule } from '@angular/router';

@NgModule({
	imports: [
		CommonModule,
		MatIconModule,
		RouterModule
	],
	declarations: [ReachAndManageCandidatesComponent, HireComponent, EmployeeReferralCultureComponent, DataDrivenRecruitmentComponent, CrossPlatformComponent]
})
export class LoginTabsModule { }
