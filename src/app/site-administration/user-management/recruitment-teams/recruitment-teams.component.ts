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
    this._siteAdministrationService.getRecruitmentTeams().then(data => {
      this.recruitmentTeams = data;
    });
  }
  addNewRecruitmentTeam() {
    const recruitmentTeam = this._rootVCRService.createComponent(NewRecruitmentTeamComponent);
    recruitmentTeam.recruitmentTeams = this.recruitmentTeams;
  }

  editRecruitmentTeam(recruitmentTeam, recruitmentTeams) {
    const editRecruitmentTeam = this._rootVCRService.createComponent(EditRecruitmentTeamComponent);
    
    editRecruitmentTeam.recruitmentTeams = recruitmentTeams;
    editRecruitmentTeam.recruitmentTeam = recruitmentTeam;
    editRecruitmentTeam.editType = 'edit';
  }
  deleteRecruitmentTeam(recruitmentTeam, recruitmentTeams) {
    const editRecruitmentTeam = this._rootVCRService.createComponent(EditRecruitmentTeamComponent);
    editRecruitmentTeam.recruitmentTeams = recruitmentTeams;
    editRecruitmentTeam.recruitmentTeam = recruitmentTeam;
    editRecruitmentTeam.editType = 'delete';
  }
  
}
