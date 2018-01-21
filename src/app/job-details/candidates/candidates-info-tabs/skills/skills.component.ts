import {Component, OnInit, Pipe, PipeTransform, OnDestroy } from '@angular/core';
import { SkillsService } from './skills.service';
import { Parse } from '../../../../parse.service';
import { ParseUser, ParsePromise, ParseObject } from 'parse';
import * as _ from 'underscore';
import {CandidatesService} from "../../candidates.service";

@Component({
	selector: 'app-skills',
	templateUrl: './skills.component.html',
	styleUrls: ['./skills.component.scss']
})
export class SkillsComponent implements OnInit, OnDestroy {

	skills: ParseObject;
	categories: any[];
	categoriesObject: ParseObject[];
	experience: any[];
	sortedSkills: any[];
	summary: string;
	lastExperience: Object[] = [];
	private _userIdSubscriprion;

	constructor(private _SkillsService: SkillsService, private _candidatesService: CandidatesService) {

	}

	ngOnInit() {
		this._userIdSubscriprion = this._candidatesService.userId.subscribe(userId => {

			//Getting skills and sorting by categoriy ids
			this._SkillsService.getSkills(userId).then(result => {
				this.skills = _.groupBy(result.get("developer").get("skills"), (value)=>{
					return value.get("skill").get("categories");
				});

				//Getting all the categories we have in skills
				this.categories = [];
				console.log('SKILLS: ', this.skills);
				Object.keys(this.skills).forEach((key) => {
					this.categories.push(key.toString());
				});

				// Grouping skills by years of exp
				this.sortedSkills = [];
				this.categories.forEach((cat) => {
					let obj = {} as any;
					this._SkillsService.getCategories().then(result => {
						this.categoriesObject = result;
						// for (let category of this.categoriesObject) {
						// 	if (category.id === cat) {
						// 		obj.category = category.get("title");
						// 	}
						// }
						obj.category = this.categoriesObject.find(category => {
							return category.id == cat;
						}).get("title");
					});
					obj.skills = _.groupBy(this.skills[cat], (s)=>{
						return s.get("selectedExperienceDuration");
					});
					this.sortedSkills.push(obj);
				});
				console.log(this.sortedSkills);
				console.log('CATEGORIES: ', this.categories);

				// SORTING BY EXP !!NEED TO BE FINISHED!!
				this.sortedSkills.forEach((cat) => {
					console.log(cat);
					cat = _.sortBy(Object.keys(cat.skills), (num)=>{
						console.log(num);
						return num * -1;
					});
					console.log(cat);
				});
				console.log(this.sortedSkills);
				// END

			});

			//Getting summary and last exp
			this._SkillsService.getSummary(userId).then(results => {
				this.summary = results;
			});
			this._SkillsService.getLastExperience(userId).then(results => {
				this.lastExperience  = results;
			});



		});
	}

	ngOnDestroy() {
		this._userIdSubscriprion.unsubscribe();
	}

}

@Pipe({name: 'keys'})
export class KeysPipe implements PipeTransform {
	transform(value, args:any[]) : any {
		let keys = [];
		for (let key in value) {
			keys.push({key: key, value: value[key]});
		}
		return keys;
	}
}
