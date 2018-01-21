import { Injectable } from '@angular/core';
import { Parse } from '../../../../parse.service';
import { ParseUser, ParsePromise, ParseObject } from 'parse';

@Injectable()
export class ScoringService {

	private companyName: string;
	private userObject: ParseObject;

	constructor(private _parse: Parse) { }

	getScoring(userId: string, contractId: string){
		console.log(userId);
		this.companyName = this._parse.getCurrentUser().get("Client");
		let query2 = this._parse.Query("User");
		query2.equalTo("objectId", userId );
		let userObj: ParseObject;
		return query2.first().then(results => {
			console.log(results);
			userObj = results;
			console.log(contractId);
			let query1 = this._parse.Query("Contract");
			query1.equalTo("objectId", contractId);
			console.log(query1.first());
			return query1.first();
		}).then(res => {
			console.log(res);
			let query = this._parse.Query("ScorecardWeightedScore");
			console.log(userObj);
			query.equalTo("Candidate", userObj);
			query.equalTo("Job", res);
			query.include("Scorecard");
			query.include("Job");
			query.include("Candidate");
			query.descending('createdAt');
			// console.log(query.find());
			return query.find();
		});

	}
	getCurrentUser() {
		return this._parse.Parse.User.current();
	}
}
