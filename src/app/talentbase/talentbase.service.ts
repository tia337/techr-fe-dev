import { Injectable } from '@angular/core';
import { Parse } from '../parse.service';
import * as _ from "underscore";

//tslint:disable:indent
@Injectable()
export class TalentbaseService {


  constructor(
    private _parse: Parse
  ) { }


  uploadMoreCandidates(limits, array): TalentDBCandidate[] {
    const arrayNew = array.slice(limits.from, limits.to);
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
      this._parse.execCloud('getTalentDBCandidates', { clientId: clientId }).then(result => {
        resolve(result);
        reject(result);
      });
    });
  }

  getFilter(functionName: string, clientId: string): Promise<FilterItem> {
    return new Promise ((resolve, reject) => {
      this._parse.execCloud(functionName, { clientId: clientId }).then(result => {
        result = this.sortFilterItems(result);
        resolve(result);
        reject(result);
      });
    });
  }

  getClientTalentDBFilters(clientId: string): Promise<ClientTalentDBFilter[]> {
    const query = this._parse.Query('Clients');
    query.equalTo('objectId', clientId);
    return new Promise (resolve => {
      query.find().then(result => {
        resolve(result[0].get('talentDbFilters'));
      });
    });
  }

  sortFilterItems(item: FilterItem): FilterItem {
    const newItem: FilterItem = item;
    newItem.items = _.sortBy(newItem.items, function (i) {
      return i.count;
    }).reverse();
    return newItem;
  }


}
