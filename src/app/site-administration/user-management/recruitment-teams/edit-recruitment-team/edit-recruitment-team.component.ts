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

  set editType(editType) {
    this.recruitmentEditType = editType;
  }

  editRecruitmentTeam() {
    let newRecruitemtTeamLead;
    const newRecruitmentTeamMembers = [];


    this.teamMembersArray.forEach(teamMember => {
      if (teamMember.name === this.recruitmentTeamFormGroup.value.teamLead) {
        newRecruitemtTeamLead = {
          id: teamMember.id,
          name: teamMember.name
        };
      }
    });



    this.recruitmentTeamFormGroup.value.teamMembers.forEach(newTeamMember => {
      this.teamMembersArray.forEach(teamMember => {
        if (newTeamMember === teamMember.name) {
          newRecruitmentTeamMembers.push({
            id: teamMember.id,
            name: teamMember.name
          });
        }
      });
    });
    

    const newRecruitmentTeam = {
      name: this.recruitmentTeamFormGroup.value.teamName,
      description: this.recruitmentTeamFormGroup.value.teamDescription,
      teamLead: newRecruitemtTeamLead,
      teamMembers : newRecruitmentTeamMembers
    };
    
    this._siteAdministrationService.editRecruitmentTeam(this.currentRecruitmentTeam, newRecruitmentTeam);

    this.currentRecruitmentTeam.name = newRecruitmentTeam.name;
    this.currentRecruitmentTeam.description = newRecruitmentTeam.description;
    this.currentRecruitmentTeam.teamLead = newRecruitmentTeam.teamLead;
    this.currentRecruitmentTeam.teamMembers = newRecruitmentTeam.teamMembers;
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
