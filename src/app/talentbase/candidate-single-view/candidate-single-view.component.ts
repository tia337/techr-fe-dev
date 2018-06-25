import { Component, OnInit, OnDestroy } from '@angular/core';
import { Parse } from '../../parse.service';
import { ActivatedRoute } from '@angular/router';
import { CandidateSingleViewService } from './candidate-single-view.service';

@Component({
  selector: 'app-candidate-single-view',
  templateUrl: './candidate-single-view.component.html',
  styleUrls: ['./candidate-single-view.component.scss']
})
export class CandidateSingleViewComponent implements OnInit, OnDestroy {

  public leftBlockInfo: SingleViewCandidateLeftBlock;
  public userId: string;
  public clientId: string = this._parse.getClientId();

  constructor(
    private _parse: Parse,
    private _router: ActivatedRoute,
    private _candidateSingleViewService: CandidateSingleViewService
  ) { }

  ngOnInit() {
    this._router.params.distinct().subscribe((params: { id: string }) => {
      this.userId = params.id;
      this.getCandidateInfo(this.userId, this.clientId);
    });
  }

  getCandidateInfo(userId, clientId) {
    this.getCandidateSingleViewLeftBlock(userId, clientId);
    this.getCandidateSingleViewCenterBlock(userId, clientId);
    this.getCandidateSingleViewRightBlock(userId, clientId); 
  }

  getCandidateSingleViewLeftBlock(userId, clientId) {
    this._candidateSingleViewService.getCandidateSingleViewLeftBlock(userId, clientId).then(result => {
      console.log('getCandidateSingleViewLeftBlock', result);
      this.leftBlockInfo = result;
    }).catch(error => console.log(error));
  }

  getCandidateSingleViewCenterBlock(userId, clientId) {
    this._candidateSingleViewService.getCandidateSingleViewCenterBlock(userId, clientId).then(result => {
      console.log('getCandidateSingleViewCenterBlock', result);
    }).catch(error => console.log(error));
  }

  getCandidateSingleViewRightBlock(userId, clientId) {
    this._candidateSingleViewService.getCandidateSingleViewRightBlock(userId, clientId).then(result => {
      console.log('getCandidateSingleViewRightBlock', result);
    }).catch(error => console.log(error));
  }

  ngOnDestroy() {

  }

}
