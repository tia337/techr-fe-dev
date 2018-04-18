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
  private _startFrom = 0;
  private timelineStorage: Array<any> = [];
  private timelineTempStorage: Array<any> = [];
  public loader = false;
  private _timelineQueryLimits = {
		from: 0,
		to: 15
  };
  private _notificationsArrayLimits = {
    from: 0,
    to: 5
  };

  constructor(
    private _socket: Socket,
    private _timelineService: TimelineService
  ) { }

  ngOnInit() {
    // this._timelineService.emitSocketEventForRecievingTimeline(this._startFrom);
    // this._timelineService.recieveTimelineFromSocket().subscribe(timeline => {
    //   console.log(timeline);
    //   this.sortTimeline(timeline);
    // });
    // this._startFrom += 100;
  }

  // sortTimeline (data) {
  //   this.timelineArray = this._timelineService.sortTimeline(data);
  //   console.log(this.timelineArray);
  // }

  // goToJobDetails (contractId: string, stage: number) {
  //   this._timelineService.goToJobDetails(contractId, stage);
  // }

  // uploadMoreNotifications (event) {
  //   if (event.target.scrollHeight - event.target.scrollTop - event.target.offsetHeight === 0) {
  //     if (this._timelineQueryLimits.from > this._notificationsArrayLimits.from) {
  //       this.loader = true;
  //       const slicedArray = this.timelineStorage
  //         .slice(this._notificationsArrayLimits.from, this._notificationsArrayLimits.to);
  //       this.timelineTempStorage = this.timelineTempStorage.concat(slicedArray);
  //       this.timelineArray = this.sortTimeline(this.timelineTempStorage);
  //       this._notificationsArrayLimits.from += 5;
  //       this._notificationsArrayLimits.to += 5;
  //     } else if (this._timelineQueryLimits.from === this._notificationsArrayLimits.from) {
  //       this.loadNotifications();
  //     };
  //   };
  // };

  // loadNotifications () {
  //   this.loader = true;
  //   const date = new Date();
  //   date.setMonth(date.getMonth() - 3);
  //   this._parse.execCloud('getAllNotifications',
  //     {
  //       userId: this._parse.getCurrentUser().id,
  //       clientId: this._parse.getCurrentUser().get('Client_Pointer').id,
  //       limits: this._timelineQueryLimits,
  //       date: date
  //     })
  //     .then(result => {
  //       const data = JSON.parse(result);
  //       if (this.notificationsArray.length === 0) {
  //         this.timelineStorage = data;
  //         this.timelineTempStorage = this.timelineStorage
  //           .slice(this._notificationsArrayLimits.from, this._notificationsArrayLimits.to);
  //         this.notificationsArray =	this.sortNotifications(this.timelineTempStorage);
  //       } else {
  //         this.timelineStorage = this.timelineStorage.concat(data);
  //         const slicedArray = this.timelineStorage
  //           .slice(this._notificationsArrayLimits.from, this._notificationsArrayLimits.to);
  //         this.timelineTempStorage = this.timelineTempStorage.concat(slicedArray);
  //         this.notificationsArray = this.sortNotifications(this.timelineTempStorage);
  //       }
  //       this._timelineQueryLimits.from += 15;
  //       this._timelineQueryLimits.to += 15;
  //       this._notificationsArrayLimits.from += 5;
  //       this._notificationsArrayLimits.to += 5;
	//   	}).catch(error => {
  //       console.log(error);
  //     });
  // }

}
