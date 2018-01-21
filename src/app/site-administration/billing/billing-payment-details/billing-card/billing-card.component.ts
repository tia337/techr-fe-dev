import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { RootVCRService } from '../../../../root_vcr.service';
import { UpdateCardComponent } from './update-card/update-card.component';
import { BillingCardService } from './billing-card.service';
import { AlertComponent } from '../../../../shared/alert/alert.component';
import { Parse } from '../../../../parse.service';

// import { AddCardComponent } from './add-card/add-card.component';
import { AddCardComponent } from '../../../../shared/stripe/add-card/add-card.component';

@Component({
	selector: 'card',
	templateUrl: './billing-card.component.html',
	styleUrls: ['./billing-card.component.scss']
})
export class BillingCardComponent implements OnInit, OnDestroy {

	@Input('card') cardDetails;
	@Input('isDefault') isDefault;
	@Output('cardUpdate') cardUpdate: EventEmitter<any> = new EventEmitter();
	@Output('onCreate') onCreate: EventEmitter<any> = new EventEmitter();

	deleteCardActive: boolean = false;

	constructor(private _root_vcr: RootVCRService, private _billingCardService: BillingCardService, private _parse: Parse) { }

	ngOnInit() {
		console.log(this.cardDetails);
	}

	updateCard() {
		this._root_vcr.clear();
		const updateCardModal = this._root_vcr.createComponent(UpdateCardComponent);
		updateCardModal.card = this.cardDetails;
		updateCardModal.updateCardEvent = this.cardUpdate;
	}

	removeCard() {

		const alert = this._root_vcr.createComponent(AlertComponent);


		if (this.isDefault) {
			alert.title = 'Remove default payment method';
			alert.icon = 'exclamation-triangle';
			// alert.addLine('Removing your default payment method might affect your users’ subscription renewal. ' +
			//   'Please make sure you always have a default payment method properly set up.');

			alert.content = `
        Removing your default payment method might affect your users’ subscription renewal.
        <br/>
        Please make sure you always have a default payment method properly set up.
      `;
		} else {
			alert.title = 'Remove Card';
			alert.icon = 'credit-card-alt';

			alert.content = `
        Hi, ` + this._parse.Parse.User.current().get('firstName') + `. Please, confirm that you want to remove your ` +
				this.cardDetails.brand + ` card ending on ` + this.cardDetails.last4 + ` from your payment methods`;
			// alert.addLine('Hi, ' + this._parse.Parse.User.current().get('firstName') + '. Please, confirm that you want to remove your ' +
			//   this.cardDetails.brand + ' card ending on ' + this.cardDetails.last4 + ' from your payment methods');
		}


		alert.addButton({
			title: 'Confirm',
			type: 'warn',
			loader: true,
			onClick: () => {
				this.deleteCardActive = true;
				this._billingCardService.removeCard(this.cardDetails.id).then(result => {
					console.log(result);
				}).then(() => {
					this.cardUpdate.emit();
				}).then(() => {
					this.deleteCardActive = false;
					this._root_vcr.clear();
				});
			}
		});
		alert.addButton({
			title: 'Cancel',
			type: 'secondary',
			onClick: () => this._root_vcr.clear()
		});
	}

	addCard() {
		// this._root_vcr.clear();
		const addCardModal = this._root_vcr.createComponent(AddCardComponent);
		// addCardModal.callback = this.test;
		addCardModal.updateCardEvent.subscribe( event => {
			// this.test(event);
			this.onCreate.emit();
		});
	}

	test(event) {
		console.log('test: card added: ', event);
	}

	setToDefault() {

		const alert = this._root_vcr.createComponent(AlertComponent);

		alert.title = 'Set card to default payment method';
		alert.icon = 'credit-card-alt';
		// alert.addLine('Hi, ' + this._parse.Parse.User.current().get('firstName') + '. Please, confirm that you want to set up your ' +
		//   this.cardDetails.brand + ' card ending on ' + this.cardDetails.last4 + ' as the default payment method');

		alert.content = `
      Hi, ` + this._parse.Parse.User.current().get('firstName') + `. Please, confirm that you want to set up your ` +
			this.cardDetails.brand + ` card ending on ` + this.cardDetails.last4 + ` as the default payment method`;

		alert.addButton({
			title: 'Confirm',
			type: 'primary',
			onClick: () => {
				this._billingCardService.setToDefault(this.cardDetails.id).then(() => {
					this.cardUpdate.emit();
				}).then(() => {
					this._root_vcr.clear();
				});
			}
		});

		alert.addButton({
			title: 'Cancel',
			type: 'secondary',
			onClick: () => this._root_vcr.clear()
		});

	}

	ngOnDestroy() {
		this._root_vcr = null;
		this.isDefault = null;
		this.cardDetails = null;
	}

}
