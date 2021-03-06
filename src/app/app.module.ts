import { ReactiveFormsModule } from '@angular/forms';
import { Gapi } from './gmail-auth2.service';
import { TextInputHighlightModule } from 'angular-text-input-highlight';
import { TemplatesModule } from './templates/templates.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule, MatMenuModule, MatSidenavModule, MatProgressBarModule, MatProgressSpinnerModule } from '@angular/material';
import {MatGridListModule} from '@angular/material/grid-list';

import 'hammerjs';

import { HeaderModule } from './header/header.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { PostJobPageModule } from './post-job-page/post-job-page.module';
import { JobsPageModule } from './jobs-page/jobs-page.module';
import { JobDetailsModule } from './job-details/job-details.module';
import { InfoModalModule } from './shared/info-modal/info-modal.module';
import { ShareModule } from './shared/share/share.module';
import { PopupModule } from './shared/popup/popup.module';
import { CheckoutPageModule } from './checkout-page/checkout-page.module';

import { SiteAdministrationModule } from './site-administration/site-administration.module';
import { ScorecardsModule } from './scorecards/scorecards.module';

import { SidenavService } from './sidenav.service';
import { RootVCRService } from './root_vcr.service';
import { StarRatingModule } from './shared/star-rating/star-rating.module';
// Component for testing features, available on /test route
import { TestModule } from './test/test.module';

import { AlertModule } from './shared/alert/alert.module';
import { NotificationModule } from './header/notifications/notification/notification.module';

import { StripeService } from './shared/services/stripe.service';

import { EmReferralModule } from './employee-referral/em-referral.module';

import { SocketIoConfig, SocketIoModule } from 'ng-socket-io';
import { InviteUserPageModule } from './invite-user-page/invite-user-page.module';
import { LoginModule } from './login/login.module';
import { CoreModule } from './core/core.module';
import { LoginGuard } from './guards/login.guard';
import { LogoutModule } from './logout/logout.module';
import { BillingGuard } from './guards/billing.guard';
import { TermsConditionsModule } from './info-pages/terms-conditions/terms-conditions.module';
import { PrivacyPolicyModule } from './info-pages/privacy-policy/privacy-policy.module';
import { InvitationPageModule } from './invitation-page/invitation-page.module';
import { ContactUsModule } from "app/contact-us/contact-us.module";
import { ActiveSubscriptionGuard } from './guards/active-subscription.guard';
import { environment } from './../environments/environment';
import { ChatModule } from './chat/chat.module';
import { TimelineComponent } from './timeline/timeline.component';
import { TimelineModule } from './timeline/timeline.module';
import { ClearStringPipe } from './clear-string.pipe';
import { TimelineService } from './timeline/timeline.service';
import { NgxDnDModule } from '@swimlane/ngx-dnd';
import { EditUserRoleComponent } from './site-administration/user-management/access-level-page/edit-user-role/edit-user-role.component';
import { ClickOutsideModule } from 'ng-click-outside';
import { TalentbaseModule } from './talentbase/talentbase.module';
import { AuthMicrosoftComponent } from './auth/auth-microsoft/auth-microsoft.component';
import { AuthLinkedinComponent } from './auth/auth-linkedin/auth-linkedin.component';

const config: SocketIoConfig = {
	url: environment.SOCKET_IO, options: {
		reconnection: true,
		reconnectionDelay: 1000,
		reconnectionDelayMax: 5000,
		reconnectionAttempts: Infinity,
		forceNew: true
	}
};

@NgModule({
	declarations: [
		AppComponent,
		ClearStringPipe,
		AuthMicrosoftComponent,
		AuthLinkedinComponent,
	],
	imports: [
		BrowserModule,
		HttpModule,
		AppRoutingModule,
		BrowserAnimationsModule,
		MatSidenavModule,
		MatMenuModule,
		NotificationModule,
		ChatModule,
		JobsPageModule,
		DashboardModule,
		PostJobPageModule,
		JobDetailsModule,
		InfoModalModule,
		ShareModule,
		PopupModule,
		SiteAdministrationModule,
		ScorecardsModule,
		TemplatesModule,
		StarRatingModule,
		SocketIoModule.forRoot(config),
		EmReferralModule,
		TestModule,
		AlertModule,
		CheckoutPageModule,
		MatIconModule,
		MatGridListModule,
		MatProgressBarModule,
		MatProgressSpinnerModule,
		InviteUserPageModule,
		LoginModule,
		TermsConditionsModule,
		PrivacyPolicyModule,
		CoreModule,
		LogoutModule,
		TextInputHighlightModule,
		InvitationPageModule,
		ContactUsModule,
		TimelineModule,
		ReactiveFormsModule,
		NgxDnDModule,
		ClickOutsideModule,
		TalentbaseModule
	],
	providers: [
		SidenavService,
		RootVCRService,
		StripeService,
		Gapi,
		LoginGuard,
		BillingGuard,
		ActiveSubscriptionGuard,
		TimelineService
	],
	bootstrap: [AppComponent],
	exports: [],

})
export class AppModule {
}
