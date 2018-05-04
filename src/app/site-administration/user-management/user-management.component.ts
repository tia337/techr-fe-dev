import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, NavigationStart } from '@angular/router';

import { RootVCRService } from '../../root_vcr.service';

import { FeedbackAlertComponent } from 'app/core/feedback-alert/feedback-alert.component';

@Component({
	selector: 'app-user-management',
	templateUrl: './user-management.component.html',
	styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit, OnDestroy {

	private urlSubscription;
	activeUrl = 'team-members';

	constructor(
		private _activatedRoute: ActivatedRoute,
		private _router: Router,
		private _root_vcr: RootVCRService
	) { }


	ngOnInit() {
		console.log(this._activatedRoute);
		this.urlSubscription = this._router.events.subscribe(event => {
			if (event instanceof NavigationStart) {
				let urlArray = event.url.split(/[\(|\)|\/|\:]+/);
				urlArray = urlArray.filter(item => item !== '');
				this.activeUrl = urlArray[urlArray.indexOf('user-management-sections') + 1];
			}
		});
	}

	ngOnDestroy() {
		this.urlSubscription.unsubscribe();
	}

	feedbackCreation() {
		this._root_vcr.createComponent(FeedbackAlertComponent);
	}

}
