import { Injectable } from '@angular/core';
import { JobDetailsService } from '../job-details.service';

@Injectable()
export class JobOverviewService {

  constructor(private _jobDetailsService: JobDetailsService) { }

  getContract() {
    return this._jobDetailsService.contract;
  }

}
