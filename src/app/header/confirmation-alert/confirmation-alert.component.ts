import { Component, OnInit, Renderer2, ElementRef, AfterViewInit } from '@angular/core';
import { ConfirmationAlertService } from './confirmation-alert.service';
import { RootVCRService } from '../../root_vcr.service';
import { User } from 'types/types';
import { HttpErrorResponse } from '@angular/common/http';
import { Login } from 'app/login.service';

@Component({
	selector: 'app-confirmation-alert',
	templateUrl: './confirmation-alert.component.html',
	styleUrls: ['./confirmation-alert.component.scss']
})
export class ConfirmationAlertComponent implements OnInit {

	workEmail: string;
	emailErrorMessage: string;
	companyNameErrorMessage: string;
	// company: any;

	companyName: string;

	loaderActive = false;
	currentUser: User;

	// private positions = [];

	constructor(
		private _renderer: Renderer2,
		private _elRef: ElementRef,
		private readonly confirmationAlertService: ConfirmationAlertService,
		private readonly rootVcrService: RootVCRService,
		private readonly loginService: Login
	) { }

	ngOnInit() {
		// console.log('ConfirmationAlertComponent init');
		// this._renderer.appendChild(document.body, this._elRef.nativeElement);
		// this.positions = this._confAlertService.getPositions();
		// if (this.positions && this.positions.length > 0) {
		// 	this.company = this.positions[0].company;
		// }
		this.loginService.profile.subscribe((user: User) => this.currentUser = user);
	}

	// ngAfterViewInit() {
		// console.log('ConfirmationAlertComponent init');
		// this._renderer.appendChild(document.body, this._elRef.nativeElement);
		// this.positions = this._confAlertService.getPositions();
		// if (this.positions && this.positions.length > 0) {
		// 	this.company = this.positions[0].company;
		// }
	// }

	validateEmail(): boolean {
		if(!this.workEmail || this.workEmail.length == 0) {
			this.emailErrorMessage = 'Please, enter your work email';
			return false;
		}
		else if(!/[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*/g.test(this.workEmail)) {
			this.emailErrorMessage = 'Invalid email address!';
			return false;
		}
		else if(!/[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@(?!gmail|hotmail)[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*/g.test(this.workEmail)) {
			this.emailErrorMessage = 'You should enter a company email address';
			return false;
		}
		this.emailErrorMessage = '';
		return true;
	}

	validateCompanyName() {
		if (!this.companyName || this.companyName.length === 0) {
			this.companyNameErrorMessage = 'Please, enter your company name!';
			return false;
		}
		return true;
	}

	initData() {
		this.loaderActive = true;
		const emailValid: boolean = this.validateCompanyName();
		const nameValid: boolean = this.validateEmail();

		if (emailValid === true && nameValid === true) {
			// this._confAlertService.initClient(this.workEmail, this.companyName).then(res => {
			// 	console.log(res);
			// 	this._root_vcr.clear();
			// 	this.loaderActive = false;
			// }, error => {
			// 	console.error(error);
			// 	this.loaderActive = false;
			// });

			this.confirmationAlertService
				.initClient(this.workEmail, this.companyName, this.currentUser)
				.subscribe(
					(user: User) => {
						this.rootVcrService.clear();
						this.loaderActive = false;

						localStorage.setItem('currentUser', JSON.stringify(user));

						this.loginService.profile.next(user);
					},
					(error: HttpErrorResponse) => {
						this.loaderActive = false;
					}
				);
		} else {
			this.loaderActive = false;
		}
	}

	// clearCompanyNameError() {
	// 	console.log('clearCompanyNameError');
	// 	setTimeout(() => {
	// 		this.companyNameErrorMessage = '';
	// 	}, 0);
	// }
	//
	// clearEmailError() {
	// 	console.log('clearEmailError');
	// 	setTimeout(() => {
	// 		this.emailErrorMessage = '';
	// 	}, 0);
	// }

}
