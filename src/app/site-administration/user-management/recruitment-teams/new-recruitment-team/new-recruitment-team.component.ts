import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SiteAdministrationService } from './../../../site-administration.service';
import { RootVCRService } from './../../../../root_vcr.service';

@Component({
  selector: 'app-new-recruitment-team',
  templateUrl: './new-recruitment-team.component.html',
  styleUrls: ['./new-recruitment-team.component.scss']
})
export class NewRecruitmentTeamComponent implements OnInit {

  teamMembers = [];
  recruitmentTeamsArr = [];
  recruitmentTeamFormGroup: FormGroup;

  constructor(
    private _siteAdministrationService: SiteAdministrationService,
    private _rootVCRService: RootVCRService) { }

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
    })  
  }

  set recruitmentTeams(recruitmentTeams) {
    this.recruitmentTeamsArr = recruitmentTeams;
  }

  addNewTeam() {
    const newTeam = {
      id: this.recruitmentTeamFormGroup.value.teamName + '_' + Math.floor(Math.random() * 100).toString(),
      name: this.recruitmentTeamFormGroup.value.teamName,
      description: this.recruitmentTeamFormGroup.value.teamDescription,
      teamLead: this.recruitmentTeamFormGroup.value.teamLead,
      teamMembers: this.recruitmentTeamFormGroup.value.teamMembers
    }
    console.log(newTeam);
    this.recruitmentTeamsArr.push(newTeam);
    this._siteAdministrationService.addNewRecruitmentTeam(newTeam);
    this.closeModal();
  }

  closeModal() {
    this._rootVCRService.clear();
  }

}
