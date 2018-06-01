import { Component, OnInit, OnDestroy } from '@angular/core';
import { TalentbaseService } from './talentbase.service';
import { AnimationBuilder } from '@angular/animations';
import { read } from 'fs';
import { Parse } from '../parse.service';
import { TalentDbFilters } from '../shared/utils';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Http, Headers, RequestOptions } from '@angular/http';
import { FileSizePipe } from './file-size.pipe';
import { HighlightSearchPipe } from './highlight-search.pipe';
import { AddCandidateComponent } from './add-candidate/add-candidate.component';
import { RootVCRService } from '../root_vcr.service';
import { Socket } from 'ng-socket-io';
import { Observable } from 'rxjs/Observable';
import { AddCandidateService } from './add-candidate/add-candidate.service';

// tslint:disable:indent
@Component({
  selector: 'app-talentbase',
  templateUrl: './talentbase.component.html',
  styleUrls: ['./talentbase.component.scss']
})
export class TalentbaseComponent implements OnInit, OnDestroy {

  public filtersOpened = false;
  allSelected = false;
  checkedCandidates: Array<any> = [];
  public activePanel: string = 'main';
  public enableDisableFiltersOpened = false;
  public jsonFileName: string = '';
  public zipFileName: File = null;
  public zipFileSizeExceed = false;
  public jsonForm: FormGroup;
  public zipForm: FormGroup;
  public noCandidatesFound = false;
  public filters: Array<FilterItem> = [];
  private filtersStorage: Array<FilterItem> = [];
  private latestFilterParam;
  public filterTypes: Array<UserTalentDBFilter> = [];
  public filterMode: string = 'and';
  public candidatesArray: Array<TalentDBCandidate> = [];
  private candidatesStorage: Array<TalentDBCandidate> = [];
  private filteredCandidatesStorage: Array<TalentDBCandidate> = [];
  private paginationLimits: PaginationLimits = { from: 0, to: 15 };
  private enabledUserTalentDBFilters: Array<UserTalentDBFilter> = [];
  private currentUser;
  private clientId: string;
  private filterParams: Array<string> = [];
  private filterParamsStorage = [];
  public bulkUploads: Array<BulkUploadItem> = [];
  public pendingBulkUpload: BulkUploadItem | undefined;
  public fillPercentage = {
    width: '0%'
  };
  filesTotal = 1680;
  filesProcessed = 0;

  constructor(
    private _talentBaseService: TalentbaseService,
    private _addCandidatesService: AddCandidateService,
    private _parse: Parse,
    private _fb: FormBuilder,
    private _http: Http,
    private _root_vcr: RootVCRService,
    private _socket: Socket
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

    this.getBulkUploads();

    this._addCandidatesService.goToImport.filter(value => value === true).subscribe(value => {
      this.activePanel = 'import';
      this._root_vcr.clear();
    });

    this.subscribeToPendingBulkUploading().subscribe((data: { filesSuccess: number, filesError: number }) => {
      this.setFillPercentage(this.pendingBulkUpload.filesTotal, data.filesSuccess);
      this.pendingBulkUpload.filesError = data.filesError;
    });


  }

  getFilters(userTalentDBFilters: Array<UserTalentDBFilter>): void {
    TalentDbFilters.forEach(filter => {
      userTalentDBFilters.forEach(item => {
        if (filter.type === item.type) {
          this._talentBaseService.getFilter(filter.functionName, this.clientId).then(result => {
            this.filters.push(result);
          }).catch(error => console.log(error));
        }
      });
    });
    this.getAllFilterTypes();
  }

  getAllFilterTypes(): void {
    this._talentBaseService.getAllFilterTypes().then(result => {
      this.filterTypes = result;
      this.checkFiltersOnInit(this.filterTypes, this.enabledUserTalentDBFilters);
    }).catch(error => console.log('error while getting getAllFilterTypes: ', error));
  }

  checkFiltersOnInit (allFilterTypes: Array<UserTalentDBFilter>, userFilterTypes: Array<UserTalentDBFilter>): void {
    allFilterTypes.forEach(filter => {
      userFilterTypes.forEach(item => {
        if (filter.type === item.type) {
          filter.checked = true;
        }
      });
    });
  }

  uploadMoreCandidates(event): void {
    if (event.target.scrollHeight - event.target.scrollTop - event.target.offsetHeight === 0) {
      if (this.filteredCandidatesStorage.length > 0) {
        this.candidatesArray = this.candidatesArray
          .concat(this._talentBaseService.uploadMoreCandidates(this.paginationLimits, this.filteredCandidatesStorage));
      } else if (this.filteredCandidatesStorage.length > 0) {
        this.candidatesArray = this.candidatesArray
          .concat(this._talentBaseService.uploadMoreCandidates(this.paginationLimits, this.candidatesStorage));
      }
      this.updatePaginationLimits();
    }
  }

  selectAllCandidates (): void {
   this.allSelected = !this.allSelected;
   this.checkedCandidates = this._talentBaseService.selectAllCandidates(this.candidatesArray);
  }

  setFileName(fileName, input, event): void {
    const ev = event;
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (ev) => {
      this.jsonFileName = file.name;
    };
  }

  setZipFileName (fileName, input, event): void {
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

  updatePaginationLimits (): void {
    this.paginationLimits.from += 15;
    this.paginationLimits.to += 15;
  }

  resetPaginationLimits(): void {
    this.paginationLimits.from = 0;
    this.paginationLimits.to = 15;
  }

  createForms(): void {
    this.jsonForm = this._fb.group({
      jsonFile: ['', Validators.required]
    });
    this.zipForm = this._fb.group({
      zipFile: ['', Validators.required]
    });
  }

  sendZip(event, value?): void {
    if (value === '' || this.zipFileName.size > 104857600) {
      return;
    } else {
      const file = this.zipFileName;
      const formData = new FormData();
      formData.append('file', file);
      formData.append('clientId', this.clientId);
      formData.append('authorId', this.currentUser.id);      
      const headers = new Headers({
        'Content-Type': 'multipart/form-data;boundary=--------------------------669278087152574002712453'
      });
      const options = new RequestOptions({ headers });
      const url = 'https://cv-bulk-upload.herokuapp.com/upload';
      this._http.post(url, formData).subscribe(res => {
        console.log(res);
        // if (res.status === 200) {
          this.activePanel = 'bulkUpload';
          this.getBulkUploads();
        // }
      });
    }
  }

  enableDisableFilterTypes (type: UserTalentDBFilter): void {
    this.candidatesArray = this.candidatesStorage;
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
      };
      this.enabledUserTalentDBFilters.push(item);
      this.filters = [];
      this.getFilters(this.enabledUserTalentDBFilters);
      type.checked = true;
    }
  }

  log(values) {
    console.log(values);
  }

  enableFilterType (item, filter): void {
    if (this.filterMode === 'and') {
      if (!item.disabled && item.count !== 0) {
        if (!item.checked) {
          this.latestFilterParam = item;
          if (this.filterParamsStorage.length === 0) {
            item.filteredUsersId = item.usersId;
            this.filterParamsStorage.push(item);
            const params = this._talentBaseService.createFilterParamsForCompoundFilter(this.filterParamsStorage);
            this.recountFilterTypeItemsCount(params);
            this.filterCandidates(this.candidatesStorage, params);
            item.checked = true;
            this.disableEnableFilterItems(filter, item);
            return;
          } else if (this.filterParamsStorage.length > 0) {
            this.filterParamsStorage.push(item);
            const params = this._talentBaseService.createFilterParamsForCompoundFilter(this.filterParamsStorage);
            this.recountFilterTypeItemsCount(params);
            this.filterCandidates(this.candidatesStorage, params);
            item.checked = true;
            this.disableEnableFilterItems(filter, item);
          }
          return;
        } else if (item.checked) {
          this.filterParamsStorage = this._talentBaseService.createFilterParams(item, this.filterParamsStorage).filterParamsStorage;
          const params = this._talentBaseService.createFilterParamsForCompoundFilter(this.filterParamsStorage);
          if (this.filterParamsStorage.length > 0) {
            this.recountFilterTypeItemsCount(params);
            this.filterCandidates(this.candidatesStorage, params);
          };
          if (this.filterParamsStorage.length === 0) {
            this.resetAll();
          };
          item.checked = false;
          this.disableEnableFilterItems(filter, item);
        }
      }
    }
    if (this.filterMode === 'or') {
        if (!item.checked) {
          const tempData = this._talentBaseService.createFilterParams(item, this.filterParamsStorage);
          this.filterParamsStorage = tempData.filterParamsStorage;
          this.filterParams = tempData.filterParams;
          this.filterCandidates(this.candidatesStorage, this.filterParams);
          item.checked = true;
          return;
        } else if (item.checked) {
          const tempData = this._talentBaseService.createFilterParams(item, this.filterParamsStorage);
          this.filterParamsStorage = tempData.filterParamsStorage;
          this.filterParams = tempData.filterParams;
          this.filterCandidates(this.candidatesStorage, this.filterParams);
          item.checked = false;
        }
    }
  }

  changeFilterMode(): void {
    if (this.filterMode === 'or') {
      this.filterMode = 'and';
      this.candidatesArray = this.candidatesStorage;
      this.filters = [];
      this.getFilters(this.enabledUserTalentDBFilters);
      return;
    } else if (this.filterMode === 'and') {
      this.filterMode = 'or';
      this.candidatesArray = this.candidatesStorage;
      this.filters = [];
      this.getFilters(this.enabledUserTalentDBFilters);
    }
  }

  resetFilters(): void {
    this.filters.forEach(filter => {
      filter.items.forEach(item => {
        item.filteredUsersId = [];
        item.count = item.usersId.length;
      });
    });
  }

  definePreviousFilterParam(filterParam, filterParamsStorage): number {
    let index;
    filterParamsStorage.forEach(filter => {
      if (filter.title === filterParam.title) {
        index = filterParamsStorage.indexOf(filter);
      }
    });
    if (index === 0) {
      return index;
    } else if (index > 0 && index !== filterParamsStorage.length - 1) {
      index = index - 1;
      return index;
    } else if (index === filterParamsStorage.length - 1) {
      return 0;
    }
  }

  setCountToLatestFilterParam(filterParam): void {
    this.filters.forEach(filter => {
      filter.items.forEach(item => {
        if (item.title === filterParam.title) {
          item.count = item.usersId.length;
          item.filteredUsersId = item.usersId;
        }
      });
    });
  }

  recountFilterTypeItemsCount(filterParams): void {
    this.filters.forEach(filter => {
      filter.items.forEach(item => {
        item.filteredUsersId = [];
        item.usersId.forEach(id => {
          filterParams.forEach(param => {
            if (id === param && !item.filteredUsersId.includes(param)) {
              item.filteredUsersId.push(param);
            };
          });
        });
        item.count = item.filteredUsersId.length;
      });
    });
  }

  disableEnableFilterItems(filter: FilterItem, item): void {
    if (item.checked) {
      filter.items.forEach(type => {
        if (type.title !== item.title) {
          type.disabled = true;
        }
      });
    };
    if (!item.checked) {
      filter.items.forEach(type => {
          type.disabled = false;
      });
    }
  }

  filterCandidates(candidatesArray: Array<TalentDBCandidate>, filterParams: Array<string>): void {
    this.resetPaginationLimits();
    this.filteredCandidatesStorage = this._talentBaseService.filterCandidates(candidatesArray, filterParams);
    this.candidatesArray = this.filteredCandidatesStorage.slice(0, 15);
    this.updatePaginationLimits();
  }

  resetAll(): void {
    this.resetPaginationLimits();
    this.resetFilters();
    this.filteredCandidatesStorage = [];
    this.candidatesArray = this.candidatesStorage.slice(0, 15);
    this.updatePaginationLimits();
  }

  filterTypeSearch(event, filter: FilterItem): void {
    const value = event.target.value.toLowerCase();
    filter.items.forEach(item => {
      if (typeof item.title === 'string') {
        const title = item.title.toLowerCase();
        if (title.indexOf(value) === -1) {
          item.hidden = true;
        }
        if (title.indexOf(value) > -1) {
          item.hidden = false;
        }
      }
    });
    if (value === '') {
      filter.items.forEach(item => {
        item.hidden = false;
      });
    }
  }

  searchCandidates(event): void {
    const value = event.target.value.toLowerCase();
    if (this.filterParamsStorage.length === 0) {
      this.noCandidatesFound = false;
      this.resetPaginationLimits();
      this.filteredCandidatesStorage = this._talentBaseService.searchCandidates(value, this.candidatesStorage);
      this.candidatesArray = this.filteredCandidatesStorage.slice(0, 15);
      this.updatePaginationLimits();
      if (this.filteredCandidatesStorage.length === 0) {
        this.noCandidatesFound = true;
      }
    };
    if (this.filterParamsStorage.length > 0) {
      this.noCandidatesFound = false;
      this.resetPaginationLimits();
      this.filteredCandidatesStorage = this._talentBaseService.searchCandidates(value, this.filteredCandidatesStorage);
      this.candidatesArray = this.filteredCandidatesStorage.slice(0, 15);
      this.updatePaginationLimits();
      if (this.filteredCandidatesStorage.length === 0) {
        this.noCandidatesFound = true;
      }
    }
  }

  openAddCandidateModal(): void {
    const addCandidateModal = this._root_vcr.createComponent(AddCandidateComponent);
  }

  definePendingBulkUploads(pendingBulkUpload: BulkUploadItem | undefined): void {
    if (pendingBulkUpload === undefined) return;

    // this.initiate();

    this.subscribeToPendingBulkUploading().subscribe((data: { filesSuccess: number, filesError: number }) => {
      this.setFillPercentage(pendingBulkUpload.filesTotal, data.filesSuccess);
      this.pendingBulkUpload.filesError = data.filesError;
    });
  }

  subscribeToPendingBulkUploading(): Observable<any> {
    const observable = new Observable (observer => {
			this._socket.on('bulkUploadProgress', data => {
				observer.next(data);
			});
		});
		return observable;
  }

  initiate() {
    this.filesProcessed = this.filesProcessed + 5.25;
    setInterval(() => {
      if (this.filesTotal !== this.filesProcessed && this.filesTotal > this.filesProcessed) {
        this.initiate();
      }
    }, 1500);
    this.setFillPercentage(this.filesTotal, this.filesProcessed);
  }

  setFillPercentage(filesTotal: number, filesProcessed: number): void {
    const percentage = this._talentBaseService.calculatePercentageOfBulkUploading(filesTotal, filesProcessed);
    this.fillPercentage.width = `${percentage}%`;
  }

  getBulkUploads(): void {
    this._talentBaseService.getBulkUploads(this.clientId).then((result: BulkUploadItem[]) => {
      this.bulkUploads = result;
      this.pendingBulkUpload = this._talentBaseService.checkPendingBulkUploads(result);
      this.definePendingBulkUploads(this.pendingBulkUpload);
    }).catch(error => console.log('error while getting getBulkUploads: ', error));
  }

  sortBulkUploadsHistory(parameter: string): void {
    this.bulkUploads = this._talentBaseService.sortBulkUploadHistory(parameter, this.bulkUploads);
  }


  ngOnDestroy(): void {
    this._parse.execCloud('setNewTalentDbFilters', { userId: this.currentUser.id, filtersArray: this.enabledUserTalentDBFilters });
  }

}
