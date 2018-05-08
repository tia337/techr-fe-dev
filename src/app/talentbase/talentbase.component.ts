import { Component, OnInit } from '@angular/core';
import { TalentbaseService } from './talentbase.service';
import {AnimationBuilder} from '@angular/animations';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
//tslint:disable:indent
@Component({
  selector: 'app-talentbase',
  templateUrl: './talentbase.component.html',
  styleUrls: ['./talentbase.component.scss'],
  animations: [
    trigger('shrinkOut', [
      state('in', style({})),
      transition('* => void', [
        style({ height: '*', opacity: 1 }),
        animate(600, style({ height: 0, opacity: 0 }))
      ]),
      transition('void => *', [
        style({ height: 0, opacity: 0 }),
        animate(400, style({ height: '*', opacity: 1 }))
      ])
    ]),
  ]
})
export class TalentbaseComponent implements OnInit {

  filtersOpened = false;
  allSelected = false;
  filtersArray = [];
  pipelineStagesArray = [];
  candidatesArray = [];
  checkedCandidates: Array<any> = [];
  private paginationLimits = {
    from: 0,
    to: 30
  };
  filterParams: FilterParams = {
     applied: [],
     pipeline: [],
     location: [],
     preferences: [],
     source: []
  };
  jobTitlesArray  = ['Angular 2 dev', 'PHP dev', 'Markup dev', 'Back-end dev', 'Node.js dev', 'ReactJS dev'];
  pipelineArray = ['Applied', 'Referral', 'Shortlist', 'Phone Interview', 'F2F Interview', 'Job Offered', 'Hired', 'Rejected'];
  candidateNames = ['John Smith', 'Petra Smirnova', 'George Prokopenko', 'Michael Tsukalo', 'Geronimo Caddilac', 'Nikita Khruschev'];
  candidateLocations = [
    { city: 'Madrid', country: 'Spain' },
    { city: 'Pavlograd', country: 'Ukraine' },
    { city: 'London', country: 'England'},
    { city: 'Barcelona', country: 'Spain'},
    { city: 'Manchester', country: 'England'},
    { city: 'Bogoduhov', country: 'Ukraine'}
  ];
  candidatePositions = ['Head of Recruitement', 'Simply cool guy', 'Not so good guy', 'Cool developer', 'Nice designer', 'Not nice designer'];
  candidateAppliedJob = ['SwipeIn', 'RabotaUA', 'WorkUA'];

  constructor(
    private _talentBaseService: TalentbaseService
  ) { }

  ngOnInit() {
    this.filtersArray = this._talentBaseService.createArray(this.jobTitlesArray, 'applied');
    this.pipelineStagesArray = this._talentBaseService.createArray(this.pipelineArray, 'pipeline');
    this.candidatesArray = this._talentBaseService.
      createCandidatesArray(this.filtersArray, this.pipelineStagesArray, this.jobTitlesArray, this.candidateNames, this.candidateLocations, this.candidatePositions, this.candidateAppliedJob).slice(0,30);
    this.paginationLimits.from += 30;
    this.paginationLimits.to += 30;
  }

  addToFilterParams(item, type: string) {
    if (this.filterParams[type].length === 0) {
      this.filterParams[type].push(item.id);
      item.checked = true;
      return;
    } else if (this.filterParams[type].includes(item.id)) {
      const index = this.filterParams[type].indexOf(item.id);
      this.filterParams[type].splice(index, 1);
      item.checked = false;
    } else if (!this.filterParams[type].includes(item.id)) {
      this.filterParams[type].push(item.id);
      item.checked = true;
    };
  };

  uploadMoreCandidates(event) {
    if (event.target.scrollHeight - event.target.scrollTop - event.target.offsetHeight === 0) {
      this.candidatesArray = this.candidatesArray
        .concat(this._talentBaseService.uploadMoreCandidates(this.paginationLimits, this.candidatesArray));
      this.paginationLimits.from += 30;
      this.paginationLimits.to += 30;
    }
  }

  selectAllCandidates () {
   this.allSelected = !this.allSelected;
   this.checkedCandidates = this._talentBaseService.selectAllCandidates(this.candidatesArray);
  }

}
