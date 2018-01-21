import { Injectable } from '@angular/core';
import { Parse } from '../parse.service';
import { ContractStatus } from '../shared/utils';

@Injectable()
export class JobsPageService {

	constructor(private _parse: Parse) { }

	getSuggestedCandidatesCount(contractId: string) {
		return this._parse.execCloud('countSuggestedCandidates', { contractId: contractId });
	}

	getContracts(status: number) {
		const contractQuery = this._parse.Query('Contract');
		contractQuery.equalTo('Client', this._parse.Parse.User.current().get('Client_Pointer'));
		contractQuery.equalTo('status', status);
		contractQuery.include('jobCountry');
		contractQuery.include('SalaryCurrency');
		contractQuery.include('programingSkills.skill');
		contractQuery.include('roles');
		contractQuery.limit(10000);
		// contractQuery.ascending('createdAt');
		return contractQuery.find();
	}
}
