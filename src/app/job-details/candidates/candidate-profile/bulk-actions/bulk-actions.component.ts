import { Component, OnInit } from '@angular/core';
import { RootVCRService } from '../../../../root_vcr.service';
//tslint:disable:indent
@Component({
  selector: 'app-bulk-actions',
  templateUrl: './bulk-actions.component.html',
  styleUrls: ['./bulk-actions.component.scss']
})
export class BulkActionsComponent implements OnInit {

  candidatesArray: BulkActionsArray = [];
  candidatesTempArray:  BulkActionsArray = [];
  paginationArray: Array<{page: number, sliceNumber: {from: number, to: number}}> = [];
  rejectionReasons = [];
  bulkRejectionReasonsList = false;
  currentBulkReason = null;
  bulkRejectionReasons = [
    {
      type: '0',
      reason: 'Not a good fit/Wrong skills set'
    },
    {
      type: '1',
      reason: 'Unsutable personality'
    },
    {
      type: '2',
      reason: 'Co workers don\'t approve'
    },
    {
      type: '3',
      reason: 'No references'
    },
    {
      type: '4',
      reason: 'Unfordable Salary Expectations'
    }
  ];


  currentPage = 1;
  constructor(
    private _root_vcr: RootVCRService
  ) { }

  ngOnInit() {
  }

  closeModal() {
    this._root_vcr.clear();
  }

  set candidates (candidates) {
    this.candidatesTempArray = candidates;
    this.candidatesTempArray.forEach(candidate => {
      candidate.rejectionReason = null;
      candidate.hasRejectionReason = false;
      candidate.personalRejectionReason = false;
      candidate.rejectionList = {
          opened: false,
          reasons: [
            {
              type: '0',
              reason: 'Not a good fit/Wrong skills set'
            },
            {
              type: '1',
              reason: 'Unsutable personality'
            },
            {
              type: '2',
              reason: 'Co workers don\'t approve'
            },
            {
              type: '3',
              reason: 'No references'
            },
            {
              type: '4',
              reason: 'Unfordable Salary Expectations'
            }
          ]
        }
      ;
    });
    this.candidatesTempArray = this.candidatesTempArray.filter((elem, pos, arr) => {
      return arr.indexOf(elem) === pos;
    });
    this.candidatesArray = this.candidatesTempArray.slice(0, 10);
    this.createPagination(this.candidatesTempArray);
  }

  get candidates () {
    return this.candidatesArray;
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
        }
      });
    } else {
      this.candidatesTempArray.forEach(candidate => {
        if (candidate.personalRejectionReason === false) {
            candidate.rejectionReason = reason;
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

  showPage(params) {
    this.candidatesArray = this.candidatesTempArray.slice(params.from, params.to);
  }

}
