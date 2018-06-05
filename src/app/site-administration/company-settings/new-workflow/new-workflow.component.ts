import { Component, OnInit } from '@angular/core';
import { RootVCRService } from '../../../root_vcr.service';
import { CompanySettingsService } from '../company-settings.service';
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
  }

  get projects () {
    return this.projectsArray;
  }

  closeModal() {
    this._root_vcr.clear();
  }

  addCustomWorkFlow () {
    const data = {
      name: this.currentClient,
      project: this.currentProject ? this.currentProject : undefined
    }
    this._companySettingService.throwClient(data);
    this._root_vcr.clear();
  }
}
