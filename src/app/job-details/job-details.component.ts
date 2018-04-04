import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JobDetailsService } from './job-details.service';
import { DeveloperListType, Loading } from '../shared/utils';
import * as _ from 'underscore';
import { Socket } from 'ng-socket-io';
import { Parse } from '../parse.service';
import { CandidatesService } from './candidates/candidates.service';

@Component({
	selector: 'app-job-details',
	templateUrl: './job-details.component.html',
	styleUrls: ['./job-details.component.scss']
})
export class JobDetailsComponent implements OnInit, OnDestroy {

	contractId: string = this._route.snapshot.params['id'];
	contract;
	currentInterviewStage;
	private _stages = [];
	stages;
	private _stageSubscription;
	private _stageDisableSubscription;
	stagesDisabled: number;
	pipelineLoader = Loading.loading;

	constructor(
		private _jobDetailsService: JobDetailsService,
		private _route: ActivatedRoute,
		private _candidatesService: CandidatesService,
		private _socket: Socket,
		private _parse: Parse,
		private _changeDetector: ChangeDetectorRef
	) { }

	ngOnInit() {
		this._candidatesService.throwNotificationCandidate(localStorage.getItem('queryParams'));
		this._socket.emit('enterPipeLineGroup', {
			'contract': this.contractId,
		});
		console.log('Entered the room');
		this._stageDisableSubscription = this._jobDetailsService.isStagesDisabled.subscribe(value => {
			this.stagesDisabled = value;
			this._changeDetector.detectChanges();
		});
		this._stageSubscription = this._jobDetailsService.activeStage.subscribe(stage => {
			this.currentInterviewStage = stage;
		});
		this._jobDetailsService.contractId = this.contractId;
		this.initData();

		this._jobDetailsService.getContract().then(contract => {
			// Update numbers in pipeline
			this._socket.on('pipelineCountUpdate', data => {
				// console.log("Received emit from server!", data);
				const userListQuery = new this._parse.Parse.Query('UserList');
				userListQuery.get(data.userListId).then(userList => {
					// console.log('UPDATED!: ', userList);
					const oldStage = this.stages.find(stage => {
						// console.log("stage.type", stage.type);
						// console.log(userList.get('movingHistory'));
						if (userList.get('movingHistory') && userList.get('movingHistory').length > 1) {
							return stage.type === userList.get('movingHistory')[userList.get('movingHistory').length - 2].type;
						}
						return false;
					});
					// console.log('oldStage', oldStage);
					// console.log('this.stages', this.stages);
					// console.log(this.stages.indexOf(oldStage));
					if (oldStage) {
						if (this.stages[this.stages.indexOf(oldStage)].value > 0) {
							this.stages[this.stages.indexOf(oldStage)].value -= 1;
						} else {
							this.stages[this.stages.indexOf(oldStage)].value = 0;
						}
					}
					const newStage = this.stages.find(stage => {
						return stage.type === userList.get('listType');
					});
					this.stages[this.stages.indexOf(newStage)].value += 1;
					this._jobDetailsService.candidatesCount = this.stages;
				});
			});

		});

	}

	initData() {
		this._jobDetailsService.getContract().then(contract => {
			this.contract = contract;
			this._stages.push({
				index: 1,
				type: DeveloperListType.applied,
				value: contract.get('applies') ? contract.get('applies').length : 0,
				title: 'Applied'
			});
			return contract;
		}).then(contract => {
			return this._jobDetailsService.getUserList(contract);
		}).then(userList => {
			const groupedUsers = _.groupBy(userList, userListObj => {
				return userListObj.get('listType');
			});
			this._stages.push({
				index: 3,
				type: DeveloperListType.shortlist,
				value: groupedUsers[DeveloperListType.shortlist] ? groupedUsers[DeveloperListType.shortlist].length : 0,
				title: 'Shortlist'
			});

			this._stages.push({
				index: 4,
				type: DeveloperListType.phoneInterview,
				value: groupedUsers[DeveloperListType.phoneInterview] ? groupedUsers[DeveloperListType.phoneInterview].length : 0,
				title: 'Phone Interview'
			});

			this._stages.push({
				index: 5,
				type: DeveloperListType.f2fInterview,
				value: groupedUsers[DeveloperListType.f2fInterview] ? groupedUsers[DeveloperListType.f2fInterview].length : 0,
				title: 'F2F Interview'
			});

			this._stages.push({
				index: 6,
				type: DeveloperListType.jobOffered,
				value: groupedUsers[DeveloperListType.jobOffered] ? groupedUsers[DeveloperListType.jobOffered].length : 0,
				title: 'Job Offered'
			});

			this._stages.push({
				index: 7,
				type: DeveloperListType.hired,
				value: groupedUsers[DeveloperListType.hired] ? groupedUsers[DeveloperListType.hired].length : 0,
				title: 'Hired'
			});
		}).then(() => {
			return this._jobDetailsService.getReferralsCount(this.contract);
		}).then(referralsCount => {
			console.log('Stages: ', this._stages);
			this._stages.push({
				index: 2,
				type: DeveloperListType.employeeReferrals,
				value: referralsCount,
				title: 'Employee Referrals'
			});
		}).then(() => {
			return this._jobDetailsService.getSuggestedCandidatesCount(this.contractId);
		}).then(suggestionsCount => {
			this._stages.push({
				index: 0,
				type: DeveloperListType.suggested,
				value: suggestionsCount,
				title: 'Suggested'
			});
			this.stages = this._stages.sort((stage1, stage2) => {
				if (stage1.index > stage2.index) {
					return 1;
				} else if (stage1.index === stage2.index) {
					return 0;
				} else {
					return -1;
				}
			});
			this._jobDetailsService.candidatesCount = this.stages;
			this.pipelineLoader = Loading.success;
		}, error => {
			console.error(error);
		});
	}

	setActiveStage() {
		this._jobDetailsService.activeStage = this.currentInterviewStage;
		console.log('SET ACTIVE STAGE');
		localStorage.removeItem('queryParams');
	}

	get Loading() {
		return Loading;
	}

	ngOnDestroy() {
		this._socket.emit('leavingPipeLineGroup', this.contractId);
		this._jobDetailsService.contractId = null;
		this._jobDetailsService.suggestionsCount = null;
		this._jobDetailsService = null;
		this.contractId = null;
		this.contract = null;
		this.currentInterviewStage = null;
		this._stages = null;
		this.stages = null;
		this._stageSubscription.unsubscribe();
		this._stageDisableSubscription.unsubscribe();
		this._socket.removeAllListeners('pipelineCountUpdate');
		localStorage.removeItem('queryParams');
	}

}
