import { Component, OnDestroy, OnInit } from '@angular/core';
import { Login } from '../login.service';
import { Parse } from '../parse.service';
import { DashboardService } from './dashboard.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Router } from '@angular/router';
import { RootVCRService } from 'app/root_vcr.service';
import { PreloaderComponent } from 'app/shared/preloader/preloader.component';
import { MatButton } from '@angular/material';
import { FeedbackAlertComponent } from 'app/core/feedback-alert/feedback-alert.component';


@Component({
	selector: 'app-login-page',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

	trialDaysLeft: number;

	expiresOn: Date;
	private indicatorValue = 0;
	isFirst;
	private _onTrial = false;
	private _currentPlan;

	currentUser;
	private _currentUserSubscription;

	constructor(
		private router: Router,
		private _login: Login,
		private _parse: Parse,
		private _dashboardService: DashboardService,
		private _vcr: RootVCRService
	) { }

	ngOnInit() {
		window.scrollTo(0, 0);

		this._currentUserSubscription = this._login.profile.subscribe(profile => {
			console.log(profile);
			this.currentUser = profile;

			if (profile && profile.has('Client_Pointer')) {
				this._dashboardService.getClient().then(client => {
					console.log(client);
					console.log(client.get('ActiveSubscription'));
					if(client.get('IsTrialActive')) {
						console.log('TRIAL ACTIVE!');
						this._onTrial = client.get('IsTrialActive');
						const daysTrialLeft = client.get('DaysTrialLeft');
						this.trialDaysLeft = daysTrialLeft;
						this.indicatorValue = (daysTrialLeft * 50) / this._login.maxTrialDays;
						this.expiresOn = new Date(client.get('TrialExpiresOn'));
					} else if(client.has('ActiveSubscription')) {
						console.log('TRIAL NOT ACTIVE!');
						return this._dashboardService.getPlan(client.get('ActiveSubscription').get('StripePlanID'));
					}
				}).then(plan => {
					console.log('PLAN');
					console.log(plan);
					if(plan) {
						console.log("plan getting");
						console.log(plan.get('NameSwipeIn'));
						this._currentPlan = plan.get('NameSwipeIn');
					}
				});
			}

			this._dashboardService.checkContractsCount().then(res => {
				console.log(res);
				this.isFirst = res;
			});
		}, error => {
			console.error(error);
		});

	}

	get onTrial() {
		return this._onTrial;
	}

	get currentPlan() {
		return this._currentPlan;
	}

	ngOnDestroy() {
		this._currentUserSubscription.unsubscribe();
	}

	feedbackCreation() {
		this._vcr.createComponent(FeedbackAlertComponent);
	}
}
