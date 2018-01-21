import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ScorecardsService } from '../scorecards.service';

@Component({
  selector: 'app-select-stage',
  templateUrl: './select-stage.component.html',
  styleUrls: ['./select-stage.component.scss']
})
export class SelectStageComponent implements OnInit, OnDestroy {

  interviewStage: number = 0;

  constructor(private _scorecardsService: ScorecardsService, private _router: Router) { }

  ngOnInit() {
    this._scorecardsService.setActiveStage(1);

    // if(this._scorecardsService.type.value)
    //   this.interviewStage = this._scorecardsService.type.value;
    this._scorecardsService.type.subscribe(value => {
      // if (value !== 0) {
        this.interviewStage = value;
      // }
    });

  }

  ngOnDestroy() {
    this.interviewStage = null;
    this._scorecardsService = null;
    this._router = null;
  }

  setType() {
    if(this.interviewStage != 0) {
      this._scorecardsService.type = this.interviewStage;
      this._router.navigate(['/', 'scorecards', { outlets: { 'scorecard-stage': ['add-questions'] } }], {skipLocationChange: true});
    }
  }

}
