import { Component, OnInit } from '@angular/core';
import { JobOverviewService } from './job-overview.service';

@Component({
  selector: 'app-job-overview',
  templateUrl: './job-overview.component.html',
  styleUrls: ['./job-overview.component.scss']
})
export class JobOverviewComponent implements OnInit {

  constructor(private _jobOverviewService: JobOverviewService) { }

  private _contract;

  ngOnInit() {
    this._contract = this._jobOverviewService.getContract();
  }

  get contract() {
    return this._contract;
  }

}
