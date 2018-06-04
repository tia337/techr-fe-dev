import { Component, OnInit, Renderer2, ElementRef } from '@angular/core';
import { RootVCRService } from '../../../../root_vcr.service';
import { Parse } from '../../../../parse.service';
import { JobDetailsService } from '../../../job-details.service';
import { Socket } from 'ng-socket-io';
// tslint:disable:indent
@Component({
  selector: 'modal',
  templateUrl: './reject-modal.component.html',
  styleUrls: ['./reject-modal.component.scss']
})
export class RejectModalComponent implements OnInit {

  public candidate;
  public rejectionReason = null;
  public rejectionList = false;
  public rejectionReasons = [];
  private contract;
  public rejectionNoteOpened = false;
  public response = 'pending';

  constructor(
    private _root_vcr: RootVCRService,
    private _parse: Parse,
    private _jobDetailsService: JobDetailsService,
    private _socket: Socket,
    private _renderer: Renderer2
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

  rejectCandidate() {
    this._jobDetailsService.movedUser = this.candidate.id;
    if (this.rejectionNoteOpened === true) {
      const note = document.getElementById('rejection-note') as HTMLTextAreaElement;
      this._socket.emit('updateHiringPipeline', {
        candidateId: this.candidate.id,
        contractId: this.contract,
        listId: 6,
        user: this._parse.Parse.User.current().toPointer(),
        rejectedReason: this.rejectionReason.id,
        reason: this.rejectionReason.get('rejectionReason'),
        rejectionNote: note.value
      });
    } else if (this.rejectionNoteOpened === false) {
      this._socket.emit('updateHiringPipeline', {
        candidateId: this.candidate.id,
        contractId: this.contract,
        listId: 6,
        user: this._parse.Parse.User.current().toPointer(),
        rejectedReason: this.rejectionReason.id,
        reason: this.rejectionReason.get('rejectionReason'),
        rejectionNote: undefined
      });
    }
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
    const query = this._parse.Query('RejectedCandidateReasons');
    query.find().then(data => {
      this.rejectionReasons = data;
    });
  }

}


