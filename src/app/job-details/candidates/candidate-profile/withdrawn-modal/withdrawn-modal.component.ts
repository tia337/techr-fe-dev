import { Component, OnInit, Renderer2, ElementRef } from '@angular/core';
import { RootVCRService } from '../../../../root_vcr.service';
import { Parse } from '../../../../parse.service';
import { JobDetailsService } from '../../../job-details.service';
import { Socket } from 'ng-socket-io';
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
