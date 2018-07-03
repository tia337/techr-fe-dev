import { Injectable } from '@angular/core';
import { Parse } from '../../parse.service';
import { SingleViewCandidateLeftBlock, SingleViewCandidateCenterBlock, SingleViewCandidateRightBlock } from 'types/types';

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
  
  getCandidateSingleViewRightBlock(userId, clientId): Promise<SingleViewCandidateRightBlock> {
    return new Promise ((resolve, reject) => {
      this._parse.execCloud('getCandidateSingleViewRightBlock', { userId: userId, clientId: clientId }).then((result: SingleViewCandidateRightBlock) => {
        resolve(result);
        reject(result);
      });
    });
  } 

  addTag(tagName: string, clientId: string, candidateId: string, authorId: string): Promise<any> {
    return new Promise ((resolve, reject) => {
      this._parse.execCloud('addCandidateTag', { tagName: tagName, clientId: clientId, candidateId: candidateId, authorId: authorId })
        .then(result => {
          resolve(result); 
          reject(result);
        });
    });
  }

  deleteTag(tagId: string): Promise<any> {
    return new Promise ((resolve, reject) => {
      this._parse.execCloud('deleteCandidateTag', { tagId: tagId }).then(result => {
          resolve(result); 
          reject(result);
        });
    });
  }

  getCandidateSkillsFromParse(candidateId: string): Promise<any> {
    return new Promise ((resolve, reject) => {
      this._parse.execCloud('getCandidateSkills', { candidateId: candidateId }).then(result => {
        resolve(result);
        reject(result);
      });
    });
  }

  removeSkill(skillId: string, candidateId: string): Promise<any> {
    return new Promise ((resolve, reject) => {
      this._parse.execCloud('removeCandidateSkill', { skillId: skillId, candidateId: candidateId }).then(result => {
        resolve(result);
        reject(result);
      });
    });
  }

  removeRole(roleId: string, candidateId: string): Promise<any> {
    return new Promise ((resolve, reject) => {
      this._parse.execCloud('removeCandidateRole', { roleId: roleId, candidateId: candidateId }).then(result => {
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
