import {Component, OnInit, OnDestroy, EventEmitter} from '@angular/core';
import { ScorecardsService } from '../scorecards.service';
import { Router } from '@angular/router';
import { RootVCRService } from '../../root_vcr.service';
import { AlertComponent } from '../../shared/alert/alert.component';

@Component({
	selector: 'app-score-candidate',
	templateUrl: './score-candidate.component.html',
	styleUrls: ['./score-candidate.component.scss']
})
export class ScoreCandidateComponent implements OnInit, OnDestroy {

	onScorecardCreated: EventEmitter<any> = new EventEmitter();

	constructor(
		private _scorecardsService: ScorecardsService,
		private _router: Router,
		private _root_vcr: RootVCRService
	) { }
	ngOnInit() {
		this._scorecardsService.setActiveStage(3);

	}
	goBack() {
		this._router.navigate(['/', 'scorecards', { outlets: { 'scorecard-stage': ['add-questions'] } }], {skipLocationChange: true});
	}
	createScorecard() {
		// console.trace();
		this._scorecardsService.createScorecard().then(scorecard => {
			console.log(scorecard);
			console.log(scorecard.get('ScorecardTitle'));
			this._router.navigate(['/', 'scorecards', { outlets: { 'scorecard-stage': ['select-stage'] } }], {skipLocationChange: true});
			this.onScorecardCreated.emit();
			const alert = this._root_vcr.createComponent(AlertComponent);
			alert.title = 'Congratulations!';

			alert.content = `
			<h3>Scorecard successfully created!</h3>
			<br/> `
			+ scorecard.get('ScorecardTitle');

			alert.addButton({
				title : 'Close',
				type: 'primary',
				onClick : () => {
					this._root_vcr.clear();
				}
			});
		});
	}
	ngOnDestroy() {
		this._scorecardsService.setActiveStage(0);
		this._scorecardsService.type = 0;
		this._scorecardsService.questions = null;

		this._scorecardsService = null;
		this._router = null;
	}
}
