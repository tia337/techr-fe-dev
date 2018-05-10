import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'underscore';

@Pipe({
	name: 'SearchPipe',
	pure: false
})
export class SearchPipe implements PipeTransform {
	transform(data: any[], searchTerm: string, type: 'skill' | 'role' | 'tag'): any[] {
		searchTerm = searchTerm.toLowerCase();
		return data.filter(item => {
			if (type === 'skill') {
				return item.skill.get('title').toLowerCase().includes(searchTerm);
			} else if (type == 'role') {
				return item.role.get('title').toLowerCase().includes(searchTerm);
			} else if (type == 'tag') {
				return item.tag.get('title').toLowerCase().includes(searchTerm);
			}
		});
	}
}

@Pipe({
	name: 'sortSkills',
	pure: false
})
export class sortSkillsPipe implements PipeTransform {
	transform(data: any[]): any[] {
		const skills = [];
		data.forEach(category => {
			category.skills.forEach(skill => {
				if (skill.expDuration !== 0) {
					skills.push(skill);
				}
			});
		});
		return _.sortBy(skills, skill => { return -skill.expDuration });
	}
}

@Pipe({
	name: 'SearchCountryPipe',
	pure: false
})
export class SearchCountryPipe implements PipeTransform {
	transform(data: any[], searchTerm: string): any[] {
		if (searchTerm) {
			return data.filter(item => {
				return item.country.get('Country').toLowerCase().includes(searchTerm.toLowerCase());
			});
		} else {
			return data.filter(item => {
				return item;
			});
		}
	}
}

@Pipe({
	name: 'FilterProjects',
	pure: false
})
export class FilterProjects implements PipeTransform {
	transform(data: any[], currentClient?: any): any[] {
		if (!currentClient) {
			return data;
		}
		return data.filter(client => client.get('projectEndClientName') === currentClient.get('clientOfClientName'));
	}
}
