import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { AlertComponent } from '../../shared/alert/alert.component';
import { AdministrationMenuService } from './administration-menu.service';

import { Router } from '@angular/router';

import { RootVCRService } from '../../root_vcr.service';

import { ParseObject, ParsePromise } from 'parse';
import * as parse from 'parse';
import { Parse } from '../../parse.service';

import { ContactUsComponent } from "app/contact-us/contact-us.component";

@Component({
	selector: 'app-administration-menu',
	templateUrl: './administration-menu.component.html',
	styleUrls: ['./administration-menu.component.scss']
})
export class AdministrationMenuComponent implements OnInit {

	public containerRef: ViewContainerRef;
	private accessLevel: number;
	private _closeAnim = false;

	constructor(
		private _parse: Parse,
		private _root_vcr: RootVCRService,
		private _administrationMenuService: AdministrationMenuService,
		private router: Router
	) { }

	ngOnInit() {

	}

	close() {
		this._closeAnim = true;
		setTimeout(() => {
			this.containerRef.clear();
			this._closeAnim = false;
		}, 450);
	}
	closeForLinks(){
		setTimeout(() => {
			this.close();
		}, 400);
	}
	accessCheck(event){
		event.stopPropagation();
		console.log("access Check");
		this._administrationMenuService.getAccessLevel().then(alevel=>{
			this.accessLevel = alevel;
			return this._administrationMenuService.getAdmins();
		}).then(admins=>{
			console.log(this.accessLevel);
			if(this.accessLevel == 1 ){
				console.log("1 access level");
				this.router.navigate(['/', 'administration', 'billing']);
			}else if(this.accessLevel > 1){
				console.log("alert");
				const alert = this._root_vcr.createComponent(AlertComponent);
				alert.title = 'Access level Required';
				alert.icon = 'lock';
				alert.type = "sad";
				alert.contentAlign = 'left';
				alert.content = `<a style = "white-space:nowrap">Hi, ` + this._parse.Parse.User.current().get('firstName') + `. You need to be site admin in order to see your billing information.</a><br><a style = "white-space:nowrap"><strong>` +
					admins + `</strong> can set you up as a site admin if needed.</a>` +
					`<a style = "white-space:nowrap">Contact SwipeIn if you need urgent access to Billing and you can't reach your Billing information.</a>`;

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
				
			}
		});
	}

	get closeAnim() {
		return this._closeAnim;
	}

}
