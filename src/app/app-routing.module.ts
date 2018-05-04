import { RecruitmentTeamsComponent } from './site-administration/user-management/recruitment-teams/recruitment-teams.component';

import { TemplateDetailsCustomComponent } from './templates/template-details-custom/template-details-custom.component';
import { TemplateDetailsComponent } from './templates/template-details/template-details.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CheckoutPageComponent } from './checkout-page/checkout-page.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PostJobPageComponent } from './post-job-page/post-job-page.component';
import { JobsPageComponent } from './jobs-page/jobs-page.component';
import { JobDetailsComponent } from './job-details/job-details.component';

import { ScorecardsComponent } from './scorecards/scorecards.component';
import { SelectStageComponent } from './scorecards/select-stage/select-stage.component';
import { ScoreCandidateComponent } from './scorecards/score-candidate/score-candidate.component';
import { AddQuestionsComponent } from './scorecards/add-questions/add-questions.component';

import { SiteAdministrationComponent } from './site-administration/site-administration.component';
import { CompanySettingsComponent } from './site-administration/company-settings/company-settings.component';

import { UserManagementComponent } from './site-administration/user-management/user-management.component';
import { TeamMembersComponent } from './site-administration/user-management/team-members/team-members.component';
import { PermissionsComponent } from './site-administration/user-management/permissions/permissions.component';
import { InviteUserComponent } from './site-administration/user-management/invite-user/invite-user.component';
import { UserComponent } from './site-administration/user-management/user/user.component';
import { AccessLevelPageComponent } from './site-administration/user-management/access-level-page/access-level-page.component';


import { JobsSettingsComponent } from './site-administration/jobs-settings/jobs-settings.component';
import { SubscriptionsComponent } from './site-administration/subscriptions/subscriptions.component';
import { TarifsComponent } from './site-administration/subscriptions-checkout/tarifs/tarifs.component'
import { SubscriptionsBillingComponent } from './site-administration/subscriptions-checkout/subscriptions-billing/subscriptions-billing.component';
import { SubscriptionsCheckoutComponent } from './site-administration/subscriptions-checkout/subscriptions-checkout.component';
import { SubscriptionsUpgradeComponent } from './site-administration/subscriptions-upgrade/subscriptions-upgrade.component';

import { BillingComponent } from './site-administration/billing/billing.component';
import { BillingHistoryComponent } from './site-administration/billing/billing-history/billing-history.component';
import { BillingOverviewComponent } from './site-administration/billing/billing-overview/billing-overview.component';
import { BillingPaymentDetailsComponent } from './site-administration/billing/billing-payment-details/billing-payment-details.component';

import { AppIntegrationsComponent } from './site-administration/app-integrations/app-integrations.component';
import { InviteUserPageComponent } from './invite-user-page/invite-user-page.component';

import { TemplatesComponent } from './templates/templates.component';
import { EmployeeReferralComponent } from './employee-referral/employee-referral.component';
import {
	EmployeeReferralCreateComponent,
} from './employee-referral/employee-referral-create/employee-referral-create.component';
import {
	EmployeeReferralCustomizeComponent,
} from './employee-referral/employee-referral-customize/employee-referral-customize.component';

import { ChatComponent } from './chat/chat.component';
import { TimelineComponent } from './timeline/timeline.component';

// Componenet for testing
import { TestComponent } from './test/test.component';

import { JobDetailsRoutes } from './job-details/job-details.routes';
import { CoreComponent } from './core/core.component';
import { LoginGuard } from './guards/login.guard';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { CrossPlatformComponent } from './login/login-tabs/cross-platform/cross-platform.component';
import { DataDrivenRecruitmentComponent } from './login/login-tabs/data-driven-recruitment/data-driven-recruitment.component';
import { EmployeeReferralCultureComponent } from './login/login-tabs/employee-referral-culture/employee-referral-culture.component';
import { HireComponent } from './login/login-tabs/hire/hire.component';
import { ReachAndManageCandidatesComponent } from './login/login-tabs/reach-and-manage-candidates/reach-and-manage-candidates.component';
import { BillingGuard } from './guards/billing.guard';
import { TermsConditionsComponent } from './info-pages/terms-conditions/terms-conditions.component';
import { PrivacyPolicyComponent } from './info-pages/privacy-policy/privacy-policy.component';
import { InvitationPageComponent } from './invitation-page/invitation-page.component';
import { ActiveSubscriptionGuard } from './guards/active-subscription.guard';
import { UserSettingsComponent } from './user-settings/user-settings.component';
import { ReportsComponent } from './site-administration/reports/reports.component';
import { NotificationComponent } from './header/notifications/notification/notification.component';
import { CandidatesComponent } from './job-details/candidates/candidates.component';
import { CandidateNotesComponent } from './job-details/candidates/candidates-info-tabs/candidate-notes/candidate-notes.component';
import { JobDetailsGuard } from './guards/job-details.guard';

const routes: Routes = [
	// { path: 'logout', component: LogoutComponent },
	{ path: 'invitation', component: InvitationPageComponent },
	{ path: 'terms-conditions', component: TermsConditionsComponent },
	{ path: 'privacy-policy', component: PrivacyPolicyComponent },
	{
		path: 'login',
		component: LoginComponent,
		children: [
			{
				path: '',
				component: ReachAndManageCandidatesComponent,
				outlet: 'login-slider'
			},
			{
				path: 'cross-platform',
				component: CrossPlatformComponent,
				outlet: 'login-slider'
			},
			{
				path: 'data-driven-recruitment',
				component: DataDrivenRecruitmentComponent,
				outlet: 'login-slider'
			},
			{
				path: 'emplyee-referral-culture',
				component: EmployeeReferralCultureComponent,
				outlet: 'login-slider'
			},
			{
				path: 'hire',
				component: HireComponent,
				outlet: 'login-slider'
			},
			{
				path: 'reach-and-manage-candidates',
				component: ReachAndManageCandidatesComponent,
				outlet: 'login-slider'
			}
		]
	},
	{
		path: '',
		canActivate: [LoginGuard],
		canActivateChild: [LoginGuard],
		component: CoreComponent,
		children: [
			{ path: '', redirectTo: 'dashboard', pathMatch: 'full' },
			{ path: 'chat/:id', component: ChatComponent, canActivate: [LoginGuard] },
			{ path: 'chat/:id', component: NotificationComponent },
			{ path: 'timeline', component: TimelineComponent },
			{ path: 'test', component: TestComponent },
			{ path: 'invitation', component: InviteUserPageComponent },
			{ path: 'dashboard', component: DashboardComponent },
			{
				path: 'post-job',
				component: PostJobPageComponent,
				canActivate: [ActiveSubscriptionGuard]
			},
			{
				path: 'post-job.',
				component: PostJobPageComponent,
				canActivate: [ActiveSubscriptionGuard]
			},
			{
				path: 'employee-referral',
				component: EmployeeReferralComponent,
				canActivate: [ActiveSubscriptionGuard]
			},
			{
				path: 'employee-referral/:id',
				component: TemplateDetailsCustomComponent,
				canActivate: [ActiveSubscriptionGuard]
			},
			{ path: 'checkout', component: CheckoutPageComponent, canActivate: [ActiveSubscriptionGuard] },
			{ path: 'jobs', component: JobsPageComponent, canActivate: [ActiveSubscriptionGuard] },
			{
				path: 'jobs/:id',
				component: JobDetailsComponent,
				canActivate: [ActiveSubscriptionGuard],
				canActivateChild: [ActiveSubscriptionGuard],
				children: [...JobDetailsRoutes]
			},
			{
				path: 'administration',
				component: SiteAdministrationComponent,
				children: [
					{
						path: '',
						redirectTo: 'company-settings',
						pathMatch: 'full'
					},
					{
						path: 'company-settings',
						component: CompanySettingsComponent,
						canActivate: [ActiveSubscriptionGuard]
					},
					{
						path: 'user-management',
						component: UserManagementComponent,
						canActivate: [ActiveSubscriptionGuard],
						canActivateChild: [ActiveSubscriptionGuard],
						children: [
							{
								path: '',
								component: TeamMembersComponent,
								outlet: 'user-management-sections'
							},
							{
								path: 'team-members',
								component: TeamMembersComponent,
								outlet: 'user-management-sections'
							},
							{
								path: 'permissions',
								component: PermissionsComponent,
								outlet: 'user-management-sections'
							},
							{
								path: 'recruitment-teams',
								component: RecruitmentTeamsComponent,
								outlet: 'user-management-sections'
							},
							{
								path: 'invite-user',
								component: InviteUserComponent,
								outlet: 'user-management-sections'
							},
							{
								path: 'user/:id',
								component: UserComponent,
								outlet: 'user-management-sections'
							},
							{
								path: 'access-level/:id',
								component: AccessLevelPageComponent,
								outlet: 'user-management-sections'
							}
						]
					},
					{
						path: 'jobs-settings',
						component: JobsSettingsComponent,
						canActivate: [ActiveSubscriptionGuard]
					},
					{
						path: 'subscriptions',
						component: SubscriptionsComponent,
					},
					{
						path: 'subscriptions-upgrade',
						component: SubscriptionsUpgradeComponent,
					},
					{
						path: 'subscriptions-checkout',
						component: SubscriptionsCheckoutComponent,
						children: [
							{
								path: 'tarifs',
								component: TarifsComponent,
							},
							{
								path: 'subscriptions-billing',
								component: SubscriptionsBillingComponent,
							}
						]
					},
					{
						path: 'billing',
						component: BillingComponent,
						canActivate: [BillingGuard],
						canActivateChild: [BillingGuard],
						children: [
							{
								path: '',
								component: BillingOverviewComponent,
								outlet: 'billing-sections'
							},
							{
								path: 'overview',
								component: BillingOverviewComponent,
								outlet: 'billing-sections'
							},
							{
								path: 'payment-details',
								component: BillingPaymentDetailsComponent,
								outlet: 'billing-sections'
							},
							{
								path: 'billing-history',
								component: BillingHistoryComponent,
								outlet: 'billing-sections'
							}
						]
					},
					{
						path: 'app-integrations',
						component: AppIntegrationsComponent,
						canActivate: [ActiveSubscriptionGuard]
					},
					{
						path: 'reports',
						component: ReportsComponent
					}
				]
			},
			{
				path: 'scorecards',
				component: ScorecardsComponent,
				canActivate: [ActiveSubscriptionGuard],
				canActivateChild: [ActiveSubscriptionGuard],
				children: [
					{
						path: '',
						component: SelectStageComponent,
						outlet: 'scorecard-stage'
					},
					{
						path: 'select-stage',
						component: SelectStageComponent,
						outlet: 'scorecard-stage'
					},
					{
						path: 'score-candidate',
						component: ScoreCandidateComponent,
						outlet: 'scorecard-stage'
					},
					{
						path: 'add-questions',
						component: AddQuestionsComponent,
						outlet: 'scorecard-stage'
					}
				]
			},
			{
				path: 'templates',
				component: TemplatesComponent,
				canActivate: [ActiveSubscriptionGuard]
			},
			{
				path: 'templates/:id',
				component: TemplateDetailsComponent,
				canActivate: [ActiveSubscriptionGuard]
			},
			{
				path: 'templates_custom/:id',
				component: TemplateDetailsCustomComponent,
				canActivate: [ActiveSubscriptionGuard]
			},
			{
				path: 'empref',
				component: EmployeeReferralComponent,
				canActivate: [ActiveSubscriptionGuard]
			},
			{
				path: 'empref_custom/:id',
				component: EmployeeReferralCustomizeComponent,
				canActivate: [ActiveSubscriptionGuard]
			},
			{
				path: 'empref_create/:id',
				component: EmployeeReferralCreateComponent,
				canActivate: [ActiveSubscriptionGuard]
			},
			{
				path: 'user-settings',
				component: UserSettingsComponent,
				canActivate: [ActiveSubscriptionGuard]
			},
		]
	}
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
