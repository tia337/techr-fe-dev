import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { AlertComponent } from '../shared/alert/alert.component';
import { SiteAdministrationService } from './site-administration.service';

import { RootVCRService } from '../root_vcr.service';

import * as parse from 'parse';
import { Parse } from '../parse.service';


@Component({
	selector: 'app-site-administration',
	templateUrl: './site-administration.component.html',
	styleUrls: ['./site-administration.component.scss']
})
export class SiteAdministrationComponent implements OnInit, OnDestroy {

	constructor(private _router: Router, private _SiteAdministrationService: SiteAdministrationService, private _root_vcr:RootVCRService, private router:Router, private _parse: Parse) { }

	// accessLevel: number;

	ngOnInit() {}

	ngOnDestroy() {

	}
	// accessCheck(){
	// 	this._SiteAdministrationService.getAccessLevel().then(alevel=>{
	// 		this.accessLevel = alevel;
	// 		return this._SiteAdministrationService.getAdmins();
	// 	}).then(admins=>{
	// 		if(this.accessLevel == 1 ){
	// 			this.router.navigate(['/', 'administration', 'billing']);
	// 		}else if(this.accessLevel > 1){
	// 			const alert = this._root_vcr.createComponent(AlertComponent);
	// 			alert.title = 'Access level Required';
	// 			alert.icon = 'lock';
	// 			alert.type = "sad";
	// 			alert.contentAlign = 'left';
	// 			alert.content = `<a style = "white-space:nowrap">Hi, ` + this._parse.Parse.User.current().get('firstName') + `. You need to be site admin in order to see your billing information.</a><br><a style = "white-space:nowrap"><strong>` +
	// 				admins + `</strong> can set you up as a site admin if needed.</a>` +
	// 				`<a style = "white-space:nowrap"><strong>Contact SwipeIn </strong> if you need urgent access to Billing and you can't reach your Billing information.</a>`;
	//
	// 			// alert.content = `
	//
	// 			// `;
	// 			alert.addButton({
	// 				title: 'Close',
	// 				type: 'primary',
	// 				onClick: () => this._root_vcr.clear()
	// 			});
	// 		}
	// 	});
	// }

}
