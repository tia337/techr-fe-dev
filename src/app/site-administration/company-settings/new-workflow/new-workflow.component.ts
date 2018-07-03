import { Component, OnInit } from '@angular/core';
import { RootVCRService } from '../../../root_vcr.service';
import { CompanySettingsService } from '../company-settings.service';
import { ClientsArray, ProjectsArray } from 'types/types';
//tslint:disable:indent
@Component({
  selector: 'app-new-workflow',
  templateUrl: './new-workflow.component.html',
  styleUrls: ['./new-workflow.component.scss']
})
export class NewWorkflowComponent implements OnInit {

  clientsArray: ClientsArray;
  projectsArray: ProjectsArray;
  currentArray: Array<any>;
  currentClientsArray: Array<any>;
  currentClient = null;
  currentName = null;
  currentProject = null;
  currentRole = null;
  userRoles;
  workflowName = '';

  constructor(
    private _root_vcr: RootVCRService,
    private _companySettingService: CompanySettingsService
  ) { }

  ngOnInit() {
  }

  set clients (clients: ClientsArray) {
    this.clientsArray = clients;
  }

  get clients () {
    return this.clientsArray;
  }

  set projects (projects: ProjectsArray) {
    this.projectsArray = projects;
    console.log(this.projectsArray);
  }

  get projects () {
    return this.projectsArray;
  }

  set roles (value) {
    this.userRoles = value;
  }

  get roles () {
    return this.userRoles
  }

  closeModal() {
    this._root_vcr.clear();
  }

  setWorkFlowName(event) {
    this.workflowName = event.target.value;
  }


  addCustomWorkFlow () {

    // const workflowName = request.params.workflowName;
    // const clientName = request.params.name ? request.params.name : undefined;
    // const projectName = request.params.project ? request.params.project : undefined;
    // const userRoleName = request.params.userRole ? request.params.userRole : undefined;
    // const hiringStages = request.params.stages;
    // const objectId = request.params.id ? request.params.id : undefined;
    // const workFlowTypeName = request.params.workFlowTypeName;

    const workflowName: HTMLInputElement = document.getElementById('workflowName') as HTMLInputElement;

    if (this.currentClient !== null) {
      const data = {
        clientName: this.currentClient.get('clientOfClientName'),
        workflowName: workflowName.value,
        workFlowTypeName: 'Client'
      };
      this._companySettingService.throwClient(data);
    };
    if (this.currentProject !== null) {
      const data = {
        clientName: this.currentProject.get('projectEndClientName'),
        projectName: this.currentProject.get('projectName'),
        workflowName: workflowName.value,
        workFlowTypeName: 'Project'
      };
      this._companySettingService.throwClient(data);
    };
    if (this.currentRole !== null) {
      const data = {
        userRoleName: this.currentRole.get('title'),
        workflowName: workflowName.value,
        workFlowTypeName: 'Role'
      };
      this._companySettingService.throwClient(data);
    };
    this._root_vcr.clear();
  }

}
