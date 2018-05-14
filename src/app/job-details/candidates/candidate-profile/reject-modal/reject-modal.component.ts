import { Component, OnInit } from '@angular/core';
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
  public rejectionNote;

  constructor(
    private _root_vcr: RootVCRService,
    private _parse: Parse,
    private _jobDetailsService: JobDetailsService,
    private _socket: Socket
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
		this._socket.emit('updateHiringPipeline', {
			candidateId: this.candidate.id,
			contractId: this.contract,
			listId: 6,
      user: this._parse.Parse.User.current().toPointer(),
      rejectionReason: this.rejectionReason,
      reason: this.rejectionReason.get('rejectionReason')
		});
    this._root_vcr.clear();
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


