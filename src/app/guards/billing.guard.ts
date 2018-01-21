import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Parse } from '../parse.service';
import { AccessLevel } from '../shared/utils';
import { AlertComponent } from '../shared/alert/alert.component';
import { RootVCRService } from '../root_vcr.service';

@Injectable()
export class BillingGuard implements CanActivate {

	constructor(private _parse: Parse, private _root_vcr: RootVCRService) { }

	canActivate(): boolean {
		if (this._parse.Parse.User.current().get('HR_Access_Level') !== AccessLevel.contributor) {
			return true;
		} else {
			const alert = this._root_vcr.createComponent(AlertComponent);
			alert.type = 'sad';
			alert.title = 'Access level required';
			alert.content = `Sorry, you don't have the right access level.<br/>Only site admins and admins can enter the billing section.`;
			alert.contentAlign = 'left';
			alert.addButton({
				title: 'OK',
				type: 'primary',
				onClick: () => {
					this._root_vcr.clear();
				}
			});
			return false;
		}
	}

	canActivateChild(): boolean {
		return this.canActivate();
	}
}
