import { Component, OnInit, Input, OnDestroy, EventEmitter, Output } from '@angular/core';
import { ScorecardsService } from '../scorecards.service';
import { Parse } from '../../parse.service';

@Component({
	selector: 'scorecard-preview',
	templateUrl: './preview.component.html',
	styleUrls: ['./preview.component.scss']
})
export class PreviewComponent implements OnInit, OnDestroy {

	type: number;
	questions: any;
	@Input('scorecardId') scorecardId: string;

	private previewLoaded: boolean = false;

	@Output('loaded') loaded = new EventEmitter();

	constructor(private _scorecardService: ScorecardsService, private _parse: Parse) { }

	ngOnInit() {
		if (this.scorecardId) {
			console.log('input object');
			this._scorecardService.getScorecard(this.scorecardId).then( value => {
				this.type = value.type;
				this.questions = value.questionsObj;
				this.loaded.emit();
			});
		} else {

			console.log('service object');
			this._scorecardService.type.subscribe(value => {
				this.type = value;
			});
			this._scorecardService.questions.subscribe(value => {
				this.questions = value;
			});

		}
	}

	ngOnDestroy() {
		this._scorecardService = null;
		this.type = null;
		this.questions = null;
	}

}
