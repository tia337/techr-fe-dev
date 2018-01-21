import { Component, OnInit, OnDestroy, Renderer2, ElementRef, ComponentFactoryResolver, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { ScorecardsService } from './scorecards.service';
import { EditScorecardComponent } from './edit-scorecard/edit-scorecard.component';
import { ParsePromise, ParseObject } from 'parse';
import { RootVCRService } from '../root_vcr.service';
import { PreviewModalComponent } from './preview-modal/preview-modal.component';
import { AlertComponent } from '../shared/alert/alert.component';
import { Sort } from '@angular/material';
import { ScorecardStatus } from '../shared/utils';

import { FeedbackAlertComponent } from 'app/core/feedback-alert/feedback-alert.component';


@Component({
	selector: 'app-scorecards',
	templateUrl: './scorecards.component.html',
	styleUrls: ['./scorecards.component.scss']
})
export class ScorecardsComponent implements OnInit, OnDestroy {

	currentStage: number;
	private _currentStageSubscription;
	scorecards;
	sortedScorecards;
	scorecardsFilter = 1;
	scorecardId: string;

	private _eventSubscription;

	constructor(
		private _scorecardsService: ScorecardsService,
		private _root_vcr: RootVCRService
	) {
		console.log(arguments);
	}

	ngOnInit() {
		this._currentStageSubscription = this._scorecardsService.activeStage.subscribe(value => {
			setTimeout(() => {
				this.currentStage = value;
			}, 0);
		});

		this.updateScorecards();

	}

	updateScorecards() {
		this._scorecardsService.getScorecards().then(myScorecards => {
			this.sortedScorecards = myScorecards;
			this.scorecards = myScorecards;
		});
	}

	isMyScorecard(scorecard: ParseObject): boolean {
		if(scorecard.has('Author')) return scorecard.get('Author').equals(this._scorecardsService.me());
		else return false;
	}

	editScorecard(scorecard: ParseObject) {
		// this._scorecardsService.getScorecard(scorecard.id).then(questions => {
		//   this._scorecardsService.questions = questions.questionsObj;
		//   console.log(questions.questionsObj);
		//   this._scorecardsService.type = questions.type;
		//   console.log(questions.type);
		// });
		// this.scorecardId = scorecard.id;
		// this._viewContainerRef.clear();
		this._root_vcr.clear();
		// const componentFactoryResolver = this._componentFactoryResolver.resolveComponentFactory(EditScorecardComponent);
		// const editView = this._viewContainerRef.createComponent(componentFactoryResolver).instance;
		const editView = this._root_vcr.createComponent(EditScorecardComponent);
		editView.scorecardId = scorecard.id;
		const subscription = editView.scorecardUpdated.subscribe(() => {
			const alert = this._root_vcr.createComponent(AlertComponent);
			alert.title = 'Scorecard was updated!';
			alert.content = `Scorecard was successfully edited`;
			alert.addButton({
				type: 'primary',
				title: 'OK',
				onClick: () => { this._root_vcr.clear(); }
			});
			alert.onDestroy(() => {
				subscription.unsubscribe();
			});
		});
	}

	previewScorecard(scorecard: ParseObject) {
		const previewInstance = this._root_vcr.createComponent(PreviewModalComponent);
		previewInstance.scorecard = scorecard;
		previewInstance.addButton({
			type: 'primary',
			title: 'Edit',
			onClick: () => {
				this._root_vcr.clear();
				this.editScorecard(scorecard);
			}
		});
		previewInstance.addButton({
			type: 'primary',
			title: 'Archive',
			onClick: () => {
				this._root_vcr.clear();
				this.archiveScorecard(scorecard);
			}
		});
		previewInstance.addButton({
			type: 'warn',
			title: 'Delete',
			onClick: () => {
				this._root_vcr.clear();
				this.deleteScorecard(scorecard);
			}
		});
	}

	archiveScorecard(scorecard: ParseObject) {
		const alert = this._root_vcr.createComponent(AlertComponent);
		alert.title = 'Archive scorecard';
		alert.content = `
      <h3>Area you sure you want to archive this scorecard?</h3>
      <br/>
      This will not make it visible to your colleagues
    `;

		alert.addButton({
			title: 'Yes, archive',
			type: 'primary',
			onClick: () => {
				this._archiveScorecard(scorecard);
				this._root_vcr.clear();
			}
		});
		alert.addButton({
			title: 'Cancel',
			type: 'warn',
			onClick: () => this._root_vcr.clear()
		});
	}

	activateScorecard(scorecard: ParseObject) {
		this._scorecardsService.activateScorecard(scorecard).then(() => {
			const alert = this._root_vcr.createComponent(AlertComponent);
			alert.title = 'Scorecard activated!';
			alert.type = 'happy';
			alert.content = `Scorecard was successfully activated!`;
			alert.addButton({
				title: 'Close',
				type: 'primary',
				onClick: () => {
					this._activateScorecard(scorecard);
					this._root_vcr.clear();
				}
			});
		});
	}

	private _archiveScorecard(scorecard: ParseObject) {
		this._scorecardsService.archiveScorecard(scorecard).then(() => {
			this.updateScorecards();
		});
	}

	private _activateScorecard(scorecard: ParseObject) {
		this._scorecardsService.activateScorecard(scorecard).then(() => {
			this.updateScorecards();
		});
	}

	deleteScorecard(scorecard: ParseObject) {
		const alert = this._root_vcr.createComponent(AlertComponent);
		alert.title = 'Delete scorecard';

		// alert.addLine('Area you sure you want to archive this scorecard?');
		// alert.addLine('This will not make it visible to your colleagues');

		alert.content = `
      <h3>Area you sure you want to delete this scorecard?</h3>
      <br/>
      This will not make it visible to your colleagues
    `;

		alert.addButton({
			title: 'Yes, delete',
			type: 'primary',
			onClick: () => {
				this._deleteScorecard(scorecard);
				this._root_vcr.clear();
			}
		});
		alert.addButton({
			title: 'Cancel',
			type: 'warn',
			onClick: () => this._root_vcr.clear()
		});
	}

	feedbackCreation() {
		this._root_vcr.createComponent(FeedbackAlertComponent);
	}

	private _deleteScorecard(scorecard: ParseObject) {
		this._scorecardsService.deleteScorecard(scorecard).then(() => {
			this.updateScorecards();
		});
	}

	scorecardCreated(event) {
		if (event.onScorecardCreated) {
			this._eventSubscription = event.onScorecardCreated.subscribe(() => {
				this.updateScorecards();
			});
		}
	}

	sortData(sort: Sort) {
		const data = this.scorecards.slice();
		if (!sort.active || sort.direction === '') {
			this.sortedScorecards = data;
			return;
		}

		this.sortedScorecards = data.sort((a, b) => {
			const isAsc = sort.direction === 'asc';
			switch (sort.active) {
				case 'title': return compare(a.get('ScorecardTitle'), b.get('ScorecardTitle'), isAsc);
				case 'type': return compare(+a.get('Scorecard_type'), +b.get('Scorecard_type'), isAsc);
				case 'createdAt': return compare(+a.get('createdAt'), +b.get('createdAt'), isAsc);
				case 'author': return compare(+a.get('Author').get('lastName'), +b.get('Author').get('lastName'), isAsc);
				default: return 0;
			}
		});
	}

	ngOnDestroy() {
		this._currentStageSubscription.unsubscribe();
		this.currentStage = null;
		this._currentStageSubscription = null;
		this._scorecardsService = null;
		this.scorecards = null;

		if (this._eventSubscription) {
			this._eventSubscription.unsubscribe();
		}
	}

	get ScorecardStatus() {
		return ScorecardStatus;
	}

}

function compare(a, b, isAsc) {
	return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}


