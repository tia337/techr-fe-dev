import { Component, OnInit, OnChanges, Input, NgZone, OnDestroy } from '@angular/core';
import { ScorecardsAssessmentsService } from './scorecards-assessments.service';
import { RootVCRService } from '../../../../root_vcr.service';
import { ChangeDetectorRef } from '@angular/core';
import { Parse } from '../../../../parse.service';
import { SelectScorecardsModalComponent } from './select-scorecards-modal/select-scorecards-modal.component';
import { PreviewModalComponent } from '../../../../scorecards/preview-modal/preview-modal.component';
import * as _ from 'underscore';
import { ScoreCandidateComponent } from './score-candidate/score-candidate.component';
import { AlertComponent } from '../../../../shared/alert/alert.component';
import {CandidatesService} from "../../candidates.service";

@Component({
	selector: 'scorecards-assessments',
	templateUrl: './scorecards-assessments.component.html',
	styleUrls: ['./scorecards-assessments.component.scss']
})
export class ScorecardsAssessmentsComponent implements OnInit, OnDestroy {

	private _userId: string;
	private _contractId: string;

	private _candidate;
	private _contract;

	private _subscription;

	scorecardRelationships: Array<any> = [];
	scored = {};

	private _userIdSubscriprion;

	constructor(
		private _saService: ScorecardsAssessmentsService,
		private _root_vcr: RootVCRService,
		private _parse: Parse,
		private _candidatesService: CandidatesService
	) { }

	ngOnInit() {

		this._contractId = this._candidatesService.contractId;

		this._userIdSubscriprion = this._candidatesService.userId.subscribe(userId => {
			this._userId = userId;
			this.initCandidateData(userId);
		});
	}

	test(){
		console.log(this.scored);
		console.log(this.scorecardRelationships);
		let scoredCards: any[] = [];
		this.scorecardRelationships.forEach(card=>{
			scoredCards.push(card.get('Scorecard').id);
		});
		console.log(scoredCards);
	}

	selectScorecard() {
		let scoredCards: any[] = [];
		this.scorecardRelationships.forEach(card=>{
			scoredCards.push(card.get('Scorecard').id);
		});
		this._saService.getCandidate(this._userId).then(candidate => {
			const selectScorecardModal = this._root_vcr.createComponent(SelectScorecardsModalComponent);
			selectScorecardModal.candidate = candidate;
			selectScorecardModal.attachedScorecards = scoredCards;
			selectScorecardModal.contractId = this._contractId;
			this._subscription = selectScorecardModal.onAttachScorecard.subscribe(() => {
				this.updateAttachedScorecards();
			});
		});
	}

	private initCandidateData(userId: string) {
		const getCandidatePromise = this._saService.getCandidate(userId);
		const getContractPromise = this._saService.getContract(this._contractId);

		this._parse.Parse.Promise.when(getCandidatePromise, getContractPromise).then((candidate, contract) => {
			this._candidate = candidate;
			this._contract = contract;
			this.updateAttachedScorecards();
		});
	}

	private updateAttachedScorecards() {
		this._saService.getAttachedScorecards(this._candidate, this._contract).then(attachedScorecards => {
			this.scorecardRelationships = attachedScorecards;
			attachedScorecards.forEach(scorecard => {
				this.scored[scorecard.get('Scorecard').id] = false;
			});
			return this._saService.getWeightedScores(this._candidate, this._contract);
		}).then(weightedScores => {
			weightedScores.forEach(weightedScore => {
				this.scored[weightedScore.get('Scorecard').id] = true;
			});
		});
	}

	scoreCandidate(scorecard: any) {
		const scoreCandidateComponent = this._root_vcr.createComponent(ScoreCandidateComponent);
		scoreCandidateComponent.candidate = this._candidate;
		scoreCandidateComponent.contract = this._contract;
		scoreCandidateComponent.scorecard = scorecard;
	}

	previewScorecard(scorecard: any) {
		this._root_vcr.clear();
		const previewInstance = this._root_vcr.createComponent(PreviewModalComponent);
		previewInstance.scorecard = scorecard;
		previewInstance.editable = false;
		previewInstance.addButton({
			type: 'primary',
			title: 'Score candidate',
			onClick: () => {
				this._root_vcr.clear();
				this.scoreCandidate(scorecard);
			}
		});
	}

	removeScorecard(scorecardRelationship: any) {

		const alert = this._root_vcr.createComponent(AlertComponent);
		alert.title = 'Unattach scorecard?';
		alert.content = `
      Are you sure you don’t want to use this scorecard to score ` + this._candidate.get('firstName') + ` ` + this._candidate.get('lastName') + ` for the ` + this._contract.get('title') + ` position?
    `;
		alert.addButton({
			type: 'warn',
			title: 'Yes, remove',
			onClick: () => {
				this._saService.removeAttachedScorecard(scorecardRelationship).then(() => {
					return this.updateAttachedScorecards();
				}).then(() => {
					this.scorecardRelationships = _.without(this.scorecardRelationships, scorecardRelationship);
				}).then(() => {
					this._root_vcr.clear();
				});
			}
		});

		alert.addButton({
			type: 'secondary',
			title: 'No',
			onClick: () => {
				this._root_vcr.clear();
			}
		});


	}

	ngOnDestroy() {
		if (this._subscription) {
			this._subscription.unsubscribe();
		}
		this._userIdSubscriprion.unsubscribe();
	}

}
