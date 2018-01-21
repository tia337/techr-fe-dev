import { Injectable } from '@angular/core';
import { Parse } from '../../parse.service';
import { ParseObject } from 'parse';

@Injectable()
export class TestSkillsService {

  constructor(private _parse: Parse) { }

  getIndustries(){
    const industriesQuery = new this._parse.Parse.Query('Industry');
    return industriesQuery.find().then( industries => {
      return industries;
    });
  }

  getRoles(){
    const rolesQuery = new this._parse.Parse.Query('UserRole');
    return rolesQuery.find().then( roles => {
      return roles;
    });
  }

  getSkills() {
    const limit = 1000;
    const skip = 0;

    return this.querySkills([], skip, limit);
  }

  private querySkills(result, skip, limit) {
    const skillsQuery = new this._parse.Parse.Query('ProgrammingSkill');
    skillsQuery.limit(limit);
    skillsQuery.skip(skip);
    return skillsQuery.find().then( skills => {
      result = result.concat(skills);
      if (skills.length !== limit) {
        return result;
      } else {
        skip += limit;
        return this.querySkills(result, skip, limit);
      }
    });
  }

  getCategories() {
    const skillCategoriesQuery = new this._parse.Parse.Query('SkillCategory');
    return skillCategoriesQuery.find();
  }

  createSkillComponent(skill: ParseObject, experience: number) {
    const skillComponent = new this._parse.Parse.Object('SkillComponent');
    skillComponent.set('skill', skill);
    skillComponent.set('selectedExperienceDuration', experience);
    return skillComponent;
  }

  createRoleComponent(role: ParseObject) {
    const roleComponent = new this._parse.Parse.Object('UserRole');
    roleComponent.set('role', role);
    return roleComponent;
  }

  createIndustryComponent(industry: ParseObject) {
    const industryComponent = new this._parse.Parse.Object('Industry');
    industryComponent.set('industry', industry);
    return industryComponent;
  }
}
