import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EmployeeReferralComponent } from './employee-referral.component';
import { EmReferralService } from './em-referral.service';
import { MatTabsModule, MatSelectModule, MatMenuModule, MatTooltipModule } from '@angular/material';
import { EmployeeReferralCustomizeComponent } from './employee-referral-customize/employee-referral-customize.component';
import { FormsModule } from '@angular/forms';
import { EmployeeReferralCreateComponent } from './employee-referral-create/employee-referral-create.component';

@NgModule({
  imports: [
	CommonModule,
  MatTabsModule,
  MatSelectModule,
  RouterModule,
  FormsModule,
  MatMenuModule,
  MatTooltipModule
  ],
  declarations: [EmployeeReferralComponent, EmployeeReferralCustomizeComponent,
    EmployeeReferralCreateComponent
],
  exports: [EmployeeReferralComponent, EmployeeReferralCreateComponent],
  providers: [EmReferralService]
})
export class EmReferralModule { }
