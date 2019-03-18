import { Injectable } from '@angular/core';
import { environment } from './../../../environments/environment';
import * as branch from 'branch-sdk';


@Injectable()
export class Branch {

	private _branch;
	private _data;

	constructor() {
		this._branch = branch;

		this._data = new Promise((resolve, reject) => {
			this._branch.init(environment.BRANCHIO_KEY, (error, data) => {
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
