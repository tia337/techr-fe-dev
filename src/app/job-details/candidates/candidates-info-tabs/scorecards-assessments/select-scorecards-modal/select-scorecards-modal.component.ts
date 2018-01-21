import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ScorecardsAssessmentsService } from '../scorecards-assessments.service';
import { RootVCRService } from '../../../../../root_vcr.service';
import { ParseObject, ParseUser } from 'parse';
import { PreviewModalComponent } from '../../../../../scorecards/preview-modal/preview-modal.component';

@Component({
  selector: 'app-select-scorecards-modal',
  templateUrl: './select-scorecards-modal.component.html',
  styleUrls: ['./select-scorecards-modal.component.scss']
})
export class SelectScorecardsModalComponent implements OnInit {

  scorecards;
  private _candidate: ParseUser;
  private _contractId: string;

  attachedScorecards: any[];

  @Output('onAttachScorecard') onAttachScorecard: EventEmitter<any> = new EventEmitter();

  constructor(private _saService: ScorecardsAssessmentsService, private _root_vcr: RootVCRService) { }

  ngOnInit() {
    this._saService.getCompanyScorecards().then(parseScorecards => {
      console.log(parseScorecards);
      this.scorecards = parseScorecards;
    });
    console.log(this._contractId);
    console.log(this.attachedScorecards);
  }

  close() {
    this._root_vcr.clear();
  }

  previewScorecard(scorecard: ParseObject) {
    this._root_vcr.clear();
    const previewInstance = this._root_vcr.createComponent(PreviewModalComponent);
    previewInstance.scorecard = scorecard;
    previewInstance.editable = false;
  }

  attachScorecard(scorecard: ParseObject) {
    this._saService.getContract(this._contractId).then(parseContract => {
      return this._saService.attachScorecard(this._candidate, scorecard, parseContract);
    }).then(() => {
      console.log('scorecard attached');
      // this.onAttachScorecard.subscribe(a => {
      //   console.log(a);
      // });
      this.onAttachScorecard.emit();
    }).then(() => {
      this._root_vcr.clear();
    });

  }

  set candidate(user: ParseUser) {
    this._candidate = user;
  }

  set contractId(value: string) {
    this._contractId = value;
  }

}
