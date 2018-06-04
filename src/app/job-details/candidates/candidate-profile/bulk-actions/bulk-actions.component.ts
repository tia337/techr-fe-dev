import { Component, OnInit } from '@angular/core';
import { RootVCRService } from '../../../../root_vcr.service';
import { Socket } from 'ng-socket-io';
import { Parse } from '../../../../parse.service';

//tslint:disable:indent
@Component({
  selector: 'app-bulk-actions',
  templateUrl: './bulk-actions.component.html',
  styleUrls: ['./bulk-actions.component.scss']
})
export class BulkActionsComponent implements OnInit {

  candidatesArray = [];
  candidatesTempArray = [];
  paginationArray: Array<{page: number, sliceNumber: {from: number, to: number}}> = [];
  rejectionReasons = [];
  bulkRejectionReasonsList = false;
  currentBulkReason = null;
  _contractId = '';
  bulkRejectionReasons = [];


  currentPage = 1;
  constructor(
    private _root_vcr: RootVCRService,
    private _socket: Socket,
    private _parse: Parse
  ) { }

  ngOnInit() {
  }

  closeModal() {
    this._root_vcr.clear();
  }

  set candidates (candidates) {
    // let user = data.user;
  // let contractId = data.contractId;
  // let candidateId = data.candidateId;
  // let listId = data.listId;
  // let rejectedReasonId = (data.rejectedReason) ? data.rejectedReason : undefined;
  // let reason = (data.reason) ? data.reason : undefined;
  // let rejectionNote = (data.rejectionNote) ? data.rejectionNote : undefined;
  // let userList;
    this.candidatesTempArray = candidates;
    this.candidatesTempArray.forEach(candidate => {
      candidate.rejectionReason = null;
      candidate.rejectedReasonId = null;
      candidate.reason = null;
      candidate.hasRejectionReason = false;
      candidate.personalRejectionReason = false;
      candidate.listId = 6;
      candidate.candidateId = candidate.id;
      candidate.contractId = this.contractId;
      candidate.user = this._parse.Parse.User.current().toPointer();      
      candidate.rejectionList = {
          opened: false,
          reasons: []
        }
      ;
    });
    this.candidatesTempArray = this.candidatesTempArray.filter((elem, pos, arr) => {
      return arr.indexOf(elem) === pos;
    });
    this.candidatesArray = this.candidatesTempArray.slice(0, 10);
    this.createPagination(this.candidatesTempArray);
    this.getRejectionReasons(this.candidatesTempArray);
    this.addConctractId(this.candidatesArray);
  }

  get candidates () {
    return this.candidatesArray;
  }

  set contractId (value) {
    this._contractId = value;
  }

  get contractId () {
    return this._contractId;
  }

  createPagination (array) {
    const pagesQuantity = array.length / 10;
    pagesQuantity.toFixed(0);
    for (let i = 1; i < pagesQuantity + 1; i++) {
      const to = i * 10;
      const page = {
        page: i,
        sliceNumber: {
          from: to - 10,
          to: to
        }
      };
      this.paginationArray.push(page);
    }
  }

  setRejectionReason (candidate, reason) {
    candidate.rejectionList.opened = false;
    candidate.rejectionReason = reason;
    candidate.rejectedReasonId = reason.id;
    candidate.reason = reason.get('rejectionReason'); 
    candidate.personalRejectionReason = true;
    const data = {
      candidateId: candidate.id,
      reason: reason
    };
    if (this.rejectionReasons.length === 0) {
      this.rejectionReasons.push(data);
      candidate.hasRejectionReason = true;
      return;
    } else if (this.rejectionReasons.length > 0) {
      if (candidate.hasRejectionReason === false) {
        this.rejectionReasons.push(data);
        candidate.hasRejectionReason = true;
      } else {
        this.rejectionReasons.forEach(item => {
          if (item.candidateId === candidate.id) {
            const index = this.rejectionReasons.indexOf(item);
            this.rejectionReasons.splice(index, 1);
            this.rejectionReasons.push(data);
          };
        });
      }
    }
  }

  setBulkRejectionReason (reason) {
    this.bulkRejectionReasonsList = false;
    this.currentBulkReason = reason;
    const newRejections = [];
    if (this.rejectionReasons.length === this.candidatesTempArray.length) {
      this.rejectionReasons.forEach(item => {
        const index = this.rejectionReasons.indexOf(item);
        this.rejectionReasons.splice(index, 1);
        const data = {
          candidateId: item.candidateId,
          reason: reason
        };
        this.rejectionReasons.push(data);
      });
      this.candidatesTempArray.forEach(candidate => {
        if (candidate.personalRejectionReason === false) {
          candidate.rejectionReason = reason;
          candidate.rejectedReasonId = reason.id;
          candidate.reason = reason.get('rejectionReason'); 
        }
      });
    } else {
      this.candidatesTempArray.forEach(candidate => {
        if (candidate.personalRejectionReason === false) {
            candidate.rejectionReason = reason;
            candidate.rejectedReasonId = reason.id;
            candidate.reason = reason.get('rejectionReason'); 
            candidate.hasRejectionReason = true;
            const data = {
              candidateId: candidate.id,
              reason: reason
            };
            this.rejectionReasons.push(data);
        }
      });
    }
  }

  getRejectionReasons(candidates) {
    const query = this._parse.Query('RejectedCandidateReasons');
    query.find().then(data => {
      this.bulkRejectionReasons = data;
        candidates.forEach(candidate => {
          candidate.rejectionList.reasons = data;
        });
    });
  }

  rejectCandidates() {
    console.log(this.candidatesArray);
    this._socket.emit('updateHiringPipelineBulk', {
      candidates: this.candidatesArray,
      contractId: this._contractId,
    });
  }

  addConctractId (candidates) {
    candidates.forEach(candidate => {
      candidate.contractId = this.contractId;
    })
  }

  showPage(params) {
    this.candidatesArray = this.candidatesTempArray.slice(params.from, params.to);
  }



  
}
