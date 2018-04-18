import { Injectable } from '@angular/core';
import { Socket } from 'ng-socket-io';
import { Observable } from 'rxjs/Observable';
    // tslint:disable:indent

@Injectable()
export class TimelineService {

  constructor (
    private _socket: Socket
  ) { }

  emitSocketEventForRecievingTimeline () {
    this._socket.emit('give-me-timeline', {startFrom: 10});
  }

  recieveTimelineFromSocket () {
    const observable = new Observable (observer => {
      this._socket.on('timeline-fetched', data => {
        observer.next(data);
      });
    });
    return observable;
  }



}
