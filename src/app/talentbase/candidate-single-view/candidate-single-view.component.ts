import { Component, ElementRef, OnInit, OnDestroy, Renderer2, ViewChild, ViewChildren, QueryList  } from '@angular/core';
import { Parse } from '../../parse.service';
import { ActivatedRoute } from '@angular/router';
import { CandidateSingleViewService } from './candidate-single-view.service';
import { PostJobService } from '../../post-job-page/post-job.service';
import { 
  SingleViewCandidateRightBlock, 
  SingleViewCandidateCenterBlock, 
  SingleViewCandidateLeftBlock, 
  MessageParse, 
  NotesParse, 
  ScorecardsParse 
} from 'types/types';
import * as _ from 'underscore';

@Component({
  selector: 'app-candidate-single-view',
  templateUrl: './candidate-single-view.component.html',
  styleUrls: ['./candidate-single-view.component.scss']
})
export class CandidateSingleViewComponent implements OnInit, OnDestroy {

  public leftBlockInfo: SingleViewCandidateLeftBlock;
  public centerBlockInfo: SingleViewCandidateCenterBlock = [];
  public rightBlockInfo: SingleViewCandidateRightBlock = [];
  public currentUser = this._parse.getCurrentUser();
  public currentPipelineStage;
  public currentRightBlockTab: { title: string, items: Array<MessageParse> | Array<NotesParse> | Array<ScorecardsParse> };
  public userId: string;
  public clientId: string = this._parse.getClientId();

  // VARIABLES FOR SKILLS, ROLES AND INDUSTRIES DROPDOWNS START

  public query = '';
	public selectionCounter: number = 0;
	public expPosition: number = 1;
	public editable: boolean = false;
	public active: boolean = false;
	public dropdownVisible: boolean = false;
	public dropdownRolesVisible: boolean = false;
	public dropdownIndustriesVisible: boolean = false;  
	public filteredList: Array<any> = [];
	public selectedRoles: Array<any> = [];
	public activeForRoles: boolean = false;
	public queryRoles: string = '';
	public selectedIndustries: Array<any> = [];
	public activeForIndustries: boolean = false;
	public queryIndustries: string = '';
	public filteredRnIList: Array<any> = [];
  public selectionRnICounter: number = 0;
	public categories;
  public industries = [];
	public skills = [];
  public roles = [];
  public selected = [];
  
  @ViewChild('scrollpanel', { read: ElementRef }) public panel: ElementRef;
	@ViewChildren('categoryTitles') categoryTitles: QueryList<ElementRef>;
	@ViewChild('categoriesDropdown') categoriesDropdown: ElementRef;

  // VARIABLES FOR SKILLS, ROLES AND INDUSTRIES DROPDOWNS END

  constructor(
    private _parse: Parse,
		private _renderer: Renderer2,
    private _router: ActivatedRoute,
		private _elementRef: ElementRef,
    private _candidateSingleViewService: CandidateSingleViewService,
		private _postJobService: PostJobService,
  ) { }

  ngOnInit(): void {
    this._router.params.distinct().subscribe((params: { id: string }) => {
      this.userId = params.id;
      this.getCandidateInfo(this.userId, this.clientId);
    });
  }

  getCandidateInfo(userId: string, clientId: string): void {
    this.getCandidateSingleViewLeftBlock(userId, clientId);
    this.getCandidateSingleViewCenterBlock(userId, clientId);
    this.getCandidateSingleViewRightBlock(userId, clientId);
    this.getCandidateSkillsFromParse(userId); 
    this.getSkillRolesIndustries();
  }

  getCandidateSingleViewLeftBlock(userId: string, clientId: string): void {
    this._candidateSingleViewService.getCandidateSingleViewLeftBlock(userId, clientId).then((result: SingleViewCandidateLeftBlock) => {
      this.leftBlockInfo = result;
    }).catch(error => console.log(error));
  }

  getCandidateSingleViewCenterBlock(userId: string, clientId: string): void {
    this._candidateSingleViewService.getCandidateSingleViewCenterBlock(userId, clientId).then((result: SingleViewCandidateCenterBlock) => {
      this.centerBlockInfo = result;
      this.currentPipelineStage = this.centerBlockInfo[0];
    }).catch(error => console.log(error));
  }

  getCandidateSingleViewRightBlock(userId: string, clientId: string): void {
    this._candidateSingleViewService.getCandidateSingleViewRightBlock(userId, clientId).then((result: SingleViewCandidateRightBlock) => {
      this.rightBlockInfo = result;
      this.currentRightBlockTab = result[0];
    }).catch(error => console.log(error));
  }

  getCandidateSkillsFromParse(userId: string): void {
    this._candidateSingleViewService.getCandidateSkillsFromParse(userId).then(result => {
      this.rightBlockInfo.unshift(result);
    }).catch(error => console.log(error));
  }

  setCurrentPipelineStage(stage): void {
    this.currentPipelineStage = stage;
  }

  addTag(tagName: string): void {
    if (tagName === '' || tagName === null) return;

    this._candidateSingleViewService.addTag(tagName, this.clientId, this.userId, this.currentUser.id).then(result => {
      this.leftBlockInfo.tags.push({tagName: tagName, _id: result.id});
    }).catch(error => console.log(error));
  }

  deleteTag(tagId: string, index: number): void {
    this._candidateSingleViewService.deleteTag(tagId).then(result => {
      this.leftBlockInfo.tags.splice(index, 1);
    }).catch(error => console.log(error));
  }

  removeSkill(skillId: string, index: number, array: Array<any>): void {
    this._candidateSingleViewService.removeSkill(skillId, this.userId).then(result => {
      array.splice(index, 1);
    }).catch(error => console.log(error));
  }

  removeRole(roleId: string, index: number, array: Array<any>): void {
    this._candidateSingleViewService.removeRole(roleId, this.userId).then(result => {
      array.splice(index, 1);
    }).catch(error => console.log(error));
  }

  getSkillRolesIndustries() {
    this._postJobService.getSkills().then(skills => {
      this.skills = skills;
      this.skills = _.sortBy(this.skills, function (skill) { return skill.get("title"); });
    });
    this._postJobService.getCategories().then(categories => {
      this.categories = categories;
    });
    this._postJobService.getIndustries().then(industries => {
      this.industries = industries;
      this.industries = _.sortBy(this.industries, function (industries) { return industries.get("title"); });
    });
  }

  // METHODS FOR SKILLS, ROLES AND INDUSTRIES DROPDOWNS START

  prevDef(value, suggestions) {
    if (value.code == 'ArrowDown') {
      if(value.preventDefault){
        value.preventDefault();
      }else{
        event.returnValue = false;
      }
      if (this.selectionCounter < (this.filteredList.length - 1)) {
        this.selectionCounter += 1;
        this.expPosition = 1;
        this.panel.nativeElement.scrollTop += 36.36;
      }
    }
    if (value.code == 'ArrowUp') {
      if(value.preventDefault){
        value.preventDefault();
      }else{
        event.returnValue = false;
      }
      if (this.selectionCounter > 0) {
        this.selectionCounter -= 1;
        this.expPosition = 1;
        this.panel.nativeElement.scrollTop -= 35;
      }
    }
    if (value.code == 'Enter') {
      if(value.preventDefault){
        value.preventDefault();
      }else{
        event.returnValue = false;
      }
    }
    if (value.code != 'Click') {
      this.active = true;
      this.dropdownVisible = false;
      this.dropdownRolesVisible = false;
    }
    if (value.code == 'ArrowRight') {
      if(value.preventDefault){
        value.preventDefault();
      }else{
        event.returnValue = false;
      }
    }
    if (value.code == 'ArrowLeft') {
      if(value.preventDefault){
        value.preventDefault();
      }else{
        event.returnValue = false;
      }
    }
}

keyPressing(value: any) {
  console.log("keyPressing", value);
    if (value.code == 'Enter') {
      if (this.selectionCounter >= 0 && this.filteredList.length > 0) {
        this.selectSkill(this.filteredList[this.selectionCounter], this.expPosition);
      }
    }

    if (value.code == 'ArrowRight') {
      if (this.expPosition > 0 && this.expPosition < 3) {
        this.expPosition += 1;
      }
    }

    if (value.code == 'ArrowLeft') {
      if (this.expPosition > 1 && this.expPosition <= 3) {
        this.expPosition -= 1;
      }
    } else if (value.code != 'ArrowDown' && value.code != 'ArrowUp' && value.code != 'Enter' && value.code != 'ArrowRight' && value.code != 'Click') {
      setTimeout(() => {
        this.filter();
      }, 750);
    }
}

keyRnIPressing(value: any, name: string) {
  if (value.code === 'Enter') {
    if (name === 'role') {
      if (this.selectionRnICounter >= 0 && this.filteredRnIList.length > 0) {
        this.selectRole(this.filteredRnIList[this.selectionRnICounter]);
      }
    } else if (name === 'industry') {
      if (this.selectionRnICounter >= 0 && this.filteredRnIList.length > 0) {
        this.selectIndustry(this.filteredRnIList[this.selectionRnICounter]);
      }
    }
  } else if (value.code != 'ArrowDown' && value.code != 'ArrowUp' && value.code != 'Enter' && value.code != 'ArrowRight' && value.code != 'Click') {
    if (name === 'role') {
      this.filterRnI(this.queryRoles, this.roles);
    } else if (name === 'industry') {
      this.filterRnI(this.queryIndustries, this.industries);
    }
  }
}

activeSet() {
  this.active = true;
}

activeUnSet() {
  setTimeout(() => {
    // this.active = false;
  }, 400);
}

activeRolesUnSet() {
  setTimeout(() => {
    this.activeForRoles = false;
  }, 400);
}

activeIndustriesUnSet() {
  setTimeout(() => {
    this.activeForIndustries = false;
  }, 400);
}

selectRole(role, value?) {
  if (value) {
    value.preventDefault();
  }
  this.selectedRoles.push(role);
  const roleRows = this._elementRef.nativeElement.querySelectorAll('._' + role.id);
  roleRows.forEach(element => {
    this._renderer.setStyle(element, 'display', 'none');
  });

  this.roles = _.without(this.roles, role);
  this.queryRoles = '';
  this.filteredRnIList = [];
}

selectIndustry(industry) {
  this.selectedIndustries.push(industry);
  const industriesRows = this._elementRef.nativeElement.querySelectorAll('._' + industry.id);
  industriesRows.forEach(element => {
    this._renderer.setStyle(element, 'display', 'none');
  });
  this.industries = _.without(this.industries, industry);
  this.queryIndustries = '';
  this.filteredRnIList = [];
}

filterRnI(query, items) {
  if (query.length == 1) {
    let char = '\\b' + query.toUpperCase();
    let exp = new RegExp(char, 'g');
    this.filteredRnIList = items.filter(el => {
      if (el.get('title') && el.get('title').toUpperCase().match(exp)) {
        return el.get('title');
      }
    }).slice(0, 50);
  } else if (query !== '') {
    this.filteredRnIList = items.filter(el => {
      if (el.get('title')) {
        return el.get('title').toLowerCase().indexOf(query.toLowerCase()) > -1;
      } else {
        return;
      }
    }).slice(0, 50);
    this.selectionRnICounter = 0;
  } else {
    this.filteredRnIList = [];
  }
}

filter() {
  if (this.query.length == 1) {
    let char = '\\b' + this.query.toUpperCase();
    let exp = new RegExp(char, 'g');
    this.filteredList = this.skills.filter(el => {
      if (el.get('title')) { }
      if (el.get('title') && el.get('title').toUpperCase().match(exp)) {
        return el.get('title');
      }
    }).slice(0, 400);
  } else if (this.query !== '') {
    this.filteredList = this.skills.filter(el => {
      if (el.get('title')) {
        return el.get('title').toLowerCase().indexOf(this.query.toLowerCase()) > -1;
      } else {
        return;
      }
    }).slice(0, 400);
    this.selectionCounter = 0;
  } else {
    this.filteredList = [];
  }
}

activeDropdown(name: string, loc, value?) {}

selectSkill(skill, experience) {
  const skillComponent = this._postJobService.createSkillComponent(skill, experience);
  this.selected.push(skillComponent);
  const skillRows = this._elementRef.nativeElement.querySelectorAll('._' + skill.id);
  skillRows.forEach(element => {
    this._renderer.setStyle(element, 'display', 'none');
  });
  this.skills = _.without(this.skills, skill);
  this.query = '';
  this.filteredList = [];
}

getCategorySkills(index) {
  const skillsWrap = this.categoryTitles.toArray()[index].nativeElement;

  if (!skillsWrap.classList.contains('loaded')) {
    const categorySkills = _.filter(this.skills, skill => {
      if (skill.get('categories')) {
        return skill.get('categories').includes(this.categories[index].id);
      } else {
        return;
      }
    });

    categorySkills.forEach(skill => {
      const skillElement = this._renderer.createElement('div');
      const skillTitle = this._renderer.createElement('div');

      const experienceWrap = this._renderer.createElement('div');
      const experienceButtonOne = this._renderer.createElement('div');
      const experienceButtonTwo = this._renderer.createElement('div');
      const experienceButtonThree = this._renderer.createElement('div');

      skillTitle.innerHTML = skill.get('title');

      this._renderer.addClass(skillElement, '_' + skill.id);
      this._renderer.addClass(skillElement, 'skill-row');
      skillElement.addEventListener('click', event => {
        if (event.target.classList.contains("experience-button")) {

        } else {
          this.selectSkill(skill, 1);
        }
      });
      this._renderer.addClass(experienceWrap, 'experience-wrap');

      this._renderer.addClass(skillTitle, 'skill-title');
      this._renderer.addClass(experienceButtonOne, 'experience-button');
      this._renderer.addClass(experienceButtonOne, 'any-button');
      this._renderer.addClass(experienceButtonTwo, 'experience-button');


      this._renderer.addClass(experienceButtonTwo, 'three-button');

      this._renderer.addClass(experienceButtonThree, 'experience-button');

      this._renderer.addClass(experienceButtonThree, 'four-button');

      experienceButtonOne.innerHTML = 'Any';

      experienceButtonOne.addEventListener('click', event => {
        event.preventDefault();
        this.selectSkill(skill, 1);
      });
      experienceButtonTwo.innerHTML = '3+';

      experienceButtonTwo.addEventListener('click', event => {
        event.preventDefault();
        this.selectSkill(skill, 2);
      });
      experienceButtonThree.innerHTML = '5+';

      experienceButtonThree.addEventListener('click', event => {
        event.preventDefault();
        this.selectSkill(skill, 3);
      });

      this._renderer.appendChild(skillElement, skillTitle);
      this._renderer.appendChild(skillElement, experienceWrap);

      this._renderer.appendChild(experienceWrap, experienceButtonOne);
      this._renderer.appendChild(experienceWrap, experienceButtonTwo);

      this._renderer.appendChild(experienceWrap, experienceButtonThree);
      this._renderer.appendChild(skillsWrap, skillElement);
    });
    this.closeAll();
    this._renderer.addClass(skillsWrap, 'opened');
    this._renderer.addClass(skillsWrap, 'loaded');
  } else {
    if (skillsWrap.classList.contains('opened')) {
      this._renderer.removeClass(skillsWrap, 'opened');
    } else {
      this.closeAll();
      this._renderer.addClass(skillsWrap, 'opened');
    }
  }
}

selectJob(job, jobsSelected) {
  if (jobsSelected.indexOf(job) >= 0) {
    return;
  } else {
    jobsSelected.push(job);
  }
}

closeAll() {
  const skillsWrap = this.categoryTitles.toArray();
  skillsWrap.forEach(category => {
    this._renderer.removeClass(category.nativeElement, 'opened');
  });
}

prevDefRnI(value, name: string, suggestions) {
  if (value.code == 'Enter') {
    value.preventDefault();
  }
  if (value.code == 'ArrowRight') {
    value.preventDefault();
  }
  if (value.code == 'ArrowLeft') {
    value.preventDefault();
  }
  if (value.code == 'ArrowUp') {
    value.preventDefault();
    if (this.selectionRnICounter > 0) {
      this.selectionRnICounter -= 1;
    }
  }
  if (value.code == 'ArrowDown') {
    value.preventDefault();
    if (this.selectionRnICounter < (this.filteredRnIList.length - 1)) {
      this.selectionRnICounter += 1;
    }
  }
  if (value.code != 'Click') {
    if (name === 'industry') {
      this.activeForIndustries = true;
    } else if (name === 'role') {
      this.activeForRoles = true;
    }
    this.dropdownVisible = false;
    this.dropdownRolesVisible = false;
    this.dropdownIndustriesVisible = false;
  }
}

prevDfSelecting(value) {
  value.preventDefault();
}

  // METHODS FOR SKILLS, ROLES AND INDUSTRIES DROPDOWNS END

  ngOnDestroy(): void {

  }

}
