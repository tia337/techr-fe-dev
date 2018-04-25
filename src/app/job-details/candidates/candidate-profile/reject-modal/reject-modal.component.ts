import { Component, OnInit } from '@angular/core';
import { RootVCRService } from '../../../../root_vcr.service';
// tslint:disable:indent
@Component({
  selector: 'modal',
  templateUrl: './reject-modal.component.html',
  styleUrls: ['./reject-modal.component.scss']
})
export class RejectModalComponent implements OnInit {

  public candidate;
  public rejectionReason = '';
  public rejectionList = false;

  constructor(
    private _root_vcr: RootVCRService
  ) { }

  ngOnInit() {
  }

  set setCandidate (candidate) {
    this.candidate = candidate;
  }

  get setCandidate () {
    return this.candidate;
  }

  close() {
    this._root_vcr.clear();
  }

  setRejectionReason (event) {
    this.rejectionReason = event.target.innerText;
  }

}


