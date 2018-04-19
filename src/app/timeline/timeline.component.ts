import { Component, OnInit, OnDestroy } from '@angular/core';
import { TimelineService } from './timeline.service';
import { Socket } from 'ng-socket-io';
import { Parse } from '../parse.service';
// tslint:disable:indent

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnInit, OnDestroy {

  public currentUser = this._parse.getCurrentUser();
  public timelineArray: Array<any> = [];
  private timelineStorage: Array<any> = [];
  private timelineTempStorage: Array<any> = [];
  private _startFrom = 0;
  public loader = false;
  private _timelineQueryLimits = { from: 0, to: 15 };
  private _timelineArrayLimits = { from: 0, to: 5 };
  private _timelineSubscription;
  constructor(
    private _socket: Socket,
    private _timelineService: TimelineService,
    private _parse: Parse,
  ) { }

  ngOnInit() {
    this._timelineService.emitSocketEventForRecievingTimeline(this._startFrom);
    this._timelineSubscription = this._timelineService.recieveTimelineFromSocket().subscribe(timeline => {
      console.log(timeline);
      this.timelineStorage = timeline;
      this.sortTimeline(timeline);
    });
    this._startFrom += 100;
    console.log(this.currentUser);
  }

  sortTimeline (data) {
    this.timelineArray = this._timelineService.sortTimeline(data);
    console.log(this.timelineArray);
  }

  uploadMoreTimeline (event) {
    if (event.target.scrollHeight - event.target.scrollTop - event.target.offsetHeight === 0) {
      if (this._timelineQueryLimits.from > this._timelineArrayLimits.from) {
        this.loader = true;
        const slicedArray = this.timelineStorage
          .slice(this._timelineArrayLimits.from, this._timelineArrayLimits.to);
        this.timelineTempStorage = this.timelineTempStorage.concat(slicedArray);
        this.timelineArray = this._timelineService.sortTimeline(this.timelineTempStorage);
        this._timelineArrayLimits.from += 5;
        this._timelineArrayLimits.to += 5;
      } else if (this._timelineQueryLimits.from === this._timelineArrayLimits.from) {
        this.loadNotifications();
      };
    };
  };

  loadNotifications () {
    this._timelineService.emitSocketEventForRecievingTimeline(this._startFrom);
    this._timelineSubscription = this._timelineService.recieveTimelineFromSocket().subscribe(timeline => {
      console.log(timeline, 'timeline');
    });
  }

  ngOnDestroy() {
    this._timelineSubscription.unsubscribe();
  }

}
