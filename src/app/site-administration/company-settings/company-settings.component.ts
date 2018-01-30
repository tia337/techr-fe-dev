import { Component, OnInit, Renderer } from '@angular/core';
import { CompanySettingsService } from './company-settings.service';
import { DomSanitizer } from '@angular/platform-browser';
import { RootVCRService } from '../../root_vcr.service';

import { ParseObject, ParsePromise } from 'parse';
import * as parse from 'parse';
import { Parse } from '../../parse.service';

import { AlertComponent } from '../../shared/alert/alert.component';
import { ChangePasswordComponent } from 'app/site-administration/company-settings/change-password/change-password.component';
import { ViewChild } from '@angular/core';
import { ElementRef, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { MatExpansionModule } from '@angular/material/expansion';

import { FeedbackAlertComponent } from 'app/core/feedback-alert/feedback-alert.component';
import { ContactUsComponent } from "app/contact-us/contact-us.component";

@Component({
	selector: 'app-company-settings',
	templateUrl: './company-settings.component.html',
	styleUrls: ['./company-settings.component.scss']
})
export class CompanySettingsComponent implements OnInit {

	isInCompany = true;
	curLogo: any;
	logo: any;
	companyDescription: string;
	companyDescriptionDef: string;
	companyBenefits: string;
	companyBenefitsDef: string;
	company: ParseObject;
	website: string;
	websiteDef: string;
	careers: string;
	careersDef: string;
	picUrl: any;
	picUrlDef: any;
	filename = '';
	disabled = false;
	accessLevel: number;
	admins: any[] = [];
	isSafe: boolean;
	isSafeDef: boolean;


	erpBaseLink;

	erpPageStyle = 0;
	erpPageStyleDef = 0;
	erpPageGreeting = '';
	erpPageGreetingDef = '';

	step = 0;

	constructor(
		private _parse: Parse,
		private _CompanySettingsService: CompanySettingsService,
		private sanitizer: DomSanitizer,
		private _root_vcr: RootVCRService,
		private _router: Router,
		private renderer: Renderer
	) {
		this.erpBaseLink = _CompanySettingsService.erpBaseLink;
	}
	saveErpPageStyle(val: number) {
		this._CompanySettingsService.setErpPageStyle(val);
		this.erpPageStyle = val;
	}

	ngOnInit() {
		this._CompanySettingsService.getAccessLevel().then(res => {
			this.accessLevel = res;
			if (res > 1) {
				this.disabled = true;
			}
			return this._CompanySettingsService.getAdmins();
		}).then(admins=>{
			this.admins = admins;
		});
		if (!this._CompanySettingsService.getCompany()) {
			this.isInCompany = false;
		} else {
			this.getCurLogo();
			this._CompanySettingsService.getCompany().then(result => {
				this.company = result;
				this.isSafe = result.get('passwordSecured');
				this.isSafeDef = result.get('passwordSecured');
				this.erpPageStyle = result.get('erpPageStyle');
				this.erpPageStyleDef = result.get('erpPageStyle');
				this.erpPageGreeting = result.get('erpPageGreeting') ? result.get('erpPageGreeting') : '';
				this.erpPageGreetingDef = result.get('erpPageGreeting') ? result.get('erpPageGreeting') : '';
				this.website = this.company.get('ClientWebsite');
				this.websiteDef = this.company.get('ClientWebsite');
				this.careers = this.company.get('ClientCareersPage');
				this.careersDef = this.company.get('ClientCareersPage');
				this.companyBenefits = this.company.get('Company_Benefits');
				this.companyBenefitsDef = this.company.get('Company_Benefits');
				this.companyDescription = this.company.get('Company_Description');
				this.companyDescriptionDef = this.company.get('Company_Description');
			});

			this.companyDescription = '';
			this.companyBenefits = '';

		}
	}

	saveSettings() {
	}

	setChanges() {
		if (this.website != this.websiteDef || this.careers != this.careersDef || this.picUrlDef != this.picUrl ||
			this.companyBenefits != this.companyBenefitsDef || this.companyDescription != this.companyDescriptionDef ||
			this.isSafeDef != this.isSafe || this.erpPageStyleDef != this.erpPageStyle || this.erpPageGreetingDef != this.erpPageGreeting) {
			this._CompanySettingsService.setNewSettings(this.website, this.careers, this.logo, this.companyDescription, this.companyBenefits, this.erpPageGreeting).then(res => {
				this.websiteDef = this.website;
				this.careersDef = this.careers;
				this.picUrlDef = this.picUrl;
				this.companyBenefitsDef = this.companyBenefits;
				this.companyDescriptionDef = this.companyDescription;
				this.isSafeDef = this.isSafe;
				this.erpPageStyleDef = this.erpPageStyle;
				this.erpPageGreetingDef = this.erpPageGreeting;
				const alert = this._root_vcr.createComponent(AlertComponent);
				alert.title = 'Saved';
				alert.icon = 'thumbs-o-up';
				alert.type = 'simple';
				alert.contentAlign = 'left';
				alert.content = `<a style = "white-space:nowrap">Changes successfully saved.</a>`;
				alert.addButton({
					title: 'Ok',
					type: 'primary',
					onClick: () => this._root_vcr.clear()
				});
				this._CompanySettingsService.logoUpdate.emit();
			});
		}

	}
	getNewLogo(event): any {
		if (event.files && event.files[0]) {
			const binaryData = [];
			binaryData.push(event.files[0]);
			this.logo = event.files[0];
			this.picUrl = window.URL.createObjectURL(new Blob(binaryData, { type: event.files[0].type }));
			this.cutLogoName(this.logo.name);
		}
	}
	getCurLogo() {
		if (this._CompanySettingsService.getLogo()) {
			this.curLogo = this._CompanySettingsService.getLogo();
			this.cutLogoName(this.curLogo._name);
			this.picUrl = this.curLogo._url;
			this.picUrlDef = this.curLogo._url;
		}
	}
	cutLogoName(logoName: string) {
		if (logoName.length > 30) {
			this.filename = '...' + logoName.slice((logoName.length - 30), logoName.length);
		} else {
			this.filename = logoName;
		}
	}
	sanitize(url: string) {
		return this.sanitizer.bypassSecurityTrustUrl(url);
	}
	accessCheck() {
		if (this.accessLevel == 1) {
		} else if (this.accessLevel > 1) {
			const alert = this._root_vcr.createComponent(AlertComponent);
			alert.title = 'Access level Required';
			alert.icon = 'lock';
			alert.type = 'sad';
			alert.contentAlign = 'left';
			alert.content = `<a style = "white-space:nowrap">Hi, ` + this._parse.Parse.User.current().get('firstName') + `. You need to be site admin in order to modify your company settings.</a><br><a style = "white-space:nowrap"><strong>` +
				this.admins + `</strong> can set you up as a site admin if needed.</a>` +
				`<a style = "white-space:nowrap">Contact SwipeIn if you need urgent access to Company Settings and you can't reach your Site administrators.</a>`;
			alert.addButton({
				title: 'Contact SwipeIn',
				type: 'secondary',
				onClick: () => {
					this._root_vcr.clear();
					let contactForm = this._root_vcr.createComponent(ContactUsComponent);
					contactForm.contactType = "K9A4lQwYNs";
				}
			});
			alert.addButton({
				title: 'Close',
				type: 'primary',
				onClick: () => { this._root_vcr.clear(); }
			});
		}
	}
	savePasswordState() {
		this._CompanySettingsService.setPasswordState(!this.isSafe);
	}
	changePassword() {
		if(!this.disabled){
			const change = this._root_vcr.createComponent(ChangePasswordComponent);
			change.clientId = this.company;
		}
	}

	feedbackCreation() {
		this._root_vcr.createComponent(FeedbackAlertComponent);
	}
	triggerInput(el) {
		const event = new MouseEvent('click', { bubbles: true });
		this.renderer.invokeElementMethod(el, 'dispatchEvent', [event]);
	}
	removeLogo() {
		if (this.curLogo && this._parse.getCurrentUser().get('Client_Pointer').has('ClientLogo') && this.accessLevel === 1 ) {
			this._parse.getCurrentUser().get('Client_Pointer').unset('ClientLogo');
			this._parse.getCurrentUser().get('Client_Pointer').save();
			this.picUrl = '';
			this.filename = '';
		}
	}
	setStep(index: number) {
		this.step = index;
	  }
}
