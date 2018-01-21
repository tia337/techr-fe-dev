import { Parse } from './../../parse.service';
import { Injectable } from '@angular/core';

@Injectable()
export class TemplateDetailsService {
  templateVariables = [
    'MyEmail',
    'MyCompanyName',
    'CandidateName',
    'JobTitle',
    'MyName',
	'MyPosition',
	'ERPURL',
  'ERPPWD',
  'ERPJobpage'
  ];
  constructor(private _parse: Parse) { }

  getTemplate(templateId: string) {
    const query = this._parse.Query('TemplatesStandard');
    query.include('Type');
    return query.get(templateId);
  }
  getCustomTemplate(templateId: string) {
    const query = this._parse.Query('TemplatesCustomized');
    query.include('Type');
    return query.get(templateId);
  }
}
