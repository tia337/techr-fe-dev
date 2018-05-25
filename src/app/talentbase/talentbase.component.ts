import { Component, OnInit, OnDestroy } from '@angular/core';
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
import { FileSizePipe } from './file-size.pipe';
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
export class TalentbaseComponent implements OnInit, OnDestroy {

  filtersOpened = false;
  allSelected = false;
  checkedCandidates: Array<any> = [];
  importPanelOpened = false;
  enableDisableFiltersOpened = false;
  jsonFileName = '';
  zipFileName: File = null;
  zipFileSizeExceed = false;
  jsonForm: FormGroup;
  zipForm: FormGroup;
  public filters: Array<FilterItem> = [];
  public filterTypes: Array<UserTalentDBFilter> = [];
  public candidatesArray: Array<TalentDBCandidate> = [];
  private paginationLimits: PaginationLimits = { from: 0, to: 15 };
  private enabledUserTalentDBFilters: Array<UserTalentDBFilter> = [];
  private candidatesStorage: Array<TalentDBCandidate> = [];
  private filterParams: FilterParams;
  private currentUser;
  private clientId: string;

  constructor(
    private _talentBaseService: TalentbaseService,
    private _parse: Parse,
    private _fb: FormBuilder,
    private _http: Http,
  ) { }

  ngOnInit() {

    this.currentUser = this._parse.getCurrentUser();
    this.clientId = this._parse.getClientId();

    this._talentBaseService.getTalentDBCandidates(this.clientId).then(data => {
      this.candidatesArray = data.slice(this.paginationLimits.from, this.paginationLimits.to);
      this.candidatesStorage = data;
      this.updatePaginationLimits();
    }).catch(error => console.log('error while getting talentDB candidates: ', error));

    this._talentBaseService.getEnabledUserTalentDBFilters(this.currentUser.id).then(result => {
      this.enabledUserTalentDBFilters = result;
      this.getFilters(this.enabledUserTalentDBFilters);
    }).catch(error => console.log('error while getting getEnabledUserTalentDBFilters : ', error));

    this.createForms();

  }

  getFilters(userTalentDBFilters: Array<UserTalentDBFilter>) {
    TalentDbFilters.forEach(filter => {
      userTalentDBFilters.forEach(item => {
        if (filter.type === item.type) {
          this._talentBaseService.getFilter(filter.functionName, this.clientId).then(result => {
            this.filters.push(result);
            console.log(this.filters);
          }).catch(error => console.log(error));
        }
      });
    });
    this.getAllFilterTypes();
  }

  getAllFilterTypes() {
    this._talentBaseService.getAllFilterTypes().then(result => {
      this.filterTypes = result;
      this.checkFiltersOnInit(this.filterTypes, this.enabledUserTalentDBFilters);
    }).catch(error => console.log('error while getting getAllFilterTypes: ', error));
  }

  checkFiltersOnInit (allFilterTypes: Array<UserTalentDBFilter>, userFilterTypes: Array<UserTalentDBFilter>) {
    allFilterTypes.forEach(filter => {
      userFilterTypes.forEach(item => {
        if (filter.type === item.type) {
          filter.checked = true;
        }
      })
    });
  }

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
    if (value === '' || this.zipFileName.size > 104857600) {
      return;
    } else {
      const file = this.zipFileName;
      const formData = new FormData();
      formData.append('file', file);
      formData.append('clientId', this.clientId);
      const headers = new Headers({
        'Content-Type': 'multipart/form-data;boundary=--------------------------669278087152574002712453'
      });
      const options = new RequestOptions({ headers });
      const url = 'https://cv-bulk-upload.herokuapp.com/upload';
      this._http.post(url, formData).subscribe(res => {
        console.log(res);
      });
    }
  }

  enableDisableFilterTypes (type: UserTalentDBFilter) {   
    if (type.checked) {
      this.enabledUserTalentDBFilters.forEach(item => {
        if (item.type === type.type) {
          const index = this.enabledUserTalentDBFilters.indexOf(item);
          this.enabledUserTalentDBFilters.splice(index, 1);
          this.filters = [];          
          this.getFilters(this.enabledUserTalentDBFilters);
          type.checked = false;
        }
      });
      return;
    } else if (!type.checked) {
      const index = this.enabledUserTalentDBFilters.length + 1;
      const item: UserTalentDBFilter = {
        type: type.type,
        title: type.title,
        index: index.toString()
      }
      this.enabledUserTalentDBFilters.push(item);
      this.filters = [];
      this.getFilters(this.enabledUserTalentDBFilters);
      type.checked = true;
    }
  }

  log(values) {
    console.log(values);
  }

  ngOnDestroy() {
    this._parse.execCloud('setNewTalentDbFilters', { userId: this.currentUser.id, filtersArray: this.enabledUserTalentDBFilters });
  }

}
