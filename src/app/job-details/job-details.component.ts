import { ChangeDetectorRef, Component, OnDestroy, OnInit, OnChanges } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd} from '@angular/router';
import { JobDetailsService } from './job-details.service';
import { DeveloperListType, Loading } from '../shared/utils';
import * as _ from 'underscore';
import { Socket } from 'ng-socket-io';
import { Parse } from '../parse.service';
import { CandidatesService } from './candidates/candidates.service';
import { CompanySettingsService } from 'app/site-administration/company-settings/company-settings.service';

@Component({
	selector: 'app-job-details',
	templateUrl: './job-details.component.html',
	styleUrls: ['./job-details.component.scss']
})
export class JobDetailsComponent implements OnInit, OnDestroy, OnChanges {

	contractId: string = this._route.snapshot.params['id'];
	contract;
	currentInterviewStage;
	private _stages = [];
	stages;
	private _stageSubscription;
	private _stageDisableSubscription;
	stagesDisabled: number;
	pipelineLoader = Loading.loading;
	private previousUrl;

	clientProbabilitiesToCloseJob = [];
	likelihoodEnabled = false;

	selectedPercentage = false;
	selectedLikelihoodPercentage = 50;
	initiationsCount = 1;

	constructor(
		private _jobDetailsService: JobDetailsService,
		private _route: ActivatedRoute,
		private _router: Router,
		private _candidatesService: CandidatesService,
		private _socket: Socket,
		private _parse: Parse,
		private _changeDetector: ChangeDetectorRef,
		private _companySettingsService: CompanySettingsService
	) { }

	ngOnInit() {
		
		this._socket.emit('enterPipeLineGroup', {
			'contract': this.contractId,
		});

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
			this._socket.on('pipelineCountUpdate', data => {
				const userListQuery = new this._parse.Parse.Query('UserList');
				userListQuery.get(data.userListId).then(userList => {
					const oldStage = this.stages.find(stage => {
						if (userList.get('movingHistory') && userList.get('movingHistory').length > 1) {
							return stage.type === userList.get('movingHistory')[userList.get('movingHistory').length - 2].type;
						}
						return false;
					});
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
		this._companySettingsService.getClientProbabilitiesToCloseJob()
			.then(data => {
				this.clientProbabilitiesToCloseJob = data;
			});
		
		console.log('on init job details');
	}

	ngOnChanges() {
		// console.log('CHANGED');
	}

	initData() {
		this._jobDetailsService.getContract().then(contract => {
			this.contract = contract;
			if (this.contract.get('hiringStages')) {
				console.log(this.contract.get('hiringStages'));
				this._stages.push(
					{
						index: 0,
						type: 'suggested',
						value: 0,
						title: 'Suggested',
						candidates: []
					},
					{
						index: 1,
						type: 'applied',
						value: 0,
						title: 'Applied',
						candidates: []
					},
					{
						index: 2,
						type: 'refferals',
						value: 0,
						title: 'Employee Referrals',
						candidates: []
					}
				);
				this.contract.get('hiringStages').forEach(stage => {
					this._stages.push(stage);
				});
				this._candidatesService.getSuggestedCandidatesWeb(this.contract.id).then(result => {
					let candidates = [];
					result.results.forEach(candidate => {
						candidates.push(candidate.get('developer').id);
					});
					this._stages[0].candidates = candidates;
				});
				
				this._candidatesService.getAppliedCandidates(this.contract.id).then(result => {
					let candidates = [];
					result.results.forEach(candidate => {
						candidates.push(candidate.get('developer').id);
					});
					this._stages[1].candidates = candidates;
				});
				this._candidatesService.getReferrals(this.contract.id).then(result => {
					let candidates = [];
					result.results.forEach(candidate => {
						candidates.push(candidate.get('developer').id);
					});
					this._stages[2].candidates = candidates;
				});
			} else if (this.contract.get('hiringStages') === null || this.contract.get('hiringStages') === undefined || this.contract.get('hiringStages') === '') {
				this._stages.push({
					index: 1,
					type: DeveloperListType.applied,
					value: contract.get('applies') ? contract.get('applies').length : 0,
					title: 'Applied'
				});
				return contract;
			};
		}).then(contract => {
			return this._jobDetailsService.getUserList(contract);
		}).then(userList => {
			const groupedUsers = _.groupBy(userList, userListObj => {
				return userListObj.get('listType');
			});
			if (this.contract.get('hiringStages')) {
				console.log('1');
			} else {
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
				this._stages.push({
					index: 8,
					type: DeveloperListType.rejected,
					value: groupedUsers[DeveloperListType.rejected] ? groupedUsers[DeveloperListType.rejected].length : 0,
					title: 'Rejected'
				});
				this._stages.push({
					index: 9,
					type: DeveloperListType.withdrawn,
					value: groupedUsers[DeveloperListType.withdrawn] ? groupedUsers[DeveloperListType.withdrawn].length : 0,
					title: 'Withdrawn'
				});
			}
		}).then(res => {
			return this._jobDetailsService.getReferralsCount(this.contract);
		}).then(referralsCount => {
			if (!this.contract.get('hiringStages')) {
				this._stages.splice(1,0,{
					index: 2,
					type: this.contract.get('hiringStages') ? 'refferals' : DeveloperListType.employeeReferrals,
					value: referralsCount,
					title: 'Employee Referrals'
				});
			}
		}).then(res => {
			return this._jobDetailsService.getSuggestedCandidatesCount(this.contractId);
		}).then(suggestionsCount => {
			
			if (this.contract.get('hiringStages')) {
				this.stages = this._stages;
			} else {
				this._stages.splice(0, 0 ,{
					index: 0,
					type: this.contract.get('hiringStages') ? 'suggested' : DeveloperListType.suggested,
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
			}
			this._jobDetailsService.candidatesCount = this.stages;
			this.pipelineLoader = Loading.success;
		}, error => {
			console.error(error);
		});
		this._jobDetailsService._setCandidatesAfterMovingCandidate.distinct().skipWhile(val => val === null).subscribe(value => {
			this._stages.forEach(stage => {
				if (stage.type === value.stageType) {
					stage.candidates.push(value.candidate);
				}
				if (stage.type === value.previousStage) {
					stage.candidates = value.previousStageCandidates;
				}
			});
		});
	}

	createCustomHiringStages(contract) {
		this._jobDetailsService.getReferralsCount(contract).then(referralsCount => {
			const data = {
				index: 2,
				type: DeveloperListType.employeeReferrals,
				value: referralsCount,
				title: 'Employee Referrals'
			};
			this._stages.splice(1, 0, data);
		});
		this._jobDetailsService.getSuggestedCandidatesCount(contract.id).then(suggestionsCount => {
			const data = {
				index: 0,
				type: DeveloperListType.suggested,
				value: suggestionsCount,
				title: 'Suggested'
			};
			this._stages.splice(0, 0, data);
		});
		this.contract.get('hiringStages').forEach(stage => {
			this._stages.push(stage);
		});
		this.stages = this._stages;
		this._jobDetailsService.candidatesCount = this.stages;
		this.pipelineLoader = Loading.success;
	}

	goBack() {
		
	} 

	setCandidatesCustomHiringWorkFlowStage(candidates) {
		if (candidates) this._jobDetailsService.setCandidatesCustomHiringWorkflow(candidates);
	}

	setActiveStage() {
		this._jobDetailsService.activeStage = this.currentInterviewStage;	
		localStorage.removeItem('queryParams');
	}

	get Loading() {
		return Loading;
	}

	setLikelihoodPercentage(likelihoodPercentage, contract) {
		contract.set('likelihoodToFill', likelihoodPercentage);
		this._jobDetailsService.setLikelihoodToFill(this.contractId, Number(likelihoodPercentage));
		this.selectedPercentage = true;
		this.likelihoodEnabled = false;
	}

	ngOnDestroy() {
		// if (localStorage.getItem('initiationsCount') === '2') {
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
			localStorage.removeItem('initiationsCount');
			localStorage.removeItem('contractId');
		// } 
	}

}
