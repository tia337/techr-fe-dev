import { Component, OnInit } from '@angular/core';
import * as parse from 'parse';
import { Parse } from '../../parse.service';
import { BillingService } from './billing.service'
import { AlertComponent } from '../../shared/alert/alert.component';
import { RootVCRService } from '../../root_vcr.service';
import { Router } from '@angular/router';

import { FeedbackAlertComponent } from 'app/core/feedback-alert/feedback-alert.component';
import { ContactUsComponent } from "app/contact-us/contact-us.component";

@Component({
	selector: 'app-billing',
	templateUrl: './billing.component.html',
	styleUrls: ['./billing.component.scss']
})
export class BillingComponent implements OnInit {

	admins: any[];
	adminsList: string;
	accessLevel: any;

	constructor(
		private _parse: Parse,
		private BillingService: BillingService,
		private _root_vcr: RootVCRService,
		private _router: Router,
	) {
		_router.navigate(['/', 'administration', 'billing', { outlets: { 'billing-sections': ['overview'] }}], {skipLocationChange: true});
	}

	ngOnInit() {
		this.getAdmins();
		// this.BillingService.test();
		this.accessLevel = this.BillingService.getAccessLevel();
	}

	getAdmins() {
		this._parse.Parse.User.current().get("Client_Pointer").fetch().then(client=>{
			console.log(client);
			this.admins = [];
			this._parse.Parse.Object.fetchAllIfNeeded(client.get("TeamMembers")).then(teamMembers=>{
				console.log(teamMembers);
				for(let teamMember of teamMembers){
					console.log(teamMember.get("HR_Access_Level"));
					if(teamMember.get("HR_Access_Level") === 1){
						this.admins.push(teamMember);
					}
					console.log(this.admins);
					if( this.admins.length > 1){
						this.adminsList = this.admins[0].get('firstName') + ' ' + this.admins[0].get('lastName') + ' or ' + this.admins[1].get('firstName') + ' ' + this.admins[1].get('lastName');
					}else{
						this.adminsList = this.admins[0].get('firstName') + ' ' + this.admins[0].get('lastName');
					}
				}
			});
		});
	}

	accessCheck(){
		console.log(this.admins);
		console.log(this.accessLevel);
		if (this.accessLevel > 1) {
			const alert = this._root_vcr.createComponent(AlertComponent);
			alert.title = 'Access level Required';
			alert.icon = 'lock';
			alert.type = "sad";
			alert.contentAlign = 'left';
			alert.content = `<a style = "white-space:nowrap">Hi, ` + this._parse.Parse.User.current().get('firstName') + `. You need to be site admin in order to integrate your company's profile with apps.</a><br><a style = "white-space:nowrap"><strong>` +
				this.adminsList + `</strong> can set you up as a site admin if needed.</a>` +
				`<a style = "white-space:nowrap">Contact SwipeIn if you need urgent access to App Integrations.</a><br><a style = "white-space:nowrap">And if you can't integrate your company's profile with apps.</a>`;

			// alert.content = `

			// `;
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
				onClick: () => this._root_vcr.clear()
			});
			
			// const alert = this._root_vcr.createComponent(AlertComponent);

			// alert.title = 'Access level Required';
			// alert.icon = '';
			// alert.addLine('Hi, ' + this._parse.Parse.User.current().get('firstName') + '. You need to be site admin in order to integrate your company`s profile with apps.');
			// alert.addLine( this.adminsList + ' can set you up as a site admin if needed.');
			// alert.addLine( 'Contact SwipeIn if you need urgent access to App Integrations and you can`t integrate your company`s profile with apps.');
			// alert.addButton({
			//   title: 'Close',
			//   type: 'secondary',
			//   onClick: () => this._root_vcr.clear()
			// });
		}
	}

	feedbackCreation() {
		this._root_vcr.createComponent(FeedbackAlertComponent);
	}

}
