import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SiteAdministrationService } from './../../../site-administration.service';
import { RootVCRService } from './../../../../root_vcr.service';
import { Parse } from '../../../../parse.service';

@Component({
  selector: 'app-new-recruitment-team',
  templateUrl: './new-recruitment-team.component.html',
  styleUrls: ['./new-recruitment-team.component.scss']
})
export class NewRecruitmentTeamComponent implements OnInit {

  teamMembers = [];
  recruitmentTeamsArr = [];
  recruitmentTeamMembers = [];
  recruitmentTeamFormGroup: FormGroup;

  constructor(
    private _siteAdministrationService: SiteAdministrationService,
    private _rootVCRService: RootVCRService,
    private _parse: Parse
  ) { }

  ngOnInit() {
    this._siteAdministrationService.getTeamMembers()
      .then(data => {
        this.teamMembers = data;
      });
    this.recruitmentTeamFormGroup = new FormGroup({
      'teamName': new FormControl('', Validators.required),
      'teamDescription' : new FormControl('', Validators.required),
      'teamLead': new FormControl('', Validators.required),
      'teamMembers': new FormControl('', Validators.required)
    });  
  }

  set recruitmentTeams(recruitmentTeams) {
    this.recruitmentTeamsArr = recruitmentTeams;
  }

  addNewTeam() {
    this.recruitmentTeamFormGroup.value.teamMembers.forEach((teamMember => {
      this.recruitmentTeamMembers.push({
        id: teamMember.id,
        name: teamMember.name
      });
    }));
    
    const newTeam = {
      id: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
      name: this.recruitmentTeamFormGroup.value.teamName,
      description: this.recruitmentTeamFormGroup.value.teamDescription,
      teamLead: {
        id: this.recruitmentTeamFormGroup.value.teamLead.id,
        name: this.recruitmentTeamFormGroup.value.teamLead.name
      },
      teamMembers: this.recruitmentTeamMembers,
      editType: 'none'
    };

    this.recruitmentTeamsArr.push(newTeam);
    this._siteAdministrationService.addNewRecruitmentTeam(newTeam);
    this.closeModal();
  }

  closeModal() {
    this._rootVCRService.clear();
  }

}
