import { TemplatesService } from './../templates.service';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.scss']
})
export class TemplateComponent implements OnInit {

  @Input('template') private template;
  @Input('templateC') private templateC;
  isCustom = true;
  emailInfo = {
    emailAuthor: '',
    creationDate: '',
    modificationDate: '',
    modificator: ''
  };
  isDeleted = false;

  constructor(
    private _TemplatesService: TemplatesService
  ) { }

  ngOnInit() {
    if (this.template) {
      if (this.template.className === 'TemplatesStandard') {
        this.isCustom = false;
      }
      this.isDeleted = false;
    } else if (this.templateC) {
      if (this.templateC.get('Author')) {
        this.emailInfo.emailAuthor = `${this.templateC.get('Author').get('firstName')}
        ${this.templateC.get('Author').get('lastName')}`;
      }
      this.emailInfo['creationDate'] = new Date(new Date(this.templateC.createdAt).getTime()).toDateString() + ' ' +
        new Date(new Date(this.templateC.createdAt).getTime()).toLocaleTimeString();
      this._TemplatesService.getLastModifier(this.templateC).then(lastMod => {
        this.emailInfo['modificationDate'] = new Date(new Date(lastMod.date).getTime()).toDateString() + ' ' +
          new Date(new Date(lastMod.date).getTime()).toLocaleTimeString();
        this.emailInfo['modificator'] = lastMod.author;
      });
      this.isDeleted = this.templateC.get('isDeleted');
    }
  }

  deleteTemlate(templateCId, el) {
    this._TemplatesService.removeTemplate(templateCId).then(res => {
      this.isDeleted = true;
      console.log(res);
    });
  }
}
