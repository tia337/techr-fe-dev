import { Injectable } from '@angular/core';
import { Parse } from '../../../../parse.service';
import { ParseUser, ParsePromise, ParseObject } from 'parse';


@Injectable()
export class SkillsService {

	constructor(private _parse: Parse) { }

	getSkills(userId: string){
		let query = this._parse.Query("User");
		query.equalTo("objectId", userId);
		query.include('developer');
		query.include('developer.skills');
		query.include('developer.skills.skill');
		query.include('developer.skills.skill.categories');
		return query.first();
	}
	getCategories(){
		let query = this._parse.Query("SkillCategory");
		return query.find();
	}
	getSummary(userId){
		let query = this._parse.Query("User");
		query.equalTo("objectId", userId);
		return query.first().then(results => {
			return results.get("summary");
		});
	}
	getLastExperience(userId){
		let query = this._parse.Query("User");
		query.equalTo("objectId", userId);
		return query.first().then(results => {
			return results.get("positions");
		});
	}
}
