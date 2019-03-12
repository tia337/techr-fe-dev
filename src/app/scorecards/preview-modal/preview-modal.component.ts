import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { RootVCRService } from '../../root_vcr.service';
import { Parse } from '../../parse.service';
import { ScorecardsService } from '../scorecards.service';
import { EditScorecardComponent } from '../edit-scorecard/edit-scorecard.component';

@Component({
	selector: 'app-preview-modal',
	templateUrl: './preview-modal.component.html',
	styleUrls: ['./preview-modal.component.scss']
})
export class PreviewModalComponent implements OnInit, OnDestroy {

	private _scorecard: any;

	private _editable: boolean;
	private _buttons = [];

	private _previewLoaded : boolean = false;

	@ViewChild('preview') preview: ElementRef;
	isMyScorecard: boolean;

	constructor(
		private _root_vcr: RootVCRService,
		private _scorecardsService: ScorecardsService,
		private _parse: Parse
	) { }

	ngOnInit() {
		console.log('current user: ', this._parse.Parse.User.current());
		console.log('author: ', this._scorecard.get('Author'));
		this.isMyScorecard = this._scorecard.get('Author').isCurrent();
	}

	prevLoaded() {
		console.log('previewLoaded');
		this._previewLoaded = true;
	}

	// archiveScorecard() {
	//   this._scorecardsService.archiveScorecard(this._scorecard);
	// }
	//
	// deleteScorecard() {
	//   this._scorecardsService.deleteScorecard(this._scorecard);
	// }
	//
	// editScorecard() {
	//   this._root_vcr.clear();
	//   const editView = this._root_vcr.createComponent(EditScorecardComponent);
	//   editView.scorecardId = this._scorecard.id;
	// }

	printScorecard() {
		window.print();
	}

	closePreviewModal() {
		this._root_vcr.clear();
	}

	ngOnDestroy() {
		this._scorecardsService.questions = null;
		this._scorecardsService.type = null;
	}

	set scorecard(scorecardObject: any) {
		this._scorecard = scorecardObject;
	}

	get scorecard(): any {
		return this._scorecard;
	}

	set editable(value) {
		this._editable = value;
	}

	get editable() {
		return this._editable;
	}

	get buttons() {
		return this._buttons;
	}

	addButton(buttonOptions) {
		this._buttons.push(buttonOptions);
	}

	get previewLoaded() {
		return this._previewLoaded;
	}

}
