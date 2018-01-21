import { JobsToShow } from './utils';
import { Injectable } from '@angular/core';

@Injectable()
export class FiltersService {

	public filters = [JobsToShow.myJobs];

	constructor() {}

	updateFilters(filters) {
		this.filters = filters;
	}

	getFilters () {
		return (this.filters);
	}
}
