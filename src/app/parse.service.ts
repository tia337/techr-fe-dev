import {
	Injectable,
	// ViewContainerRef,
	// ComponentFactoryResolver,
	// ReflectiveInjector,
	Output,
	EventEmitter
} from '@angular/core';
import * as parse from 'parse';
import { Router } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import * as md5 from 'crypto-js/md5';
import { environment } from './../environments/environment';

import { IUser } from '../../imports/interfaces';

@Injectable()
export class Parse {

	private _Parse: any;

	// public vcr: ViewContainerRef;

	ErpCompanyPageLink = environment.REFERRAL_URL;

	public confirmEmail = new EventEmitter();

	constructor(private _router: Router) {
		this._Parse = parse;
		this._Parse.initialize(environment.APP_ID);
		this._Parse.serverURL = environment.SERVER_URL;
		

	}

	get Parse() {
		return this._Parse;
	}

	// signIn(user: IUser): any {
	//   const userQuery = new this._Parse.Query(this._Parse.User);
	//   userQuery.equalTo('username', user.username);
	//   return userQuery.first().then( existingUser => {
	//     if (!existingUser) {
	//       const newUser = new this._Parse.User();
	//       newUser.add(user);
	//
	//       const Partner = this._Parse.Object.extend('Partner');
	//       const partner = new Partner();
	//       partner.set('isActivated', true);
	//       newUser.set('partner', partner);
	//
	//       console.log('user not exists');
	//       return newUser.signUp(null);
	//     } else {
	//       console.log('user exists');
	//
	//       return this._Parse.User.logIn(user.username, this.getPassword(user.username));
	//     }
	//   });
	// }
	//
	// private getPassword(username: string) {
	//   return md5(username).toString().toUpperCase();
	// }

	logOut() {
		return this._Parse.User.logOut();
	}

	Object(objName: string): any {
		return new this._Parse.Object(objName);
	}

	staticObject() {
		return this._Parse.Object;
	}

	GeoPoint(latitude: number, longitude: number) {
		return new this._Parse.GeoPoint(latitude, longitude);
	}


	getCurrentUser(): any {
		return this._Parse.User.current();
	}

	toJSON() {
		return this._Parse.Object.toJSON();
	}

	getPartner(user: any) {
		if (user) {
			return user.get('partner').fetch();
		}
	}

	execCloud(funcName: string, params: Object) {
		return this._Parse.Cloud.run(funcName, params);
	}

	File(name: string, data: any): any {
		return new this._Parse.File(name, data);
	}

	findAll(className: string, limit?: number): any {
		const query = new this._Parse.Query(className);
		if (limit) {
			query.limit(limit);
		}
		return query.find();
	}

	Query(className: string): any {
		return new this._Parse.Query(className);
	}

	Session() {
		return this._Parse.Session.current();
	}
	//  							NEW FUNCTION (C)AF
	createNewUser(): any {
		return new this._Parse.User();
	}

	// Helper to create pointer by id
	createPointer(objectClass, objectID) {
		const Foo = this._Parse.Object.extend(objectClass);
		const pointerToFoo = new Foo();
		pointerToFoo.id = objectID;
		return pointerToFoo;
	}

	getClientId () {
		return this.getCurrentUser().get('Client_Pointer').id;
	}

}
