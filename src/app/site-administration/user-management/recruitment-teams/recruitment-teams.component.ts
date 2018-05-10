import { EditRecruitmentTeamComponent } from './edit-recruitment-team/edit-recruitment-team.component';
import { NewRecruitmentTeamComponent } from './new-recruitment-team/new-recruitment-team.component';
import { Component, OnInit } from '@angular/core';
import { SiteAdministrationService } from './../../site-administration.service';
import { RootVCRService } from './../../../root_vcr.service';

@Component({
  selector: 'app-recruitment-teams',
  templateUrl: './recruitment-teams.component.html',
  styleUrls: ['./recruitment-teams.component.scss']
})
export class RecruitmentTeamsComponent implements OnInit {

 recruitmentTeams = [];

  constructor(
    private _siteAdministrationService: SiteAdministrationService,
    private _rootVCRService: RootVCRService) { }

  ngOnInit() {
    this.recruitmentTeams = this._siteAdministrationService.getRecruitmentTeams();
  }
  addNewRecruitmentTeam() {
    const recruitmentTeam = this._rootVCRService.createComponent(NewRecruitmentTeamComponent);
    recruitmentTeam.recruitmentTeams = this.recruitmentTeams;
  }

  editRecruitmentTeam(recruitmentTeam, recruitmentTeams) {
    const editRecruitmentTeam = this._rootVCRService.createComponent(EditRecruitmentTeamComponent);
    recruitmentTeam.editType = 'edit';
    editRecruitmentTeam.recruitmentTeams = recruitmentTeams;
    editRecruitmentTeam.recruitmentTeam = recruitmentTeam;
  }
  deleteRecruitmentTeam(recruitmentTeam, recruitmentTeams) {
    const editRecruitmentTeam = this._rootVCRService.createComponent(EditRecruitmentTeamComponent);
    recruitmentTeam.editType = 'delete';
    editRecruitmentTeam.recruitmentTeams = recruitmentTeams;
    editRecruitmentTeam.recruitmentTeam = recruitmentTeam;
  }
  
}
