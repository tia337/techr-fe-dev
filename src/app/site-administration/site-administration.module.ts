import { EditRecruitmentTeamModule } from './user-management/recruitment-teams/edit-recruitment-team/edit-recruitment-team.module';
import {
	BrowserModule
} from '@angular/platform-browser';
import {
	NgModule
} from '@angular/core';
import {
	CommonModule
} from '@angular/common';
import {
	RouterModule
} from '@angular/router';
import {
	ReactiveFormsModule,
	FormsModule
} from '@angular/forms';
import { UserRolesModule } from './user-management/permissions/user-roles/user-roles.module';
import {
	MatIconModule,
	MatTooltipModule,
	MatInputModule,
	MatSelectModule,
	MatSlideToggleModule,
	MatExpansionModule,
	MatButtonModule
} from '@angular/material';
import {
	MatRadioModule
} from '@angular/material/radio';

import {
	SiteAdministrationComponent
} from './site-administration.component';
import {
	SiteAdministrationService
} from './site-administration.service';
import {
	CompanySettingsComponent
} from './company-settings/company-settings.component';
import {
	CompanySettingsService
} from './company-settings/company-settings.service';
import {
	UserManagementComponent
} from './user-management/user-management.component';
import {
	JobsSettingsComponent
} from './jobs-settings/jobs-settings.component';
import {
	SubscriptionsComponent
} from './subscriptions/subscriptions.component';
import {
	SubscriptionService
} from './subscriptions/subscriptions.service';
import {
	AppIntegrationsComponent
} from './app-integrations/app-integrations.component';
import {
	IntegrationService
} from './app-integrations/app-integrations.service';

import {
	BillingModule
} from './billing/billing.module';

import {
	InviteUserComponent
} from './user-management/invite-user/invite-user.component';
import {
	InviteVCR
} from './user-management/invite-user/inviteVCR.service';
import {
	PermissionsComponent
} from './user-management/permissions/permissions.component';
import {
	AccessLevelPageComponent
} from './user-management/access-level-page/access-level-page.component';
import {
	AccessLevelPageService
} from './user-management/access-level-page/access-level-page.service';
import {
	InviteFormComponent
} from './user-management/invite-user/invite-form/invite-form.component';
import {
	InviteFormService
} from './user-management/invite-user/invite-form/invite-form.service';
import {
	InvitationConfirmAlertComponent
} from './user-management/invite-user/invitation-confirm-alert/invitation-confirm-alert.component';
import {
	SubscriptionsCheckoutModule
} from './subscriptions-checkout/subscriptions-checkout.module';
import {
	CheckoutServService
} from './shared/checkout-serv.service';
import {
	UpgradeDataService
} from './shared/upgrade-data.service';
import {
	SubscriptionsUpgradeModule
} from './subscriptions-upgrade/subscriptions-upgrade.module'

import {
	RootVCRService
} from '../root_vcr.service';
import {
	AlertComponent
} from '../shared/alert/alert.component';

import {
	InviteUserModule
} from './user-management/invite-user/invite-user.module';

import { ClickOutsideModule } from 'ng-click-outside';

// WYSIWYG pannel

import {
	TeamMembersModule
} from "./user-management/team-members/team-members.module";
import {
	UserModule
} from "./user-management/user/user.module";
import { UserRolesEditModule } from './user-management/permissions/user-roles-edit/user-roles-edit.module';
import { UserRolesDeleteModule } from './user-management/permissions/user-roles-delete/user-roles-delete.module';
import { NewWorkflowModule } from './company-settings/new-workflow/new-workflow.module';
import { NgxDnDModule } from '@swimlane/ngx-dnd';
import {
	ChangePasswordComponent
} from './company-settings/change-password/change-password.component';
import {UserSettingsComponent} from "../user-settings/user-settings.component";
import { ReportsComponent } from './reports/reports.component';
import { UserRolesComponent } from './user-management/permissions/user-roles/user-roles.component';
import { UserRolesEditComponent } from './user-management/permissions/user-roles-edit/user-roles-edit.component';
import { UserRolesDeleteComponent } from './user-management/permissions/user-roles-delete/user-roles-delete.component';
import { NewRecruitmentTeamModule } from './user-management/recruitment-teams/new-recruitment-team/new-recruitment-team.module';
import { NewWorkflowComponent } from './company-settings/new-workflow/new-workflow.component';
import { RecruitmentTeamsComponent } from './user-management/recruitment-teams/recruitment-teams.component';
import { NewRecruitmentTeamComponent } from './user-management/recruitment-teams/new-recruitment-team/new-recruitment-team.component';
import { EditRecruitmentTeamComponent } from './user-management/recruitment-teams/edit-recruitment-team/edit-recruitment-team.component';
import { EditUserRoleComponent } from './user-management/access-level-page/edit-user-role/edit-user-role.component';


@NgModule({
	declarations: [
		EditUserRoleComponent,
		SiteAdministrationComponent,
		CompanySettingsComponent,
		UserManagementComponent,
		UserSettingsComponent,
		JobsSettingsComponent,
		SubscriptionsComponent,
		AppIntegrationsComponent,
		PermissionsComponent,
		AccessLevelPageComponent,
		ChangePasswordComponent,
		ReportsComponent,
		UserRolesComponent,
		UserRolesEditComponent,
		UserRolesDeleteComponent,
		RecruitmentTeamsComponent,
		NewRecruitmentTeamComponent,
		EditRecruitmentTeamComponent
	],
	imports: [
		BrowserModule,
		CommonModule,
		RouterModule,
		FormsModule,
		ReactiveFormsModule,
		MatSelectModule,
		MatTooltipModule,
		SubscriptionsCheckoutModule,
		BillingModule,
		SubscriptionsUpgradeModule,
		MatIconModule,
		MatSlideToggleModule,
		InviteUserModule,
		TeamMembersModule,
		UserModule,
		MatInputModule,
		MatRadioModule,
		MatExpansionModule,
		MatButtonModule,
		ClickOutsideModule,
		UserRolesModule,
		UserRolesEditModule,
		UserRolesDeleteModule,
		NewWorkflowModule,
		NgxDnDModule,
		NewRecruitmentTeamModule,
		EditRecruitmentTeamModule,
	],
	providers: [
		AccessLevelPageService,
		IntegrationService,
		SubscriptionService,
		CheckoutServService,
		CompanySettingsService,
		UpgradeDataService,
		SiteAdministrationService,
		RootVCRService
	],
	entryComponents: [
		ChangePasswordComponent,
		AlertComponent,
		UserRolesComponent,
		UserRolesEditComponent,
		UserRolesDeleteComponent,
		NewWorkflowComponent,
		NewRecruitmentTeamComponent,
		EditRecruitmentTeamComponent,
		EditUserRoleComponent
	],
	exports: [
		SiteAdministrationComponent
	]
})
export class SiteAdministrationModule {}

