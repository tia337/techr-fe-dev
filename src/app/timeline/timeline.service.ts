import { Injectable } from '@angular/core';
import { Socket } from 'ng-socket-io';
import { Observable } from 'rxjs/Observable';
import { Parse } from '../parse.service';
import { resolve } from 'path';
import { JobBoxService } from '../jobs-page/job-box/job-box.service';

// tslint:disable:indent

@Injectable()
export class TimelineService {

  constructor (
    private _socket: Socket,
    private _parse: Parse,
    private _jobBoxService: JobBoxService
  ) { }

  getTimeline (data) {
    return this._parse.execCloud('getTimeline', data);
  }

  createDatesArray (data) {
    const datesToCompare = [];
    const datesToDisplay = [];
		data.forEach(notification => {
			const day: Date = new Date(notification._created_at);
			if (!datesToCompare.includes(day.toLocaleDateString())) {
        datesToCompare.push(day.toLocaleDateString());
        datesToDisplay.push(day);
      }
		});
		return {
      datesToCompare: datesToCompare,
      datesToDisplay: datesToDisplay
    };
  }

  sortTimeline(data) {
		const timelineSorted = [];
    const datesToCompare = this.createDatesArray(data).datesToCompare;
    const datesToDisplay = this.createDatesArray(data).datesToDisplay;
		let i = 0;
		datesToCompare.forEach(date => {
			const dayTimeline = [];
			const timelineArray = [];
			dayTimeline.push({
        date: datesToCompare[i],
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

  setQueryParams (candidateId: string, infoTab?: string) {
    if (candidateId !== undefined) {
      const data = {
        candidateId: candidateId,
        infoTab: infoTab ? infoTab : null
      };
      localStorage.setItem('queryParams', JSON.stringify(data));
    }
  }

}

