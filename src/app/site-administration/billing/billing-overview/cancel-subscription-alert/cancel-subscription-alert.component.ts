import { Component, OnInit, OnDestroy, EventEmitter } from '@angular/core';
import { RootVCRService } from '../../../../root_vcr.service';
import { CancelSubscriptionAlertService } from './cancel-subscription-alert.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { AlertComponent } from '../../../../shared/alert/alert.component';
import { DatePipe } from '@angular/common';
import { ParseUser } from 'parse';

@Component({
	selector: 'app-cancel-subscription-alert',
	templateUrl: './cancel-subscription-alert.component.html',
	styleUrls: ['./cancel-subscription-alert.component.scss'],
	providers: [ DatePipe ]
})
export class CancelSubscriptionAlertComponent implements OnInit, OnDestroy {

	private _cancelationReasonSubscription;
	private _nextPeriodStart: Date;
	private _nextPeriodEnd: Date;
	private _subscriptionId: string;
	private _cancelationReasonNumber: BehaviorSubject<number> = new BehaviorSubject(0);
	private _me;
	private _planInterval: string;
	private _updateInvoice: Function;

	cancelationReasonText: string;
	isCancelTextVisible: boolean;

	constructor(
		private _root_vcr: RootVCRService,
		private _cancelSubscriptionService: CancelSubscriptionAlertService,
		private _date: DatePipe
	) { }

	ngOnInit() {
		this._cancelationReasonSubscription = this._cancelationReasonNumber.subscribe(currentValue => {
			this.isCancelTextVisible = currentValue === 3;
		});

		this._cancelSubscriptionService.getCurrentUser().then(me => {
			this._me = me;
			this._planInterval = me.get('Client_Pointer').get('ActiveSubscription').get('PlanInterval') || null;
		});
	}

	ngOnDestroy() {
		this._cancelationReasonSubscription.unsubscribe();
	}

	get cancelationReasonNumber(): number {
		return this._cancelationReasonNumber.value;
	}

	get me() {
		return this._me;
	}

	set nextPeriodStart(value: Date) {
		this._nextPeriodStart = value;
	}

	set nextPeriodEnd(value: Date) {
		this._nextPeriodEnd = value;
	}

	set cancelationReasonNumber(value: number) {
		this._cancelationReasonNumber.next(value);
	}

	set subscriptionId(value: string) {
		this._subscriptionId = value;
	}

	set updateInvoice(func: Function) {
		this._updateInvoice = func;
	}

	close() {
		this._root_vcr.clear();
	}

	showCancelModal() {
		this._root_vcr.clear();

		// this._cancelSubscriptionService.getCurrentUser().then(me => {

		if ( !this._me.get('Client_Pointer').get('IsCancelationOfferRedeemed') ) {

			const alert = this._root_vcr.createComponent(AlertComponent);
			alert.title = 'Hey ' + this._me.get('firstName') + ', '
				+ this._me.get('Client_Pointer').get('ClientName')
				+ ' is one of our favourites customers and we don’t want to see you guys going...';

			if (this._planInterval === 'month') {
				alert.content = `
            <h3 style="color: #2D581B;">Your next month is on us!</h3>
            <br/>
            Stay around and we will give you the next month FREE!
          `;
			} else if (this._planInterval === 'year') {
				alert.content = `
            <h3 style="color: #2D581B;">Get 2 months free on your next annual renewal!</h3>
            <br/>
            Stay around and we will give you 2 months FREE!
          `;
			}

			alert.width = 40;

			alert.type = 'happy';

			alert.addButton({
				type: 'primary',
				title: 'I\'ll take it',
				onClick: () => {
					this.getDiscount();
				}
			});

			alert.addButton({
				type: 'secondary',
				title: 'No, Thanks. Confirm cancelation',
				onClick: () => {
					this.cancelSubscription();
				}
			});

		} else {
			this.cancelSubscription();
		}

		// });
	}

	private cancelSubscription() {
		let cancelSubscriptionPromise;
		if (this.isCancelTextVisible) {
			cancelSubscriptionPromise = this._cancelSubscriptionService.cancelSubscription(
				this._subscriptionId,
				this._cancelationReasonNumber.value,
				this.cancelationReasonText
			);
		} else {
			cancelSubscriptionPromise = this._cancelSubscriptionService.cancelSubscription(
				this._subscriptionId,
				this._cancelationReasonNumber.value
			);
		}
		cancelSubscriptionPromise.then(() => {
			this._root_vcr.clear();
			const alert = this._root_vcr.createComponent(AlertComponent);
			alert.title = 'Ok, done! Your Subscription has been successfully cancelled.';
			alert.type = 'sad';
			alert.content = `
        <h3 style="color: #2D581B;">See you soon, ` + this._me.get('firstName') + `!
        <br/>
        Thanks for having invested some of your valuable time with us</h3>
        <br/>
        You still can use SwipeIn until ` + this._date.transform(this._nextPeriodStart, 'shortDate') + `.
        <br/>
        We hope to see you soon again!
      `;
		}).then(() => {
			this._updateInvoice();
		});
	}

	private getDiscount() {
		let couponId;

		if (this._planInterval === 'year') {
			couponId = '2monthsfreeannual';
		} else if (this._planInterval === 'month') {
			couponId = '100offnextmonth';
		}

		this._cancelSubscriptionService.getDiscount(couponId).then(() => {
			this._root_vcr.clear();

			const congratAlert = this._root_vcr.createComponent(AlertComponent);

			if (this._planInterval === 'month') {

				congratAlert.title = 'Hurray! Congrats ' + this._me.get('Client_Pointer').get('ClientName')
					+ ', Enjoy your next month completely free on us!';

				congratAlert.content = `
          <h3>You won’t be charged next month!</h3>
          Next billing period is FREE: `
					+ this._date.transform(this._nextPeriodStart, 'shortDate') + ` - `
					+ this._date.transform(this._nextPeriodEnd, 'shortDate');
			} else if (this._planInterval === 'year') {
				congratAlert.title = 'Hurray! Congrats ' + this._me.get('Client_Pointer').get('ClientName')
					+ ', You have unlocked 2 months free for your next renewal.';

				congratAlert.content = `
          <h3 style="color: #2D581B;">Enjoy 2 months completely free on us!</h3>
          <br/>
          Your next billing period has been discounted.`;
			}

			congratAlert.addButton({
				type: 'primary',
				title: 'Ok, got it!',
				onClick: () => {
					this._root_vcr.clear();
				}
			});

		}).then(() => {
			this._updateInvoice();
		});
	}

}
