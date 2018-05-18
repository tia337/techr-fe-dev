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
import { read } from 'fs';
import { Parse } from '../parse.service';
import { TalentDbFilters } from '../shared/utils';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Http, Headers, RequestOptions } from '@angular/http';
// tslint:disable:indent
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
  filters: Array<FilterItem> = [];
  clientTalentDBFilters: Array<ClientTalentDBFilter> = [];
  candidatesArray: Array<TalentDBCandidate> = [];
  candidatesStorage: Array<TalentDBCandidate> = [];
  checkedCandidates: Array<any> = [];
  importPanelOpened = false;
  jsonFileName = '';
  zipFileName = '';
  zipFileSizeExceed = false;
  private paginationLimits = {
    from: 0,
    to: 15
  };
  filterParams: FilterParams;
  private currentUser;
  private clientId: string;
  jsonForm: FormGroup;
  zipForm: FormGroup;

  constructor(
    private _talentBaseService: TalentbaseService,
    private _parse: Parse,
    private _fb: FormBuilder,
    private _http: Http
  ) { }

  ngOnInit() {

    this.currentUser = this._parse.getCurrentUser();
    this.clientId = this._parse.getClientId();

    this._talentBaseService.getTalentDBCandidates(this.clientId).then(data => {
      this.candidatesArray = data.slice(this.paginationLimits.from, this.paginationLimits.to);
      this.candidatesStorage = data;
      this.updatePaginationLimits();
    }).catch(error => console.log('error while getting talentDB candidates: ', error));

    this._talentBaseService.getClientTalentDBFilters(this.clientId).then(result => {
      this.clientTalentDBFilters = result;
      this.getFilters(this.clientTalentDBFilters);
    }).catch(error => console.log('error while getting getClientTalentDBFilters: ', error));

    this.createForms();
  }

  getFilters(clientTalentDBFilters: Array<ClientTalentDBFilter>) {
    TalentDbFilters.forEach(filter => {
      clientTalentDBFilters.forEach(item => {
        if (filter.type === item.type) {
          this._talentBaseService.getFilter(filter.functionName, this.clientId).then(result => {
            this.filters.push(result);
          }).catch(error => console.log(error));
        }
      });
    });
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
        .concat(this._talentBaseService.uploadMoreCandidates(this.paginationLimits, this.candidatesStorage));
        this.updatePaginationLimits();
    }
  }

  selectAllCandidates () {
   this.allSelected = !this.allSelected;
   this.checkedCandidates = this._talentBaseService.selectAllCandidates(this.candidatesArray);
  }

  setFileName(fileName, input, event) {
    const ev = event;
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (ev) => {
      this.jsonFileName = file.name;
    };
  }

  setZipFileName (fileName, input, event) {
    const ev = event;
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = (ev) => {
      if (file.size > 104857600) {
        this.zipFileSizeExceed = true;
      }
    };
    reader.onload = (ev) => {
      this.zipFileName = file;
    };
    reader.readAsText(file);
  }

  updatePaginationLimits () {
    this.paginationLimits.from += 15;
    this.paginationLimits.to += 15;
  }

  createForms() {
    this.jsonForm = this._fb.group({
      jsonFile: ['', Validators.required]
    });
    this.zipForm = this._fb.group({
      zipFile: ['', Validators.required]
    });
  }

  sendZip(event, value?) {
    if (value === '') {
      return;
    } else {
      const file = this.zipFileName;
      const formData = new FormData();
      formData.append('file', file);
      const headers = new Headers({
        'content-type': 'application/zip'
      });
      const options = new RequestOptions({ headers });
      const url = 'https://cv-bulk-upload.herokuapp.com/upload';
      this._http.post(url, formData, options).subscribe(res => {
        const body = res.json();
        console.log(res);
      });
    }
  }

}
