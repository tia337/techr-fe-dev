import { TemplatesService } from './templates.service';
import { Component, OnInit } from '@angular/core';
import { MatTabsModule } from '@angular/material';

import { RootVCRService } from '../root_vcr.service';

import { FeedbackAlertComponent } from 'app/core/feedback-alert/feedback-alert.component';

@Component({
  selector: 'app-templates',
  templateUrl: './templates.component.html',
  styleUrls: ['./templates.component.scss']
})
export class TemplatesComponent implements OnInit {
  clientName;
  types = [];
  templates_standart = [];
  templates_custom = [];
  constructor(
    private _TemplatesService: TemplatesService,
    private _root_vcr: RootVCRService
  ) { }

  ngOnInit() {
    this._TemplatesService.getTemplateTypes().then(foundTypes => {
      this.types = foundTypes;
    }).then(() => {
      this._TemplatesService.getStandardTemplates().then(foundTemplates => {
        this.templates_standart = foundTemplates;
      });
      this._TemplatesService.getCustomTemplates().then(foundTemplates => {
        this.templates_custom = foundTemplates;
      });
    });

    this._TemplatesService.getCompanyName().then(foundClientName => {
      this.clientName = foundClientName;
    });
  }

  feedbackCreation() {
		this._root_vcr.createComponent(FeedbackAlertComponent);
	}
}
