import { Injectable } from '@angular/core';
import * as branch from 'branch-sdk';

@Injectable()
export class Branch {

	private _branch;
	private _data;

	constructor() {
		this._branch = branch;

		this._data = new Promise((resolve, reject) => {
			this._branch.init('key_test_cfsBaSN7mn0ntAfhZq2A4nkivFjzYZKu', (error, data) => {
				if (data) {
					resolve(data.data_parsed);
				}
			});
		});
	}

	get data() {
		return this._data;
	}

	sendSMS(number: string) {
		this._data.then(branch => {
			console.log('Are we sending something?');
			this._branch.sendSMS(number, {
				tags: [],
				channel: 'sms',
				feature: 'TextMeTheApp',
				data: {}
			}, {}, this.callback);
		});
	}
	callback(err, result) {
		if (err) {
			console.log('Sorry, something went wrong.');
		} else {
			console.log('SMS sent!');
		}
	};
}
