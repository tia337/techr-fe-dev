// Assets start
import { 
  Component, 
  ElementRef, 
  OnInit, 
  OnDestroy, 
  Renderer2, 
  ViewChild, 
  ViewChildren, 
  QueryList  
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import * as _ from 'underscore';
// Assets end

// Components start 
import { EditCandidateInfoComponent } from './edit-candidate-info/edit-candidate-info.component';
// Components end

// Services start
import { CandidateSingleViewService } from './candidate-single-view.service';
import { PostJobService } from '../../post-job-page/post-job.service';
import { RootVCRService } from '../../root_vcr.service';
import { Parse } from '../../parse.service';
// Services end

// Types start 
import { 
  SingleViewCandidateRightBlock, 
  SingleViewCandidateCenterBlock, 
  SingleViewCandidateLeftBlock, 
  MessageParse, 
  NotesParse, 
  ScorecardsParse 
} from 'types/types';
import { GmailComponent } from '../../gmail/gmail.component';
import { AlertComponent } from '../../shared/alert/alert.component';
// Types end


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
  private dialogId: string;
  private candidateEditedInfoSubscription: Subscription;

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
    private _root_vcr: RootVCRService
  ) { }

  ngOnInit(): void {
    this._router.params.distinct().subscribe((params: { id: string }) => {
      this.userId = params.id;
      this.getCandidateInfo(this.userId, this.clientId);
    });
    this.candidateEditedInfoSubscription = this._candidateSingleViewService.candidateEditedInfo.subscribe((editedInfo: SingleViewCandidateLeftBlock) => {
      this.leftBlockInfo = editedInfo;
      this._root_vcr.clear();
      this.saveEditedCandidateInfo(this.leftBlockInfo);
    });
  }

  getCandidateInfo(userId: string, clientId: string): void {
    this.getCandidateSingleViewLeftBlock(userId, clientId);
    this.getCandidateSingleViewCenterBlock(userId, clientId);
    this.getCandidateSingleViewRightBlock(userId, clientId);
    this.getCandidateSkillsFromParse(userId); 
    this.getSkillsRolesIndustries();
  }

  getCandidateSingleViewLeftBlock(userId: string, clientId: string): void {
    this._candidateSingleViewService.getCandidateSingleViewLeftBlock(userId, clientId).then((result: SingleViewCandidateLeftBlock) => {
      this.leftBlockInfo = result;
    }).catch(error => console.log(error));
  }

  getCandidateSingleViewCenterBlock(userId: string, clientId: string): void {
    this._candidateSingleViewService.getCandidateSingleViewCenterBlock(userId, clientId).then((result: SingleViewCandidateCenterBlock) => {
      for (let i = 0; i < result.length; i++) {
        if (result[i].count > 0) {
          this.centerBlockInfo = result;
          this.currentPipelineStage = this.centerBlockInfo[0];
          break;
        } else {
          this.centerBlockInfo = [];
        }
      }
    }).catch(error => console.log(error));
  }

  getCandidateSingleViewRightBlock(userId: string, clientId: string): void {
    this._candidateSingleViewService.getCandidateSingleViewRightBlock(userId, clientId).then(result => {
      this.rightBlockInfo = result.data;
      this.dialogId = result.dialogId;
    }).catch(error => console.log(error));
  }

  getCandidateSkillsFromParse(userId: string): void {
    this._candidateSingleViewService.getCandidateSkillsFromParse(userId).then(result => {
      result.items.forEach(item => {
        item['removeLoader'] = false;
      });
      result.roles.forEach(item => {
        item['removeLoader'] = false;
      });
      result.industries.forEach(item => {
        item['removeLoader'] = false;
      });
      this.rightBlockInfo.unshift(result);
      this.currentRightBlockTab = result;
      console.log(result);
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

  removeSkill(skillId: string, index: number, array: Array<any>, skill): void {
    skill.removeLoader = true;
    this._candidateSingleViewService.removeSkill(skillId, this.userId).then(result => {
      array.splice(index, 1);
    }).catch(error => console.log(error));
  }

  removeRole(roleId: string, index: number, array: Array<any>, role): void {
    role.removeLoader = true;
    this._candidateSingleViewService.removeRole(roleId, this.userId).then(result => {
      array.splice(index, 1);
    }).catch(error => console.log(error));
  }

  removeIndustry(industryId: string, index: number, array: Array<any>, industry): void {
    industry.removeLoader = true;
    this._candidateSingleViewService.removeIndustry(industryId, this.userId).then(result => {
      array.splice(index, 1);
    }).catch(error => console.log(error));
  }

  getSkillsRolesIndustries() {
    this._postJobService.getSkills().then(skills => {
      this.skills = skills;
      this.skills = _.sortBy(this.skills, function (skill) { return skill.get("title"); });
    });
    this._postJobService.getRoles().then(roles => {
      this.roles = roles;
      this.roles = _.sortBy(this.roles, function(roles){ return roles.get("title"); });
    });
    this._postJobService.getIndustries().then(industries => {
      this.industries = industries;
      this.industries = _.sortBy(this.industries, function (industries) { return industries.get("title"); });
    });
    this._postJobService.getCategories().then(categories => {
      this.categories = categories;
    });
  }

  sendCandidateMessage(event, value?): void {
    event.preventDefault();
    const message = event.target.value ? event.target.value : value;
    if (message === '' || message === null) return;
    const data = {
      authorFullname: this.currentUser.get('firstName') + ' ' + this.currentUser.get('lastName'),
      authorAvatarUrl: this.currentUser.get('avatarURL'),
      message: message,
      Type: 'P7x3pz5IrP',
      candidateId: this.userId,
      clientId: this._parse.getClientId(),
      authorId: this.currentUser.id,
      dialogId: this.dialogId
    };
    this._candidateSingleViewService.sendMessage(data).then(result => {
      this.dialogId = result.dialogId;
      this.rightBlockInfo.forEach(item => {
        if (item.title === 'Messages') {
          const message = {
            message: result.message.get('message'),
            authorAvatarURL: result.message.get('authorAvatarURL'),
            authorFullname: result.message.get('authorFullname'),
            _id: result.message.id,
            _created_at: result.message.get('createdAt')
          };
          item.items.unshift(message);
        }
      });
    }).catch(error => console.log(error));
    event.target.value = '';
    value = '';
  }

  createCandidateNote(event, value?): void {
    event.preventDefault();
    const message = event.target.value ? event.target.value : value;
    if (message === '' || message === null) return;
    const data = {
      candidateId: this.userId,
      candidateFullname: this.leftBlockInfo.user.firstName + ' ' + this.leftBlockInfo.user.lastName,
      authorFullname: this.currentUser.get('firstName') + ' ' + this.currentUser.get('lastName'),
      authorAvatarURL: this.currentUser.get('avatarURL'),
      authorId: this.currentUser.id,
      message: message,
      clientId: this.clientId
    };
    this._candidateSingleViewService.createCandidateNote(data).then(result => {
      this.rightBlockInfo.forEach(item => {
        if (item.title === 'Notes') {
          const note = {
            Message: result.get('Message'),
            authorAvatarURL: result.get('authorAvatarURL'),
            authorFullname: result.get('authorFullname'),
            _id: result.id,
            contractTitle: undefined
          };
          item.items.unshift(note);
        }
      });
    }).catch(error => console.log(error));
    event.target.value = '';
  }

  openCandidateEditInfoForm(): void {
    const editModal = this._root_vcr.createComponent(EditCandidateInfoComponent);
    editModal._candidate = this.leftBlockInfo;
  }

  saveEditedCandidateInfo(candidateInfo: SingleViewCandidateLeftBlock): void {
    this._candidateSingleViewService.saveEditedCandidateInfo(candidateInfo).then(result => {
      console.log(result);
    }).catch(error => console.log(error));
  }

  openEmailComponent(): void {
    const email = this._root_vcr.createComponent(GmailComponent);
		email.userId = this.leftBlockInfo.user._id;
		email.contractId = '';
		email.saveNote = true;
		email.saveChat = true;
		email.needTemplates = true;
		email.templateOptions = ['all'];
		email.emailBody = '';
		email.emailSubj = '';
    email.attachments = [];
    localStorage.setItem('candidateEmail', this.leftBlockInfo.user.email);
  }

  openDeleteCandidatePopup(): void {
    const candidateName = `${this.leftBlockInfo.user.firstName}  ${this.leftBlockInfo.user.lastName}`;
    const deleteModal = this._root_vcr.createComponent(AlertComponent);
    deleteModal.title = 'Delete this candidate?';
    deleteModal.content = 'Are you sure you want to delete this candidate?';
    deleteModal.type = 'sad';
    deleteModal.addButton({
      title: 'Delete Candidate',
      loader: true,
      type: 'warn',
      onClick: () => {
        this._parse
          .execCloud('deleteCandidateFromSingleView', { userId: this.leftBlockInfo.user._id, clientId: this.clientId })
          .then(result => this.openDeleteCandidatePopupSuccess(candidateName));
      }
    });
    deleteModal.addButton({
      title: 'Cancel',
      type: 'secondary',
      onClick: () => {
        this._root_vcr.clear();
      }
    });
  }

  openDeleteCandidatePopupSuccess(candidateName: string): void {
    this._root_vcr.clear();
    const deleteModal = this._root_vcr.createComponent(AlertComponent);
    deleteModal.title = 'Congrats!';
    deleteModal.content = 'Candidate ' + candidateName + ' was succesfully deleted.';
    deleteModal.type = 'congrats';
    setTimeout(() => this._root_vcr.clear(), 2000);
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
      this.active = false;
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

  selectSkill(skill, experience) {
    let skillComponent = this._postJobService.createSkillComponent(skill, experience);
    skillComponent['removeLoader'] = false;
    this.rightBlockInfo[0].items.push(skillComponent);
    this._candidateSingleViewService
      .addSkill(skillComponent.get('skill').id, skillComponent.get('selectedExperienceDuration'), skillComponent.get('skill').get('title'), this.userId)
      .then(result => {
        
    }).catch(error => console.log(error));
    const skillRows = this._elementRef.nativeElement.querySelectorAll('._' + skill.id);
    skillRows.forEach(element => {
      this._renderer.setStyle(element, 'display', 'none');
    });
    this.skills = _.without(this.skills, skill);
    this.query = '';
    this.filteredList = [];
  }

  selectRole(role, value?) {
    if (value) {
      value.preventDefault();
    }
    role['removeLoader'] = false;
    this.rightBlockInfo[0].roles.push(role);
    this._candidateSingleViewService.addRole(role.id, role.get('title'), this.userId).then(result => {
    }).catch(error => console.log(error));
    const roleRows = this._elementRef.nativeElement.querySelectorAll('._' + role.id);
    roleRows.forEach(element => {
      this._renderer.setStyle(element, 'display', 'none');
    });

    this.roles = _.without(this.roles, role);
    this.queryRoles = '';
    this.filteredRnIList = [];
  }

  selectIndustry(industry) {
    industry['removeLoader'] = false;
    this.rightBlockInfo[0].industries.push(industry);
    this._candidateSingleViewService.addIndustry(industry.id, industry.get('title'), this.userId).then(result => {
    }).catch(error => console.log(error));
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
    this.candidateEditedInfoSubscription.unsubscribe();
  }

}
