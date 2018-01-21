import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Login } from '../login.service';

@Injectable()
export class LoginGuard implements CanActivate {

	constructor(private _login: Login, private _router: Router) { }

	canActivate(): Observable<boolean> | Promise<boolean> | boolean {
		if (this._login.profile.value) {
			return true;
		} else {
			this._router.navigate(['/login']);
			return false;
		}
	}

	canActivateChild(): Observable<boolean> | Promise<boolean> | boolean {
		return this.canActivate();
	}
}
