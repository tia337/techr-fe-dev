import { Component, OnInit, Input, Output, ViewChild, ElementRef, Renderer2, EventEmitter } from '@angular/core';
import { JobBoxService } from './job-box.service';
import { DeveloperListType, JobType, ContractStatus } from '../../shared/utils';
import * as _ from 'underscore';
import { Parse } from '../../parse.service';
import { JobDetailsService } from '../../job-details/job-details.service';
import { Router, ActivatedRoute } from '@angular/router';
import { RootVCRService } from '../../root_vcr.service';
import { UploadCvComponent } from 'app/upload-cv/upload-cv.component';
import { AlertComponent } from '../../shared/alert/alert.component';
import { Socket } from 'ng-socket-io';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { PreloaderComponent } from '../../shared/preloader/preloader.component';
import { CandidateChatService } from '../../job-details/candidates/candidates-info-tabs/candidate-chat/candidate-chat.service';
import { CandidatesService } from '../../job-details/candidates/candidates.service';


@Component({
	selector: 'job-box',
	templateUrl: './job-box.component.html',
	styleUrls: ['./job-box.component.scss']
})
export class JobBoxComponent implements OnInit, OnDestroy {

	@Input('status') status;
	@Input('contract') contract;
	@Output('statusChange') statusChange: EventEmitter<any> = new EventEmitter();
	@ViewChild('menu') menu: ElementRef;
	@ViewChild('jobBox') jobBox: ElementRef;

	clientProbabilitiesToCloseJob;
	showLikelihood= false;
	showLikelihoodInfo = false;
	selectedLikelihoodPercentage:number = 70;
	percentageGreen = false;
	percentageOrange = false;
	percentageNetural = false;

	private _stages = [];
	stages = [
		{
			index: 0,
			type: DeveloperListType.suggested,
			value: 0,
			title: 'Suggested'
		},
		{
			index: 1,
			type: DeveloperListType.applied,
			value: 0,
			title: 'Applied'
		},
		{
			index: 2,
			type: DeveloperListType.employeeReferrals,
			value: 0,
			title: 'Employee Referrals'
		},
		{
			index: 3,
			type: DeveloperListType.shortlist,
			value: 0,
			title: 'Shortlist'
		},
		{
			index: 4,
			type: DeveloperListType.phoneInterview,
			value: 0,
			title: 'Phone Interview'
		},
		{
			index: 5,
			type: DeveloperListType.f2fInterview,
			value: 0,
			title: 'F2F Interview'
		},
		{
			index: 6,
			type: DeveloperListType.jobOffered,
			value: 0,
			title: 'Job Offered'
		},
		{
			index: 7,
			type: DeveloperListType.hired,
			value: 0,
			title: 'Hired'
		},
		{
			index: 8,
			type: DeveloperListType.rejected,
			value: 0,
			title: 'Rejected'
		},
		{
			index: 9,
			type: DeveloperListType.withdrawn,
			value: 0,
			title: 'Withdrawn'
		}
	];

	jobBoardPushes = [];
	jobBoardPushesString = '';

	constructor(
		private _jobBoxService: JobBoxService,
		private _parse: Parse,
		private _router: Router,
		private _jobDetailsService: JobDetailsService,
		private _candidatesService: CandidatesService,
		private _renderer: Renderer2,
		private _route: ActivatedRoute,
		private _root_vcr: RootVCRService,
		private _socket: Socket,
	) { }

	ngOnInit() {
		this.initJobBox();
		this._socket.emit('enterPipeLineGroup', {
			'contract': 'm' + this.contract.id,
		});
		this._socket.on('pipelineMainCountUpdate', data => {
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
		this._jobBoxService.getClientProbabilitiesToCloseJob()
			.then(data => {
				this.clientProbabilitiesToCloseJob =  data;
			});
	}

	private initJobBox() {
		const promises = [];
		const clientId = this._parse.getClientId();
		
		if (this.contract.get('hiringStages')) {
			this._jobBoxService.getIntegratedJobBoards(this.contract).then(res => {
				this.jobBoardPushes = res;
				res.forEach((jobBoard, index) => {
					if (index === 0) {
						this.jobBoardPushesString += jobBoard.get('Name');
					} else {
						this.jobBoardPushesString += ', ' + jobBoard.get('Name');
					}
				});
			});
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
			this.contract.get('hiringStages').forEach(stage => {
				this._stages.push(stage);
			});
			this.stages = this._stages;
		} else if (this.contract.get('hiringStages') === null || this.contract.get('hiringStages') === undefined || this.contract.get('hiringStages') === '') {
			this._jobBoxService.getIntegratedJobBoards(this.contract).then(res => {
				this.jobBoardPushes = res;
				res.forEach((jobBoard, index) => {
					if (index === 0) {
						this.jobBoardPushesString += jobBoard.get('Name');
					} else {
						this.jobBoardPushesString += ', ' + jobBoard.get('Name');
					}
				});
			});
			this._parse.execCloud('getStandartHiringWorkFlow', { clientId: clientId }).then(result => {
				if (result.length > 0) {
					console.log(result);
					this._stages.push({
						index: 1,
						type: DeveloperListType.applied,
						value: this.contract.get('applies') ? this.contract.get('applies').length : 0,
						title: 'Applied'
					});
					const suggestionsPromise = this._jobBoxService.getSuggestedCandidatesCount(this.contract.id);
					promises.push(suggestionsPromise);
					suggestionsPromise.then(suggestionsCount => {
						this._stages.push({
							index: 0,
							type: DeveloperListType.suggested,
							value: suggestionsCount,
							title: 'Suggested'
						});
					});
					const referralsPromise = this._jobBoxService.getReferralsCount(this.contract);
					promises.push(referralsPromise);
					referralsPromise.then(referralsCount => {
						this._stages.push({
							index: 2,
							type: DeveloperListType.employeeReferrals,
							value: referralsCount,
							title: 'Employee Referrals'
						});
						this._stages.push(result);
					});
				} else {
					console.log('no result');
					this._stages.push({
						index: 1,
						type: DeveloperListType.applied,
						value: this.contract.get('applies') ? this.contract.get('applies').length : 0,
						title: 'Applied'
					});
		
					const suggestionsPromise = this._jobBoxService.getSuggestedCandidatesCount(this.contract.id);
					promises.push(suggestionsPromise);
					suggestionsPromise.then(suggestionsCount => {
						this._stages.push({
							index: 0,
							type: DeveloperListType.suggested,
							value: suggestionsCount,
							title: 'Suggested'
						});
					});
		
					const userListPromise = this._jobBoxService.getUserList(this.contract);
					promises.push(userListPromise);
					userListPromise.then(userList => {
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
		
						this._stages.push({
							index: 8,
							type: DeveloperListType.rejected,
							value: groupedUsers[DeveloperListType.rejected] ? groupedUsers[DeveloperListType.rejected].length : 0,
							title: 'Rejected'
						});
					});
		
					const referralsPromise = this._jobBoxService.getReferralsCount(this.contract);
					promises.push(referralsPromise);
					referralsPromise.then(referralsCount => {
						this._stages.push({
							index: 2,
							type: DeveloperListType.employeeReferrals,
							value: referralsCount,
							title: 'Employee Referrals'
						});
					});
		
					this._parse.Parse.Promise.when(promises).then(() => {
						this.stages = this._stages.sort((stage1, stage2) => {
							if (stage1.index > stage2.index) {
								return 1;
							} else if (stage1.index === stage2.index) {
								return 0;
							} else {
								return -1;
							}
						});
					});
				}
			});

			// this._stages.push({
			// 	index: 1,
			// 	type: DeveloperListType.applied,
			// 	value: this.contract.get('applies') ? this.contract.get('applies').length : 0,
			// 	title: 'Applied'
			// });

			// const suggestionsPromise = this._jobBoxService.getSuggestedCandidatesCount(this.contract.id);
			// promises.push(suggestionsPromise);
			// suggestionsPromise.then(suggestionsCount => {
			// 	this._stages.push({
			// 		index: 0,
			// 		type: DeveloperListType.suggested,
			// 		value: suggestionsCount,
			// 		title: 'Suggested'
			// 	});
			// });

			// const userListPromise = this._jobBoxService.getUserList(this.contract);
			// promises.push(userListPromise);
			// userListPromise.then(userList => {
			// 	const groupedUsers = _.groupBy(userList, userListObj => {
			// 		return userListObj.get('listType');
			// 	});
			// 	this._stages.push({
			// 		index: 3,
			// 		type: DeveloperListType.shortlist,
			// 		value: groupedUsers[DeveloperListType.shortlist] ? groupedUsers[DeveloperListType.shortlist].length : 0,
			// 		title: 'Shortlist'
			// 	});

			// 	this._stages.push({
			// 		index: 4,
			// 		type: DeveloperListType.phoneInterview,
			// 		value: groupedUsers[DeveloperListType.phoneInterview] ? groupedUsers[DeveloperListType.phoneInterview].length : 0,
			// 		title: 'Phone Interview'
			// 	});

			// 	this._stages.push({
			// 		index: 5,
			// 		type: DeveloperListType.f2fInterview,
			// 		value: groupedUsers[DeveloperListType.f2fInterview] ? groupedUsers[DeveloperListType.f2fInterview].length : 0,
			// 		title: 'F2F Interview'
			// 	});

			// 	this._stages.push({
			// 		index: 6,
			// 		type: DeveloperListType.jobOffered,
			// 		value: groupedUsers[DeveloperListType.jobOffered] ? groupedUsers[DeveloperListType.jobOffered].length : 0,
			// 		title: 'Job Offered'
			// 	});

			// 	this._stages.push({
			// 		index: 7,
			// 		type: DeveloperListType.hired,
			// 		value: groupedUsers[DeveloperListType.hired] ? groupedUsers[DeveloperListType.hired].length : 0,
			// 		title: 'Hired'
			// 	});

			// 	this._stages.push({
			// 		index: 8,
			// 		type: DeveloperListType.rejected,
			// 		value: groupedUsers[DeveloperListType.rejected] ? groupedUsers[DeveloperListType.rejected].length : 0,
			// 		title: 'Rejected'
			// 	});
			// });

			// const referralsPromise = this._jobBoxService.getReferralsCount(this.contract);
			// promises.push(referralsPromise);
			// referralsPromise.then(referralsCount => {
			// 	this._stages.push({
			// 		index: 2,
			// 		type: DeveloperListType.employeeReferrals,
			// 		value: referralsCount,
			// 		title: 'Employee Referrals'
			// 	});
			// });

			// this._parse.Parse.Promise.when(promises).then(() => {
			// 	this.stages = this._stages.sort((stage1, stage2) => {
			// 		if (stage1.index > stage2.index) {
			// 			return 1;
			// 		} else if (stage1.index === stage2.index) {
			// 			return 0;
			// 		} else {
			// 			return -1;
			// 		}
			// 	});
			// });
		}
	}

	get JobType() {
		return JobType;
	}

	get DeveloperListType() {
		return DeveloperListType;
	}

	get ContractStatus() {
		return ContractStatus;
	}

	goToJobDetails(contractId: string, stage: number, candidates?: Array<any>) {
	
		this._jobBoxService.activeContract = this.contract;
		if (this.contract.get('status') == ContractStatus.draft) {
			this._router.navigate(['/jobs', contractId]);
			setTimeout(() => {
				this._router.navigate(['/jobs', contractId, 'job-overview'], { skipLocationChange: true, relativeTo: this._route });
			}, 1);
		} else {
			this._router.navigate(['/', 'jobs', contractId]);
		}
		if (this.contract.get('hiringStages')) {
			if (stage === -2) {
				this._jobDetailsService.activeStage = 'suggested';
				this._jobDetailsService.setCandidatesCustomHiringWorkflow(this._stages[0].candidates);
				this.setCustomHiringWorkflowStages(this.stages);
			} else {
				this._jobDetailsService.activeStage = stage;
				this._jobDetailsService.setCandidatesCustomHiringWorkflow(candidates);
			}
			this._jobDetailsService.setHasCustomHiringWorkflow(true);
		} else {
			this._jobDetailsService.activeStage = stage;
			localStorage.setItem('activeStage', stage.toString());
		}
	}

	openMenu() {
		this._renderer.removeClass(this.menu.nativeElement, 'hidden');
	}

	closeMenu() {
		this._renderer.addClass(this.menu.nativeElement, 'hidden');
	}

	archiveContract() {
		const alert = this._root_vcr.createComponent(AlertComponent);
		alert.title = 'Archive and unpublish job?';
		alert.content = 'Are you sure you want to move the job to Archive? It will be unpublished from exiting jobboards.';
		alert.addButton({
			title: 'Yes, move to archive',
			type: 'warn',
			onClick: () => {
				this._renderer.addClass(this.jobBox.nativeElement, 'invisible');
				this._jobBoxService.archiveContract(this.contract).then(() => {
					this.statusChange.emit(this.contract.id);
					this._root_vcr.clear();
				});
			}
		});

		alert.addButton({
			title: 'No',
			type: 'secondary',
			onClick: () => {
				this._root_vcr.clear();
			}
		});
	}

	activateContract() {
		this._renderer.addClass(this.jobBox.nativeElement, 'invisible');
		this._jobBoxService.activateContract(this.contract).then(() => {
			this.statusChange.emit(this.contract.id);
		});
	}

	deleteContract() {
		const alert = this._root_vcr.createComponent(AlertComponent);
		if (this.contract.get('status') == ContractStatus.archived) {
			alert.title = 'Delete job?';
			alert.content = 'Are you sure you want to delete the job? You won’t be able to retrieve back its details.';
		} else {
			alert.title = 'Delete and Unpublish job?';
			alert.content = 'Are you sure you want to Delete the job? It will be unpublished from exiting jobboards.';
		}
		alert.addButton({
			title: 'Yes, delete',
			type: 'warn',
			onClick: () => {
				this._renderer.addClass(this.jobBox.nativeElement, 'invisible');
				this._jobBoxService.deleteContract(this.contract).then(() => {
					this.statusChange.emit(this.contract.id);
					this._root_vcr.clear();
				});
			}
		});

		alert.addButton({
			title: 'No',
			type: 'secondary',
			onClick: () => {
				this._root_vcr.clear();
			}
		});
	}

	// AF
	uploadCvFunc(event) {
		const upload = this._root_vcr.createComponent(UploadCvComponent);
		upload.selectedContract = { name: this.contract.get('title'), id: this.contract.id };
		console.log(upload.selectedContract);
	}

	duplicateAsDraft(contractId: string) {
		const preloader = this._root_vcr.createComponent(PreloaderComponent);
		this._jobBoxService.duplicateAsDraft(contractId).then(res => {
			this._root_vcr.clear();
			const alert = this._root_vcr.createComponent(AlertComponent);
			if (res) {
				alert.title = 'Congratulations!';
				alert.content = 'Job has been successfully duplicated. You can find it on your drafts!';
				alert.addButton({
					title: 'Close',
					type: 'primary',
					onClick: () => {
						this._root_vcr.clear();
					}
				});
			};
		}).catch(error => {
				const alert = this._root_vcr.createComponent(AlertComponent);
				alert.title = 'Error';
				alert.content = 'Sorry, an error occured';
				alert.addButton({
					title: 'Try again',
					type: 'primary',
					onClick: () => {
						this.duplicateAsDraft(contractId);
					}
				});
				alert.addButton({
					title: 'Close',
					type: 'primary',
					onClick: () => {
						this._root_vcr.clear();
					}
				});
		} );
	}

	changeLikeliHoodToFill(value, contract) {
		contract.set('likelihoodToFill', value);
		this._jobBoxService.setLikelihoodToFill(contract.id, value);
		this.showLikelihood = false;
	}

	setCustomHiringWorkflowStages(stages) {
		this._jobDetailsService.setCustomHiringWorkflowStages(stages);
	}

	ngOnDestroy() {
		this._socket.removeAllListeners('pipelineMainCountUpdate');
	}

}
