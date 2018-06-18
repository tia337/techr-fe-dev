import { Component, OnInit, OnDestroy } from '@angular/core';
import { TimelineService } from './timeline.service';
import { Socket } from 'ng-socket-io';
import { Parse } from '../parse.service';
import { Router } from '@angular/router';
import { JobBoxService } from '../jobs-page/job-box/job-box.service';
import { JobDetailsService } from '../job-details/job-details.service';
// tslint:disable:indent

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnInit, OnDestroy {

  public timelineStyle = 'old';
  public minimalistic = 'basic';
  public currentUser = this._parse.getCurrentUser();
  public timelineArray: Array<any> = [];
  private timelineStorage: Array<any> = [];
  private timelineTempStorage: Array<any> = [];
  private _startFrom = 0;
  public loader = false;
  private _timelineArrayLimits = { from: 0, to: 50 };
  private _timelineSubscription;
  constructor(
    private _socket: Socket,
    private _timelineService: TimelineService,
    private _parse: Parse,
    private _router: Router,
    private _jobBoxService: JobBoxService,
    private _jobDetailsService: JobDetailsService
  ) { }

  ngOnInit() {
    const data = {
      userId: this.currentUser.id,
      clientId: this._parse.getCurrentUser().get('Client_Pointer').id,
      startFrom: this._startFrom
    };
    this._timelineService.getTimeline(data).then(timeline => {
      this.timelineStorage = timeline;
      this.timelineTempStorage = this.timelineStorage.slice(this._timelineArrayLimits.from, this._timelineArrayLimits.to);
      this.sortTimeline(this.timelineTempStorage);
      this._timelineArrayLimits.from += 50;
      this._timelineArrayLimits.to += 50;
      this._startFrom += 100;
    });
  }

  sortTimeline (data) {
    this.timelineArray = this._timelineService.sortTimeline(data);
  }

  uploadMoreTimeline (event) {
    if (event.target.scrollHeight - event.target.scrollTop - event.target.offsetHeight === 0) {
      if (this._startFrom > this._timelineArrayLimits.from) {
        this.loader = true;
        const slicedArray = this.timelineStorage
          .slice(this._timelineArrayLimits.from, this._timelineArrayLimits.to);
        this.timelineTempStorage = this.timelineTempStorage.concat(slicedArray);
        this.timelineArray = this._timelineService.sortTimeline(this.timelineTempStorage);
        this._timelineArrayLimits.from += 50;
        this._timelineArrayLimits.to += 50;
      } else if (this._startFrom === this._timelineArrayLimits.from) {
        this.loadTimeline();
      };
    };
  };

  loadTimeline () {
    const data = {
      userId: this.currentUser.id,
      clientId: this._parse.getCurrentUser().get('Client_Pointer').id,
      startFrom: this._startFrom
    };
    this._timelineService.getTimeline(data).then(timeline => {
      this.timelineStorage = this.timelineStorage.concat(timeline);
      const slicedArray = this.timelineStorage
        .slice(this._timelineArrayLimits.from, this._timelineArrayLimits.to);
      this.timelineTempStorage = this.timelineTempStorage.concat(slicedArray);
      this.timelineArray = this._timelineService.sortTimeline(this.timelineTempStorage);
      this._timelineArrayLimits.from += 50;
      this._timelineArrayLimits.to += 50;
    });
  }

  route(contractId: string, stage: number, candidateId?: string, infoTab?: string) {
    // console.log(contractId, stage, candidateId, infoTab);
    // console.log('routeed');
    let contract;
    const contractQuery = this._parse.Query('Contract');
    contractQuery.equalTo('objectId', contractId);
    contractQuery.find().then(result => {
      contract = result;
      this._jobBoxService.activeContract = contract;
      this._jobDetailsService.activeStage = stage;
      localStorage.setItem('activeStage', stage.toString());
      if (candidateId) {
        this._timelineService.setQueryParams(candidateId, infoTab);
      }
      this._router.navigate(['/jobs', contractId]);
    });
  }

  parse(data) {
    const parsedNumber = parseFloat(data.toString());
    return parsedNumber;
  }

  ngOnDestroy() {
  }

}
