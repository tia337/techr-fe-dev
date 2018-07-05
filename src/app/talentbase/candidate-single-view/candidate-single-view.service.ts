import { Injectable } from '@angular/core';
import { Parse } from '../../parse.service';
import { SingleViewCandidateLeftBlock, SingleViewCandidateCenterBlock, SingleViewCandidateRightBlock } from 'types/types';
import { Subject, BehaviorSubject } from 'rxjs';

@Injectable()
export class CandidateSingleViewService {

  public candidateEditedInfo: Subject<SingleViewCandidateLeftBlock> = new Subject();

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
  
  getCandidateSingleViewRightBlock(userId, clientId): Promise<any> {
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

  removeIndustry(industryId: string, candidateId: string): Promise<any> {
    return new Promise ((resolve, reject) => {
      this._parse.execCloud('removeCandidateIndustry', { industryId: industryId, candidateId: candidateId }).then(result => {
        resolve(result);
        reject(result);
      });
    });
  }

  addSkill(skillId: any, selectedExperienceDuration: number, skillName: string, candidateId: string): Promise<any> {
    return new Promise ((resolve, reject) => {
      this._parse
        .execCloud('addCandidateSkill', { 
          skillId: skillId, 
          selectedExperienceDuration: selectedExperienceDuration, 
          skillName: skillName, 
          candidateId: candidateId 
        })
        .then(result => {
        resolve(result);
        reject(result);
      });
    });
  }

  addRole(roleId: string, title: string, candidateId: string): Promise<any> {
    return new Promise ((resolve, reject) => {
      this._parse.execCloud('addCandidateRole', { roleId: roleId, title: title, candidateId: candidateId }).then(result => {
        resolve(result);
        reject(result);
      });
    });
  }

  addIndustry(industryId: string, title: string, candidateId: string): Promise<any> {
    return new Promise ((resolve, reject) => {
      this._parse.execCloud('addCandidateIndustry', { industryId: industryId, title: title, candidateId: candidateId }).then(result => {
        resolve(result);
        reject(result);
      });
    });
  }

  sendMessage(data: any): Promise<any> {
    return new Promise ((resolve, reject) => {
      this._parse.execCloud('sendCandidateMessage', { data }).then(result => {
        resolve(result);
        reject(result);
      });
    });
  }

  createCandidateNote(data: any): Promise <any> {
    return new Promise ((resolve, reject) => {
      this._parse.execCloud('createCandidateNote', { data }).then(result => {
        resolve(result);
        reject(result);
      })
    });
  }

  throwEditedCandidate(candidate: SingleViewCandidateLeftBlock): void {
    this.candidateEditedInfo.next(candidate);
  }

  saveEditedCandidateInfo(candidate: SingleViewCandidateLeftBlock): Promise<SingleViewCandidateLeftBlock> {
    const data = {
      firstName: candidate.user.firstName,
      lastName: candidate.user.lastName,
      email: candidate.user.email,
      location: candidate.user.location,
      Phone: candidate.user.Phone,
      phone2: candidate.user.phone2,
      WebSites: candidate.user.WebSites
    };
    return new Promise ((resolve, reject) => {
      this._parse.execCloud('saveEditedCandidateInfoFromSingleView', { candidateId: candidate.user._id, data: data }).then(result => {
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
