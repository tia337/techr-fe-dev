import { Gapi } from './gmail-auth2.service';
import { TextInputHighlightModule } from 'angular-text-input-highlight';
import { TemplatesModule } from './templates/templates.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule, MatMenuModule, MatSidenavModule } from '@angular/material';

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
// import { UserSettingsComponent } from './user-settings/user-settings.component';
// import { GoogleAuthComponent } from './google-auth/google-auth.component';
const config: SocketIoConfig = {
	url: 'https://swipeinmlabtest.herokuapp.com/', options: {
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
		// UserSettingsComponent,
	],
	imports: [
		BrowserModule,
		HttpModule,
		AppRoutingModule,
		BrowserAnimationsModule,
		MatSidenavModule,
		MatMenuModule,

		// HeaderModule,
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
		// Testing component
		TestModule,

		AlertModule,
		CheckoutPageModule,
		MatIconModule,
		InviteUserPageModule,
		LoginModule,
		TermsConditionsModule,
		PrivacyPolicyModule,
		CoreModule,
		LogoutModule,
		TextInputHighlightModule,
		InvitationPageModule,

		ContactUsModule
	],
	providers: [SidenavService, RootVCRService, StripeService, Gapi, LoginGuard, BillingGuard, ActiveSubscriptionGuard],
	bootstrap: [AppComponent],
	exports: [
		// AutosizeDirective
	],
	
})
export class AppModule {
}
