import { Injectable } from '@angular/core';
import { Parse } from '../../parse.service';
import { ContractStatus, JobBoardPush } from '../../shared/utils';

@Injectable()
export class JobBoxService {

	activeContract;

	constructor(private _parse: Parse) { }

	getSuggestedCandidatesCount(contractId: string) {
		return this._parse.Parse.Cloud.run('countSuggestedCandidates', {contractId: contractId});
	}

	getUserList(contract: any) {
		const userListQuery = new this._parse.Parse.Query('UserList');
		userListQuery.equalTo('contract', contract.toPointer());
		userListQuery.equalTo('contract', contract.toPointer());
		userListQuery.equalTo('Client', this._parse.Parse.User.current().get('Client_Pointer'));
		return userListQuery.find();
	}

	archiveContract(contract: any) {
		return this.unpublishJob(contract).then(() => {
			contract.set('status', ContractStatus.archived);
			return contract.save();
		});
	}

	activateContract(contract: any) {
		contract.set('status', ContractStatus.active);
		return contract.save();
	}

	deleteContract(contract: any) {
		return this.unpublishJob(contract).then(() => {
			contract.set('status', ContractStatus.deleted);
			return contract.save();
		});
	}

	getReferralsCount(contract: any) {
		const referralsCount = new this._parse.Parse.Query('EmployeeReferrals');
		referralsCount.equalTo('contract', contract);
		referralsCount.equalTo('Client', this._parse.Parse.User.current().get('Client_Pointer'));
		return referralsCount.count();
	}

	getIntegratedJobBoards(contract: any) {
		const jobBoardPushQuery = new this._parse.Parse.Query('JobBoardPush');
		jobBoardPushQuery.equalTo('Job', contract);
		jobBoardPushQuery.equalTo('Client', this._parse.Parse.User.current().get('Client_Pointer'));
		jobBoardPushQuery.equalTo('Status', JobBoardPush.active);
		jobBoardPushQuery.include('PushOnBoard');
		jobBoardPushQuery.select('PushOnBoard');
		return jobBoardPushQuery.find().then(JobBoardPushes => {
			return JobBoardPushes.map(jobBoardPush => {
				return jobBoardPush.get('PushOnBoard');
			});
		});
	}

	duplicateAsDraft(contractId: string) {
		return this._parse.Parse.Cloud.run('duplicateJobAsDraft', {contractId: contractId});
	}

	private unpublishJob(contract: any) {
		const jobBoardPushQuery = new this._parse.Parse.Query('JobBoardPush');
		jobBoardPushQuery.equalTo('Job', contract);
		jobBoardPushQuery.equalTo('Client', this._parse.Parse.User.current().get('Client_Pointer'));
		jobBoardPushQuery.equalTo('Status', JobBoardPush.active);
		return jobBoardPushQuery.find().then(jobBoardPushes => {
			jobBoardPushes.map(jobBoardPush => {
				jobBoardPush.set('Status', JobBoardPush.inactive);
			});
			return this._parse.Parse.Object.saveAll(jobBoardPushes);
		});
	}

	getClientProbabilitiesToCloseJob() {
		const clientId = this.getClientId();
		return this._parse.execCloud('getClientProbabilitiesToCloseJob', {clientId});
	}

	setLikelihoodToFill(contractId: string, likelihoodToFill: string ) {
		this._parse.execCloud('setLikelihoodToFill', {contractId: contractId , likelihoodToFill: parseFloat(likelihoodToFill)});
	}

	private getClientId() {
		return this._parse.getCurrentUser().get('Client_Pointer').id;

	}
}
