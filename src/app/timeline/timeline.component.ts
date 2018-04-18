import { Component, OnInit } from '@angular/core';
import { TimelineService } from './timeline.service';
import { Socket } from 'ng-socket-io';
// tslint:disable:indent

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnInit {

  public timelineArray = [];

  constructor(
    private _socket: Socket,
    private _timelineService: TimelineService
  ) { }

  ngOnInit() {
    this._timelineService.emitSocketEventForRecievingTimeline();
    this._timelineService.recieveTimelineFromSocket().subscribe(timeline => {
      console.log(timeline);
    });
  }



}
