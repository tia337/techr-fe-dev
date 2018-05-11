import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SiteAdministrationService } from './../../../site-administration.service';
import { RootVCRService } from 'app/root_vcr.service';

@Component({
  selector: 'app-edit-recruitment-team',
  templateUrl: './edit-recruitment-team.component.html',
  styleUrls: ['./edit-recruitment-team.component.scss']
})
export class EditRecruitmentTeamComponent implements OnInit {

  teamMembersArray = [];
  recruitmentTeamFormGroup: FormGroup;
  currentRecruitmentTeams = [];
  recruitmentTeamMembers = [];
  currentRecruitmentTeam;

  recruitmentEditType;

  constructor(
    private _siteAdministrationService: SiteAdministrationService,
    private _rootVCRService: RootVCRService) { }

  ngOnInit() {
    this._siteAdministrationService.getTeamMembers()
      .then(teamMembers => {
        this.teamMembersArray = teamMembers;
      });

    this.currentRecruitmentTeam.teamMembers.forEach((teamMember) => {
      this.recruitmentTeamMembers.push(teamMember.name);
    });

    this.recruitmentEditType = this.currentRecruitmentTeam.editType;

    this.recruitmentTeamFormGroup = new FormGroup({
      'teamName': new FormControl(this.currentRecruitmentTeam.name, Validators.required),
      'teamDescription' : new FormControl(this.currentRecruitmentTeam.description, Validators.required),
      'teamLead': new FormControl(this.currentRecruitmentTeam.teamLead.name, Validators.required),
      'teamMembers': new FormControl(this.recruitmentTeamMembers, Validators.required)
    });
  }

  set recruitmentTeams(recruitmentTeams) {
    this.currentRecruitmentTeams = recruitmentTeams;
  }

  set recruitmentTeam(recruitmentTeam) {
    this.currentRecruitmentTeam = recruitmentTeam;
  }

  editRecruitmentTeam() {
    this.currentRecruitmentTeam.name = this.recruitmentTeamFormGroup.value.teamName;
    this.currentRecruitmentTeam.description = this.recruitmentTeamFormGroup.value.teamDescription;
    this.currentRecruitmentTeam.teamLead = this.recruitmentTeamFormGroup.value.teamLead;
    this.currentRecruitmentTeam.teamMembers = this.recruitmentTeamFormGroup.value.teamMembers;
    this._siteAdministrationService.editRecruitmentTeam(this.currentRecruitmentTeam);
    this.closeModal();
  }
 
  deleteRecruitmentTeam() {
    const currentTeamIndex = this.currentRecruitmentTeams.indexOf(this.currentRecruitmentTeam);
    this.currentRecruitmentTeams.splice(currentTeamIndex, 1);
    this._siteAdministrationService.deleteRecruitmentTeam(this.currentRecruitmentTeam);
    this.closeModal();
  }

  closeModal() {
    this._rootVCRService.clear();
  }
}
