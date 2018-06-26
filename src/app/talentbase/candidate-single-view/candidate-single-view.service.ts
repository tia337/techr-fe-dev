import { Injectable } from '@angular/core';
import { Parse } from '../../parse.service';

@Injectable()
export class CandidateSingleViewService {

  constructor(
    private _parse: Parse
  ) { }

  getCandidateSingleViewLeftBlock(userId, clientId): Promise<SingleViewCandidateLeftBlock> {
    return new Promise ((resolve, reject) => {
      this._parse.execCloud('getCandidateSingleViewLeftBlock', { userId: userId, clientId: clientId }).then((result: SingleViewCandidateLeftBlock) => {
        resolve(result);
        reject(result);
      });
    });
  } 

  getCandidateSingleViewCenterBlock(userId, clientId): Promise<SingleViewCandidateCenterBlock> {
    return new Promise ((resolve, reject) => {
      this._parse.execCloud('getCandidateSingleViewCenterBlock', { userId: userId, clientId: clientId }).then((result: SingleViewCandidateCenterBlock) => {
        resolve(result);
        reject(result);
      });
    });
  } 
  
  getCandidateSingleViewRightBlock(userId, clientId) {
    return new Promise ((resolve, reject) => {
      this._parse.execCloud('getCandidateSingleViewRightBlock', { userId: userId, clientId: clientId }).then(result => {
        resolve(result);
        reject(result);
      });
    });
  } 
  

  getContractsById(contractIds) {
    return new Promise ((resolve, reject) => {
      this._parse.execCloud('getContractsById', { contractIds: contractIds }).then(result => {
        resolve(result);
        reject(result);
      });
    });
  }
  

}
