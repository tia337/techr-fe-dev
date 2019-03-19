import { GmailComponent } from './../../../gmail/gmail.component';
import { RootVCRService } from './../../../root_vcr.service';
import {
	Component, OnInit, OnChanges, Input, Renderer2, ElementRef, ViewChild, OnDestroy
} from '@angular/core';
import { CandidateProfileService } from './candidate-profile.service';
import { Parse } from '../../../parse.service';
import { ParseUser, ParsePromise, ParseObject } from 'parse';
import { ActivatedRoute, Router } from '@angular/router';
import { CandidatesService } from '../candidates.service';
import * as _ from 'underscore';
import { FinalVerdict } from '../../../shared/utils';
import { Socket } from 'ng-socket-io';

import { AlertComponent } from '../../../shared/alert/alert.component';
import { JobDetailsService } from '../../job-details.service';
import { RejectModalComponent } from './reject-modal/reject-modal.component';
import { WithdrawnModalComponent } from './withdrawn-modal/withdrawn-modal.component';
import { Subscription } from 'rxjs';

@Component({
	selector: 'app-candidate-profile',
	templateUrl: './candidate-profile.component.html',
	styleUrls: ['./candidate-profile.component.scss']
})
export class CandidateProfileComponent implements OnInit, OnDestroy, OnChanges {

	@Input('userId') userId: string;
	@Input('contractId') contractId: string;
	@Input('weight') weight: number;
	candidate: any;
	averageRating = 0;
	private roles;
	private developer;

	verdicts = {
		definitely: 0,
		yes: 0,
		notSure: 0
	};

	private _socketSubscription;
	public customHiringStagesListShown = false;

	// userId = this._route.snapshot.params['id'];

	private availabilityDate: string;
	customHiringStages = [];
	customHiringStagesStorage = [];
	activeStage;

	sendingEmail: { status: string };
	subscription: Subscription;

	@ViewChild('moveCandidateMenu') moveCandidateMenu: ElementRef;

	constructor(
		private _candidateProfileService: CandidateProfileService,
		private _parse: Parse,
		private _renderer: Renderer2,
		private _candidatesService: CandidatesService,
		private _route: ActivatedRoute,
		private _root_vcr: RootVCRService,
		private _jobDetailsService: JobDetailsService,
		private _socket: Socket,
		private _router: Router
	) {}

	ngOnInit() {
		this._socketSubscription = this._socket.on('pipelineUpdate', data => {
			this._candidateProfileService.getUserList(data.userListId).then(userList => {
				this._jobDetailsService.activeStage = userList.get('listType');
				let listId = userList.get('listType');
				if (listId == 0) {
					this.allert(1, 'Shortlist');
				} else if (listId == 1) {
					this.allert(1, 'Phone Interview');
				} else if (listId == 2) {
					this.allert(1, 'F2F Interview');
				} else if (listId == 3) {
					this.allert(1, 'Job Offered');
				} else if (listId == 4) {
					this.allert(1, 'Hired');
				} else if (listId == 6) {
					this.allert(1, 'Rejected');
				} else if (listId == 7) {
					this.allert(1, 'Withdrawn');
				}
			});
		});
		this._socket.on('pipelineUpdateBulk', data => {
			this.allert(1, 'Rejected');
			this._jobDetailsService.activeStage = 6;
		});
		this._jobDetailsService._customHiringWorkFlowStages.skipWhile(val => val == null).subscribe(stages => {
			console.log(stages);
			if (stages === false) return;
			console.log(stages);
			this.customHiringStagesStorage = stages;
			stages.forEach(stage => {
				if (stage.type === 'applied') return;
				if (stage.type === 'suggested') return;
				if (stage.type === 'refferals') return;
				this.customHiringStages.push(stage);
			});
			console.log(this.customHiringStages);
		});
		this._jobDetailsService.activeStage.subscribe(stage => {
			this.activeStage = stage;
		});
		this._router.navigate(['/', 'jobs', this._jobDetailsService.contractId, 'candidates'], { skipLocationChange: true });
		this.subscription = this._candidateProfileService._rejectedHiring.subscribe(value => {
			this.move(value.stage, value.stageTitle, value.hiringStages, value.newCandidates, value.previousStageCandidates);
		});
	}


	ngOnChanges(changes: any) {
		console.log(changes);
		this.verdicts = {
			definitely: 0,
			yes: 0,
			notSure: 0
		};
		delete this.candidate;
		if (changes.userId.currentValue) {
			this._candidatesService.userId = changes.userId.currentValue;
		}
		this.averageRating = 0;
		if (changes.userId.currentValue) {
			this._candidateProfileService.getCandidate(changes.userId.currentValue).then(user => {
				this.candidate = user;
				this.developer = user.get('developer');
				this.availabilityDate = user.get('developer').get('availableDate');
				this.roles = user.get('developer').get('roles');
				this._candidateProfileService.verdicts.definitely = 0;
				this._candidateProfileService.verdicts.yes = 0;
				this._candidateProfileService.verdicts.notSure = 0;
				return this._candidateProfileService.getScorecardWeightedScores(this.contractId, this.candidate);
			}, error => {
				console.error(error);
			}).then(scorecardWeightedScores => {
				let scoreSum = 0;

				this._candidateProfileService.verdicts.definitely = scorecardWeightedScores.filter(score => {
					return score.get('FinalVerdict') === FinalVerdict.definitely;
				}).length;

				this._candidateProfileService.verdicts.yes = scorecardWeightedScores.filter(score => {
					return score.get('FinalVerdict') === FinalVerdict.yes;
				}).length;
				this._candidateProfileService.verdicts.notSure = scorecardWeightedScores.filter(score => {
					return score.get('FinalVerdict') === FinalVerdict.notSure;
				}).length;

				scorecardWeightedScores.forEach(scoreObject => {
					scoreSum += scoreObject.get('WeightedScore');
				});
				if (scorecardWeightedScores.length > 0) {
					this.averageRating = scoreSum / scorecardWeightedScores.length;
					this._candidateProfileService.scoreSum = scoreSum;
					this._candidateProfileService.scoreCount = scorecardWeightedScores.length;
				}
			}, error => {
				console.error(error);
			});
		}
	}

	sendEmail() {
		const email = this._root_vcr.createComponent(GmailComponent);
		email.userId = this.userId;
		email.contractId = this.contractId;
		email.saveNote = true;
		email.saveChat = true;
		email.needTemplates = true;
		email.templateOptions = ['all'];
		email.emailBody = '';
		email.emailSubj = '';
		email.attachments = [];
		const onSendSubscription = email.onSend.subscribe(e => {
			this._router.navigate(['/', 'jobs', this.contractId, 'candidates', 'chat'], {skipLocationChange: true});
			onSendSubscription.unsubscribe();
		});
	}	

	showMoveMenu() {
		this._renderer.addClass(this.moveCandidateMenu.nativeElement, 'opened');
	}

	moveCandidateToCustomWorkFlowStage(stage, index) {
		if (stage.rejectedLogic === true) {
			this.openRejectionCustom(this.candidate, stage.type);
			return;
		} else if (stage.withdrawnLogic === true) {
			this.openWithdrawnCustom(this.candidate, stage.type);
			return;
		} else {
			const activeStage = this._jobDetailsService.activeStage._value;
			let previousStageCandidates;
			this.customHiringStages.forEach(item => {
				if (item.type === activeStage) {
					if (activeStage === 'applied') {
						previousStageCandidates = item.candidates;
						console.log('stage current after splice: ', stage.candidates);
						return;
					};
					if (this._jobDetailsService.activeStage._value === 'suggested') {
						previousStageCandidates = item.candidates;
						console.log('stage current after splice: ', stage.candidates);
						return;
					};
					if (this._jobDetailsService.activeStage._value === 'refferals') {
						previousStageCandidates = item.candidates;
						console.log('stage current after splice: ', stage.candidates);
						return;
					};
					const candidateIndex = item.candidates.indexOf(this.candidate.get('developer').id);
					item.candidates.splice(candidateIndex, 1);
					previousStageCandidates = item.candidates;
				};
			});
			console.log(this.customHiringStages[index]);
			this.customHiringStages[index].candidates.push(this.candidate.get('developer').id);
			this._parse.execCloud('moveCandidateToCustomWorkFlowStage', { contractId: localStorage.getItem('contractId'), hiringStages: this.customHiringStages })
				.then(result => {
					this._jobDetailsService.activeStage = stage.type;
					this._jobDetailsService.setCandidatesCustomHiringWorkflow(this.customHiringStages[index].candidates);
					this._jobDetailsService.setCandidatesAfterMovingCandidate(stage.type, this.candidate.get('developer').id, activeStage, previousStageCandidates);
					this.openMovingCandidateSuccessModal(stage.title);
				});
		}
	}

	move(stage, stageTitle, hiringStages, newCandidates, previousStageCandidates) {
		const activeStage = this._jobDetailsService.activeStage._value;
		this._parse.execCloud('moveCandidateToCustomWorkFlowStage', { contractId: localStorage.getItem('contractId'), hiringStages: hiringStages })
			.then(result => {
				this._jobDetailsService.activeStage = stage;
				this._jobDetailsService.setCandidatesCustomHiringWorkflow(newCandidates);
				this._jobDetailsService.setCandidatesAfterMovingCandidate(stage.type, this.candidate.get('developer').id, activeStage, previousStageCandidates);
				this._root_vcr.clear();
				this.openMovingCandidateSuccessModal(stageTitle);
			});
	}
		

	closeMoveMenu() {
		this._renderer.removeClass(this.moveCandidateMenu.nativeElement, 'opened');
	}

	moveCandidate(listId: number) {
		this._jobDetailsService.movedUser = this.candidate.id;
		this._socket.emit('updateHiringPipeline', {
			candidateId: this.candidate.id,
			contractId: this.contractId,
			listId: listId,
			user: this._parse.Parse.User.current().toPointer()
		});
	}

	allert(alertCode, stage?) {
		this._root_vcr.clear();
		if (alertCode === 1) {
			const alert = this._root_vcr.createComponent(AlertComponent);
			alert.title = 'Congrats!';
			alert.icon = 'thumbs-o-up';
			alert.type = 'congrats';
			alert.contentAlign = 'left';
			alert.content = `<a style = "white-space:nowrap">Candidate successfully moved to ` + stage + ` stage</a>`;
			alert.addButton({
				title: 'Close',
				type: 'primary',
				onClick: () => this._root_vcr.clear()
			});
		} else if (alertCode === 0) {
			const alert = this._root_vcr.createComponent(AlertComponent);
			alert.title = 'Something went wrong';
			alert.icon = 'frown-o';
			alert.type = "sad";
			alert.contentAlign = 'right';
			alert.content = `<a>Sorry, something went wrong and we cannot move your candidate to another stage. <br>Please, try again later or contact our support team.</a>`;
			alert.addButton({
				title: 'Close',
				type: 'primary',
				onClick: () => this._root_vcr.clear()
			});
		}
	}

	get FinalVerdict() {
		return FinalVerdict;
	}

	errorHandler(event) {
		event.target.src = '../../../assets/img/default-userpic.png';
	}

	ngOnDestroy() {
		this._socket.removeAllListeners('pipelineUpdate');
	 	if (this.subscription !== undefined) this.subscription.unsubscribe();
	}

	openRejection(candidate) {
		if (this.customHiringStages.length > 0) {
			this.openRejectionCustom(this.candidate);
			return;
		}
		const rejectionModal = this._root_vcr.createComponent(RejectModalComponent);
		rejectionModal.setCandidate = candidate;
		rejectionModal.contractId = this.contractId;
	}

	openWithdrawn(candidate) {
		const rejectionModal = this._root_vcr.createComponent(WithdrawnModalComponent);
		rejectionModal.setCandidate = candidate;
		rejectionModal.contractId = this.contractId;
	}

	openRejectionCustom(candidate, stageType?) {
		const rejectionModal = this._root_vcr.createComponent(RejectModalComponent);
		rejectionModal.logic = 'new';
		rejectionModal.hiringStages = this.customHiringStagesStorage;
		rejectionModal.setCandidate = candidate;
		rejectionModal.stageType = stageType ? stageType : 'rejected';
	}

	openWithdrawnCustom(candidate, stageType?) {
		const rejectionModal = this._root_vcr.createComponent(WithdrawnModalComponent);
		rejectionModal.logic = 'new';
		rejectionModal.hiringStages = this.customHiringStagesStorage;
		rejectionModal.setCandidate = candidate;
		rejectionModal.stageType = stageType ? stageType : 'withdrawn';
	}

	openMovingCandidateSuccessModal(stage) {
		this._root_vcr.clear();
		const alert = this._root_vcr.createComponent(AlertComponent);
		alert.title = 'Congrats!';
		alert.icon = 'thumbs-o-up';
		alert.type = 'congrats';
		alert.contentAlign = 'left';
		alert.content = `<a style = "white-space:nowrap">Candidate successfully moved to ` + stage + ` stage</a>`;
		alert.addButton({
			title: 'Close',
			type: 'primary',
			onClick: () => this._root_vcr.clear()
		});
	}


}
