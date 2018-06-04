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
@Component({
	selector: 'app-candidate-profile',
	templateUrl: './candidate-profile.component.html',
	styleUrls: ['./candidate-profile.component.scss']
})
export class CandidateProfileComponent implements OnInit, OnDestroy, OnChanges {

	@Input('userId') userId: string;
	@Input('contractId') contractId: string;
	@Input('weight') weight: number;
	candidate: ParseUser;
	averageRating = 0;
	private roles;
	private developer;

	verdicts = {
		definitely: 0,
		yes: 0,
		notSure: 0
	};

	private _socketSubscription;

	// userId = this._route.snapshot.params['id'];

	private availabilityDate: string;

	sendingEmail: { status: string };

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
		console.log(this._socket);
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
				}
			});
		});
	}


	ngOnChanges(changes: any) {
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
				console.log(scorecardWeightedScores, 'IN RESULT OF GET WEIGHTED SCORE');
				let scoreSum = 0;

				this._candidateProfileService.verdicts.definitely = scorecardWeightedScores.filter(score => {
					return score.get('FinalVerdict') === FinalVerdict.definitely;
				}).length;
				// 			AF CHANGE
				// this._candidateProfileService.verdicts.definitely = this.verdicts.definitely;

				this._candidateProfileService.verdicts.yes = scorecardWeightedScores.filter(score => {
					return score.get('FinalVerdict') === FinalVerdict.yes;
				}).length;
				// 			AF CHANGE
				// this._candidateProfileService.verdicts.yes = this.verdicts.yes;

				this._candidateProfileService.verdicts.notSure = scorecardWeightedScores.filter(score => {
					return score.get('FinalVerdict') === FinalVerdict.notSure;
				}).length;
				// 			AF CHANGE
				// this._candidateProfileService.verdicts.notSure = this.verdicts.notSure;

				// console.log()

				scorecardWeightedScores.forEach(scoreObject => {
					scoreSum += scoreObject.get('WeightedScore');
				});
				if (scorecardWeightedScores.length > 0) {
					this.averageRating = scoreSum / scorecardWeightedScores.length;
					this._candidateProfileService.scoreSum = scoreSum;
					this._candidateProfileService.scoreCount = scorecardWeightedScores.length;
					console.log(this._candidateProfileService);
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
			console.log('onSend works');
			onSendSubscription.unsubscribe();
		});
	}

	showMoveMenu() {
		this._renderer.addClass(this.moveCandidateMenu.nativeElement, 'opened');
	}

	closeMoveMenu() {
		this._renderer.removeClass(this.moveCandidateMenu.nativeElement, 'opened');
	}

	moveCandidate(listId: number) {
		console.log('func started');
		console.log('this.candidate.id: ', this.candidate.id);
		console.log('this.contractId: ', this.contractId);
		console.log('listId: ', listId);
		console.log('this._parse.Parse.User.current(): ', this._parse.Parse.User.current());
		console.log('this._jobDetailsService.movedUser', this._jobDetailsService.movedUser);
		console.log(this.candidate.id);
		this._jobDetailsService.movedUser = this.candidate.id;
		console.log('this._jobDetailsService.movedUser', this._jobDetailsService.movedUser);

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
	}

	openRejection(candidate) {
		const rejectionModal = this._root_vcr.createComponent(RejectModalComponent);
		rejectionModal.setCandidate = candidate;
		rejectionModal.contractId = this.contractId;
	}

}
