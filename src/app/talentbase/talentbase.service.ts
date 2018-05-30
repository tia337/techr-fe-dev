import { Injectable } from '@angular/core';
import { Parse } from '../parse.service';
import * as _ from "underscore";

//tslint:disable:indent
@Injectable()
export class TalentbaseService {


  constructor(
    private _parse: Parse
  ) { }


  uploadMoreCandidates(limits: PaginationLimits, array: TalentDBCandidate[]): TalentDBCandidate[] {
    const arrayNew: TalentDBCandidate[] = array.slice(limits.from, limits.to);
    return arrayNew;
  }

  selectAllCandidates (array) {
    const checkedArray = [];
    array.forEach(candidate => {
      candidate.checked = true;
      checkedArray.push(candidate);
    });
    return checkedArray;
  }

  getTalentDBCandidates(clientId: string): Promise<TalentDBCandidate[]> {
    return new Promise ((resolve, reject) => {
      this._parse.execCloud('getTalentDBCandidates', { clientId: clientId }).then((result: TalentDBCandidate[]) => {
        resolve(result);
        reject(result);
      });
    });
  }

  getFilter(functionName: string, clientId: string): Promise<FilterItem> {
    return new Promise ((resolve, reject) => {
      this._parse.execCloud(functionName, { clientId: clientId }).then((result: FilterItem) => {
        result = this.sortFilterItems(result);
        resolve(result);
        reject(result);
      });
    });
  }

  getEnabledUserTalentDBFilters(userId: string): Promise<UserTalentDBFilter[]> {
    const query = this._parse.Query('User');
    query.equalTo('objectId', userId);
    return new Promise (resolve => {
      query.find().then(result => {
        resolve(result[0].get('enabledTalentDbFilters'));
      });
    });
  }

  sortFilterItems(item: FilterItem): FilterItem {
    const newItem: FilterItem = item;
    newItem.items.forEach(item => {
      item['checked'] = false;
      item['disabled'] = false;
      item['hidden'] = false;
      item['filteredUsersId'] = [];
    });
    newItem.items = _.sortBy(newItem.items, function (i) {
      return i.count;
    }).reverse();
    return newItem;
  }

  getAllFilterTypes(): Promise<UserTalentDBFilter[]> {
    const filterTypes: Array<UserTalentDBFilter> = [];
    const FilterTypesQuery = this._parse.Query('TalentDbFilters');
    return new Promise ((resolve, reject) => {
      FilterTypesQuery.find().then(result => {
        result.forEach(item => {
          const data = {
            title: item.get('title'),
            type: item.get('type'),
            checked: false
          };
          filterTypes.push(data);
          resolve(filterTypes);
        });
      });
    });
  }

  createFilterParams(item, filterParamsStorage: Array<any>): any {
    const storage = filterParamsStorage;
    let paramsArray: Array<string> = [];
    if (!item.checked) {
        storage.push(item);
        storage.forEach(param => {
          param.usersId.forEach(id => {
            paramsArray.push(id);
          });
        });
        paramsArray = this.removeDuplicatesFromFilterParams(paramsArray);
        return { filterParamsStorage: storage, filterParams: paramsArray };
    };
    if (item.checked) {
      storage.forEach(param => {
        if (item.title === param.title) {
          const index = storage.indexOf(param);
          storage.splice(index, 1);
        }
        storage.forEach(param => {
          param.usersId.forEach(id => {
            paramsArray.push(id);
          });
        });
      });
      paramsArray = this.removeDuplicatesFromFilterParams(paramsArray);
      return { filterParamsStorage: storage, filterParams: paramsArray };
    }
  }

  removeDuplicatesFromFilterParams(filterParams: Array<string>): Array<string> {
    let params: Array<string> = [];
    filterParams.forEach(param => {
        if (!params.includes(param)) {
          params.push(param);
        }
    });
    return params;
  }

  createFilterParamsForCompoundFilter(array): Array<string> {
    if (array.length > 0) {
      let newArray = [];
      array[0].usersId.forEach(id => {
        newArray.push(id);
      });
      console.log('newArray', newArray);
      for (let i = 1; i < array.length; i++) {
        let tempArray = [];
        for (let b = 0; b < array[i].usersId.length; b++) {
          for (let a = 0; a < newArray.length; a++) {
            if (array[i].usersId[b] === newArray[a] && !tempArray.includes(array[i].usersId[b])) {
              tempArray.push(array[i].usersId[b]);
            }
          }
        }
        newArray = tempArray;
      }
      newArray = this.removeDuplicatesFromFilterParams(newArray);
      return newArray;
    }
  }

  filterCandidates(candidatesArray: Array<TalentDBCandidate>, filterParams: Array<string>): Array<TalentDBCandidate> {
    const filteredArray: Array<TalentDBCandidate> = [];
    candidatesArray.forEach(candidate => {
      filterParams.forEach(param => {
        if (candidate._id === param) {
          filteredArray.push(candidate);
        }
      });
    });
    return filteredArray;
  }

  searchCandidates(value: string, candidatesArray: Array<TalentDBCandidate> ): Array<TalentDBCandidate> {
    return candidatesArray.filter((candidate: TalentDBCandidate ) => {
      return `${candidate.firstName}' '${candidate.lastName}`.toLowerCase().indexOf(value) > -1
    });
  }
}
