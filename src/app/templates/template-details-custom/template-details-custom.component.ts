import { AlertComponent } from './../../shared/alert/alert.component';
import { TemplatesService } from './../templates.service';
import { MentionModule } from 'angular2-mentions/mention';
import { TemplateDetailsService } from '../template-details/template-details.service';
import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RootVCRService } from 'app/root_vcr.service';

@Component({
  selector: 'app-template-details-custom',
  templateUrl: './template-details-custom.component.html',
  styleUrls: ['./template-details-custom.component.scss']
})
export class TemplateDetailsCustomComponent implements OnInit {

  @ViewChild('tBody') tBody: ElementRef;

  templateId: string = this._route.snapshot.params['id'];
  template;
  isEditable = false;
  mentions = this._TemplateDetailsService.templateVariables;
  bodyText: string;

  constructor(
    private _route: ActivatedRoute,
    private _TemplateDetailsService: TemplateDetailsService,
	  private _TemplatesService: TemplatesService,
    private _rootVCR: RootVCRService,
    private _changeDetector: ChangeDetectorRef	
  ) { }

  ngOnInit() {
    this._TemplateDetailsService.getCustomTemplate(this.templateId).then(templateObj => {
      this.template = templateObj;
			this.bodyText = this.template.get('EmailBody');
			this._changeDetector.detectChanges();
			this.tBody.nativeElement;
			this.tBody.nativeElement.style.overflow = 'hidden';
			this.tBody.nativeElement.style.height = '0px';
			setTimeout(() => { 
				this.tBody.nativeElement.style.height = this.tBody.nativeElement.scrollHeight + 'px';
			}, 0);
		});
  }

  editTemplate() {
    this.isEditable = !this.isEditable;
  }

  preventDefault(event){
    event.stopPropagation();
  }

  updateTemplate(title, subject, body) {
    this.template.title = title.value;
    this.template.subject = subject.value;
    this.template.body = body.nativeElement.value;
    if ((this.template.title.trim() !== this.template.get('Title').trim()) ||
      (this.template.subject.trim() !== this.template.get('EmailSubject').trim()) ||
      (this.template.body.trim() !== this.template.get('EmailBody').trim())) {
      this._TemplatesService.updateCustomTemplate(this.template).then(res => {
        // console.log(res);
      });
    }
	this.isEditable = !this.isEditable;
	const alert = this._rootVCR.createComponent(AlertComponent);
	alert.content = `Template successfully saved!`;
	alert.addButton({
		type: 'primary',
		title: 'Ok',
		onClick: () => {
			this._rootVCR.clear();
		}
	});
  }
}
