import { Component, OnInit, OnDestroy, EventEmitter, Output } from '@angular/core';
import { StripeService } from '../../services/stripe.service';
import { RootVCRService } from '../../../root_vcr.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AddCardService } from './add-card.service';
import {BehaviorSubject} from 'rxjs/Rx';
import { AlertComponent } from '../../alert/alert.component';

@Component({
	selector: 'app-add-card',
	templateUrl: './add-card.component.html',
	styleUrls: ['./add-card.component.scss']
})
export class AddCardComponent implements OnInit, OnDestroy {

	private _cardNumber;
	private _cardCvc;
	private _cardExpiry;
	private _postalCode;

	billingAddressForm: FormGroup;

	public useCardNow: boolean = false;

	public useCardNowBool: boolean = false;

	public hasStripeId: boolean;

	private _isDefault: boolean;
	private _alwaysDefault = false;

	private error: any;

	addingCart: boolean;

	@Output() updateCardEvent: EventEmitter<any> = new EventEmitter();

	useCardNowSubsc: EventEmitter<any> = new EventEmitter();

	constructor(
		private _stripe: StripeService,
		private _root_vcr: RootVCRService,
		private _formBuilder: FormBuilder,
		private _addCardService: AddCardService
	) { }

	ngOnInit() {


		this._addCardService.getStripeCustomer().then(res => {
			// console.log('ALALALAL');
			if (res && res.sources.data.length == 0) {
				this.alwaysDefault = true;
			}
		});

		this.billingAddressForm = this._formBuilder.group({
			name: '',
			address_country: '',
			address_state: '',
			address_city: '',
			address_line1: '',
			address_line2: ''
		});

		const elements = this._stripe.stripe.elements();

		const style = {
			base: {
				fontSize: '16px',
				lineHeight: '30px'
			}
		};

		this._cardNumber = elements.create('cardNumber', {style});
		this._cardCvc = elements.create('cardCvc', {style});
		this._cardExpiry = elements.create('cardExpiry', {style});
		this._postalCode = elements.create('postalCode', {style});

		this._cardNumber.mount('#card-number');
		this._cardCvc.mount('#card-cvc');
		this._cardExpiry.mount('#card-expiry');
		this._postalCode.mount('#postal-code');

	}

	addCard() {
		this.addingCart = true;
		console.log(this.hasStripeId);
		if(this.hasStripeId === false) {
			let curToken;
			this._stripe.stripe.createToken(this._cardNumber, this.billingAddressForm.value).then( response => {
				if (response.token) {
					return response.token;
				} else if (response.error) {
					console.log("token creation error:");
					console.log(response.error);
					if(!this.error)
						this.error  = response.error;
					return
				}
			}).then( token => {
				curToken = token;
				this.useCardNowSubsc.emit();
				return this._addCardService.makeNewStripeCustomer(curToken);
			}).then(res=>{
				console.log(res);
				this.updateCardEvent.emit();
				this._root_vcr.clear();
				this.addingCart = false;
			},error=>{
				if(!this.error)
					this.error = error;
				console.log("newStripeCustomer Error");
				console.log(error);
				this.showErrorAlert(this.error);
				this.addingCart = false;
			});
		}else{
			let curToken;
			this._stripe.stripe.createToken(this._cardNumber, this.billingAddressForm.value).then( response => {
				if (response.token) {
					return response.token;
				} else if (response.error) {
					console.error("token creation error:");
					console.log(response.error);
					if(!this.error)
						this.error = response.error;
					return;
				}
			}).then( token => {
				curToken = token;
				this.useCardNowSubsc.emit();
			}).then(()=>{
				return this._addCardService.addCard(curToken);
			}).then(card => {
				if (this.isDefault) {
					return this._addCardService.setToDefault(card.id);
				}else{
					return ;
				}
			},error =>{
				console.log("Add card error: ");
				console.log(error);
				if(!this.error)
					this.error = error;

			}).then(res => {
				this.updateCardEvent.emit();
				this._root_vcr.clear();
				if(this.error){
					console.log(this.error);
					this.showErrorAlert(this.error);
				}
				this.addingCart = false;
			}, error=>{
				console.log("Set to default error:"); 
				console.log(error);
				if(!this.error)
					this.error = error;
				console.log(this.error);
				this.showErrorAlert(this.error);
				this.addingCart = false;
			});
		}


	}

	showErrorAlert(error){
		const alert = this._root_vcr.createComponent(AlertComponent);
		alert.title = 'Error';
		alert.icon = 'frown-o';
		alert.type = "sad";
		alert.contentAlign = 'left';
		alert.content = `<a>
		Sorry, an error occurred while processing the payment.<br>Check your Internet connection, payment details and try again later.<br>
		<a style = "margin-top:10px">Error: ` + error.code + `</a><br>` + `Message: ` + error.message + `</a>`;
		alert.addButton({
			title: 'Close',
			type: 'primary',
			onClick: () => this._root_vcr.clear()
		});
		this.error = false;
	}

	// set updateCardEvent(event: EventEmitter<any>) {
	//   console.log('setter event: ', event);
	//   this._updateCardEvent = event;
	// }

	// set callback(value: Function) {
	//   this._callback = value;
	// }

	close() {
		this._root_vcr.clear();
	}

	ngOnDestroy() {
		// this._updateCardEvent.emit();
		console.log('on destroy');
	}


	test() {
		console.log(this.useCardNowBool);
	}

	get alwaysDefault() {
		return this._alwaysDefault;
	}

	set alwaysDefault(value: boolean) {
		if (value) {
			this._alwaysDefault = true;
			this._isDefault = true;
		} else {
			this._alwaysDefault = true;
			this._isDefault = false;
		}
	}

	get isDefault() {
		return this._isDefault;
	}

	set isDefault(value: boolean) {
		if (!this._alwaysDefault) {
			this._isDefault = value;
		}
	}

}
