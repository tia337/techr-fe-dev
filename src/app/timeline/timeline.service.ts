import { Injectable } from '@angular/core';
import { Socket } from 'ng-socket-io';
import { Observable } from 'rxjs/Observable';
import { JobBoxService } from '../jobs-page/job-box/job-box.service';
import { JobDetailsService } from '../job-details/job-details.service';
import { Parse } from '../parse.service';
import { Router, Route, ActivatedRoute } from '@angular/router';
import { DeveloperListType, JobType, ContractStatus } from '../shared/utils';

    // tslint:disable:indent

@Injectable()
export class TimelineService {

  constructor (
    private _jobBoxService: JobBoxService,
    private _jobDetailsService: JobDetailsService,
    private _ar: ActivatedRoute,
    private _socket: Socket,
    private _router: Router,
    private _parse: Parse,
    private _route: Route,
  ) { }

  emitSocketEventForRecievingTimeline (startFrom) {
    this._socket.emit('give-me-timeline', {startFrom: startFrom});
  }

  recieveTimelineFromSocket () {
    const observable = new Observable (observer => {
      this._socket.on('timeline-fetched', data => {
        observer.next(data);
      });
    });
    return observable;
  }

  createDatesArray (data) {
    const dates = [];
    const datesToDisplay = [];
		data.forEach(notification => {
			const day: Date = new Date(notification._created_at);
			if (!dates.includes(day.toLocaleDateString())) {
        dates.push(day.toLocaleDateString());
        datesToDisplay.push(day);
      }
		});
		return {
      dates: dates,
      datesToDisplay: datesToDisplay
    };
  }

  sortTimeline(data) {
		const timelineSorted = [];
    const dates = this.createDatesArray(data).dates;
    const datesToDisplay = this.createDatesArray(data).datesToDisplay;
		let i = 0;
		dates.forEach(date => {
			const dayTimeline = [];
			const timelineArray = [];
			dayTimeline.push({
        date: dates[i],
        dateToDisplay: datesToDisplay[i]
      });
			i++;
			data.forEach(timeline => {
				const timelineDate: Date = new Date (timeline._created_at);
				if (timelineDate.toLocaleDateString() === date) {
					timelineArray.push(timeline);
				}
			});
			dayTimeline.push({ timeline: timelineArray });
			timelineSorted.push(dayTimeline);
    });
    return timelineSorted;
  }
  
  goToJobDetails(contractId: string, stage: number) {
    const contractQuery = this._parse.Query('Contract');
    contractQuery.equalTo('objectId', contractId);
    contractQuery.find().then(contract => {
      this._router.navigate(['/jobs', contractId]);
      this._jobBoxService.activeContract = contract;
      if (contract.get('status') == ContractStatus.draft) {
        this._router.navigate(['/jobs', contractId]);
        setTimeout(() => {
          this._router.navigate(['/jobs', contractId, 'job-overview'], { skipLocationChange: true, relativeTo: this._ar });
        }, 1);
      } else {
      }
      this._jobDetailsService.activeStage = stage;
      localStorage.setItem('activeStage', stage.toString());
    });
	}


}
