import { Injectable } from '@angular/core';
import { Parse } from '../../../parse.service';

@Injectable()
export class AddCardService {

	constructor(private _parse: Parse) { }

	addCard(token) {
		return this._parse.Parse.User.current().get('Client_Pointer').fetch().then(client=>{
			let idCust = client.get("stripeCustomerId");
			return this._parse.Parse.Cloud.run('stripeAddCard', {tokenId: token.id});
		});
	}

	setToDefault(cardId: string) {
		return this._parse.Parse.Cloud.run('stripeUpdateCustomer', {
			args: { default_source: cardId }
		});
	}

	makeNewStripeCustomer(curToken){
		const parameters = {
			email: this._parse.Parse.User.current().get('Work_email'),
			clientName: this._parse.Parse.User.current().get('Client'),
			source: curToken.id,
		};

		console.log('create new customer');

		return this._parse.Parse.Cloud.run('createStripeCustomer', parameters);
	}

	getStripeCustomer() {
		const currentUser = this._parse.Parse.User.current();
		const clientQuery = new this._parse.Parse.Query('Clients');
		clientQuery.select('stripeCustomerId');
		return clientQuery.get(currentUser.get('Client_Pointer').id).then(client => {
			if (client.has('stripeCustomerId')) {
				return this._parse.Parse.Cloud.run('getStripeCustomer', {customerId: client.get('stripeCustomerId')});
			} else {
				return undefined;
			}
		});
	}



}
