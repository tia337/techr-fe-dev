import { Component, OnInit, Renderer2, ElementRef } from '@angular/core';
import { RootVCRService } from '../../../../root_vcr.service';
import { Parse } from '../../../../parse.service';
import { JobDetailsService } from '../../../job-details.service';
import { Socket } from 'ng-socket-io';
import { CandidateProfileService } from '../candidate-profile.service';
// tslint:disable:indent
@Component({
  selector: 'app-withdrawn-modal',
  templateUrl: './withdrawn-modal.component.html',
  styleUrls: ['./withdrawn-modal.component.scss']
})
export class WithdrawnModalComponent implements OnInit {

  public candidate;
  public rejectionReason = null;
  public rejectionList = false;
  public rejectionReasons = [];
  private contract;
  public rejectionNoteOpened = false;
  public response = 'pending';
  public _logic: 'new' | 'old';
  public _stageType;
  public _hiringStages = [];

  constructor(
    private _root_vcr: RootVCRService,
    private _parse: Parse,
    private _jobDetailsService: JobDetailsService,
    private _socket: Socket,
    private _renderer: Renderer2,
    private _candidatesProfileService: CandidateProfileService
  ) { }

  ngOnInit() {
    this.getRejectionReasons();
  }

  set setCandidate (candidate) {
    this.candidate = candidate;
  }

  get setCandidate () {
    return this.candidate;
  }

  set contractId (value) {
    this.contract = value;
  }

  get contractId () {
    return this.contract;
  }

  set logic (value) {
    this._logic = value;
  }

  get logic () {
    return this._logic;
  }

  set stageType (value) {
    this._stageType = value;
  }

  get stageType () {
    return this._stageType;
  }

  set hiringStages (value) {
    this._hiringStages = value;
  }

  get hiringStages () {
    return this._hiringStages;
  }

  rejectCandidate() {
    if (this.logic === 'new') {
      this.newLogic()
      return;
    } 
    this._jobDetailsService.movedUser = this.candidate.id;
    
    if (this.rejectionNoteOpened === true) {
      const note = document.getElementById('rejection-note') as HTMLTextAreaElement;
      this._socket.emit('updateHiringPipeline', {
        candidateId: this.candidate.id,
        contractId: this.contract,
        listId: 7,
        user: this._parse.Parse.User.current().toPointer(),
        withdrawalReason: this.rejectionReason.id,
        withdrawalReasonTitle: this.rejectionReason.get('reason'),
        withdrawalNote: note.value
      });
      
    } else if (this.rejectionNoteOpened === false) {
      this._socket.emit('updateHiringPipeline', {
        candidateId: this.candidate.id,
        contractId: this.contract,
        listId: 7,
        user: this._parse.Parse.User.current().toPointer(),
        withdrawalReason: this.rejectionReason.id,
        withdrawalReasonTitle: this.rejectionReason.get('rejectionReason'),
        withdrawalNote: undefined
      });
    }
  }

  newLogic() {
    let data;
    let newCandidates;
    let previousStageCandidates;
    let stageTitle;
    if (this.rejectionNoteOpened) {
      const note = document.getElementById('rejection-note') as HTMLTextAreaElement;
      data = {
        id: this.candidate.get('developer').id,
        reason: this.rejectionReason.get('rejectionReason'),
        rejectionNote: note.value
      };
    } else {
      data = {
        id: this.candidate.get('developer').id,
        reason: this.rejectionReason.get('rejectionReason'),
        rejectionNote: undefined
      };
    }
    this._hiringStages.forEach(stage => {
      if (stage.type === this._stageType) {
        stage.candidates.push(this.candidate.get('developer').id);
        stage.candidateReasons.push(data); 
        newCandidates = stage.candidates;
        stageTitle = stage.title;
      };
      if (stage.type === this._jobDetailsService.activeStage._value) {
        if (this._jobDetailsService.activeStage._value === 'applied') {
          previousStageCandidates = stage.candidates;
          return;
        };
        if (this._jobDetailsService.activeStage._value === 'suggested') {
          previousStageCandidates = stage.candidates;
          return;
        };
        if (this._jobDetailsService.activeStage._value === 'refferals') {
          previousStageCandidates = stage.candidates;
          return;
        };
        stage.candidates.splice(stage.candidates.indexOf(this.candidate.id), 1);
        previousStageCandidates = stage.candidates;
      };
    });
    this._jobDetailsService.activeStage = this._stageType;
    const obs = {
      stage: this.stageType,
      stageTitle: stageTitle,
      hiringStages: this._hiringStages.slice(3, this._hiringStages.length),
      newCandidates: newCandidates,
      previousStageCandidates: previousStageCandidates
    };
    this._candidatesProfileService.rejectedHiring(obs);
  }

  clearNote() {
    const note = document.getElementById('rejection-note') as HTMLTextAreaElement;
    note.value = '';
  }

  close() {
    this._root_vcr.clear();
  }

  setRejectionReason (reason) {
    this.rejectionReason = reason;
    this.rejectionList = false;
  }

  getRejectionReasons() {
    const query = this._parse.Query('WithdrawnCandidatesReasons');
    query.find().then(data => {
      this.rejectionReasons = data;
    });
  }

}
