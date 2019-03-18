import { Component, OnInit, ViewContainerRef, OnDestroy } from '@angular/core';
import { Login } from '../login.service';
import { Parse } from '../parse.service';
import { CartAdding } from './cartadding.service';
import { Router } from '@angular/router';
import { ConfirmationAlertComponent } from './confirmation-alert/confirmation-alert.component';
import { RootVCRService } from '../root_vcr.service';
import { HeaderService } from './header.service';
import { CompanySettingsService } from 'app/site-administration/company-settings/company-settings.service';
import { AlertComponent } from '../shared/alert/alert.component';
import { Socket } from 'ng-socket-io';
import { PostJobService } from 'app/post-job-page/post-job.service';

import { ContactUsComponent } from 'app/contact-us/contact-us.component';
import { Observable } from 'rxjs/Observable';
import * as _ from 'underscore';
import { User } from 'types/types';



@Component({
	selector: 'header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {

	theme: 'old' | 'new' = 'old';
	cartAmount: number;
	CartTotal: number;
	currency: string;
	currentUser: User;
	animationActive: boolean;
	private _currentUserSubscription;
	loadLogoSubsc;
	loadLogoSubscPJ;
	loadLogo;

	public containerRef: ViewContainerRef;
	private accessLevel: number;
	private _closeAnim = false;
	private _clientLogo: string;

	private _menuOpened = false;
	private _userMenuOpened = false;
	private _closeUserAnim = false;
	public _notificationsOpened: boolean = false;
	public notificationsCount = 0;

	constructor(
		private readonly router: Router,
		private readonly rootVcrService: RootVCRService,
		private readonly cartAddingService: CartAdding,
		private readonly loginService: Login,
		private readonly parseService: Parse,
		private readonly headerService: HeaderService,
		private readonly companySettingsService: CompanySettingsService,
		private readonly socket: Socket,
		private readonly postJobService: PostJobService
	) {
		this.cartAddingService.CartCount.subscribe(CartCount => {
			this.cartAmount = CartCount;
		});
		this.cartAddingService.CartTotal.subscribe(CartTotal => {
			this.CartTotal = CartTotal;
		});
		this.cartAddingService.Currency.subscribe(currency => {
			this.currency = currency;
		});
		this.cartAddingService.animationActive.subscribe(animation => {
			this.animationActive = animation;
		});
	}

	ngOnInit() {
		this.changeTheme();

		// this.listenToIncrementUnreadNotificationsCounter().subscribe(data => {
		// 	console.log(data);
		// 	this.notificationsCount++;
		// });

		// if (this._parse.getCurrentUser()) {
		// 	this._parse.execCloud('getUnreadNotificationsCount', { userId: this._parse.getCurrentUser().id }).then(result => {
		// 		const data = JSON.parse(result);
		// 		this.notificationsCount = data;
		// 	});
		// }

		// this._headerService.currentNotificationsCount.subscribe(data => {
		// 	this.notificationsCount = parseFloat(data);
		// });

		// this.loadLogoSubsc = this._companySettingsService.logoUpdate.subscribe(() => {
		// 	this.getLogo();
		// });

		// this.loadLogoSubscPJ = this._postJobService.logoUpdate.subscribe(() => {
		// 	this.getLogo();
		// });

		// if (this._parse.getCurrentUser()) {
		// 	this.getLogo();
		// }

		this._currentUserSubscription = this._login.profile.subscribe(profile => {
			if (profile) {
				// profile1.fetch().then(profile => {
				this.currentUser = profile;
				// if (!profile.toJSON().Client_Pointer) {
				// 	this._root_vcr.clear();
				// 	this._root_vcr.createComponent(ConfirmationAlertComponent);
				// }
				// });
			}
		});

	}

	closeAdminMenu(event?) {
		if (event) {
			if (event.clientY < 55) {
				this._closeAnim = true;
				setTimeout(() => {
					if (this._closeAnim === true) {
						this._menuOpened = false;
						this._closeAnim = false;
					}
				}, 450);
			}
		} else {
			this._closeAnim = true;
			setTimeout(() => {
				if (this.closeAnim === true) {
					this._menuOpened = false;
					this._closeAnim = false;
				}
			}, 450);
		}
	}

	closeUserMenu(event?): void {
		if (event) {
			if (event.clientY < 55) {
				this._closeUserAnim = true;
				setTimeout(() => {
					if (this._closeUserAnim === true) {
						this._userMenuOpened = false;
						this._closeUserAnim = false;
					}
				}, 450);
			}
		} else {
			this._closeUserAnim = true;
			setTimeout(() => {
				if (this.closeUserAnim === true) {
					this._userMenuOpened = false;
					this._closeUserAnim = false;
				}
			}, 450);
		}
	}

	getLogo() {
		this.headerService.getClientLogo().then(logo => {
			this._clientLogo = logo;
		});
	}

	signInWithLinkedin(): void {
		this.loginService.getAuthUrl('linkedin');
	}

	signInWithMicrosoft(): void {
		this.loginService.getAuthUrl('microsoft');
	}

	signOut(): void {
		this.loginService.signOut();
		this.currentUser = null;
		this.socket.emit('disconnect', {});
		this.socket.disconnect();
		localStorage.clear();
	}

	openAdminMenu() {
		this._closeAnim = false;
		this._menuOpened = true;
	}

	openUserMenu() {
		this._closeUserAnim = false;
		this._userMenuOpened = true;
	}

	redirect() {
		this.router.navigate(['checkout']);
	}

	ngOnDestroy() {
		this._currentUserSubscription.unsubscribe();
	}

	test() {
		this.rootVcrService.createComponent(ConfirmationAlertComponent);
	}

	accessCheck(event) {
		event.stopPropagation();
		this.headerService.getAccessLevel().then(alevel => {
			this.accessLevel = alevel;
			return this.headerService.getAdmins();
		}).then(admins => {
			if (this.accessLevel === 1) {
				this.router.navigate(['/', 'administration', 'billing']);
			} else if (this.accessLevel > 1) {
				const alert = this.rootVcrService.createComponent(AlertComponent);
				alert.title = 'Access level Required';
				alert.icon = 'lock';
				alert.type = 'sad';
				alert.contentAlign = 'left';
				alert.content = `<a style = 'white-space:nowrap'>Hi, ` + this.parseService.Parse.User.current().get('firstName') +
					`. You need to be site admin in order to see your billing information.</a><br><a style = 'white-space:nowrap'><strong>` +
					admins + `</strong> can set you up as a site admin if needed.</a>` +
					`<a style = 'white-space:nowrap'>Contact SwipeIn if you need urgent access to Billing and you can't reach your Billing information.</a>`;
				alert.addButton({
					title: 'Contact SwipeIn',
					type: 'secondary',
					onClick: () => {
						this.rootVcrService.clear();
						let contactForm = this.rootVcrService.createComponent(ContactUsComponent);
						contactForm.contactType = 'K9A4lQwYNs';
					}
				});
				alert.addButton({
					title: 'Close',
					type: 'primary',
					onClick: () => this.rootVcrService.clear()
				});
			}
		});
	}

	get closeAnim() {
		return this._closeAnim;
	}

	get closeUserAnim() {
		return this._closeUserAnim;
	}
	get clientLogo() {
		return this._clientLogo;
	}

	get menuOpened() {
		return this._menuOpened;
	}
	get userMenuOpened() {
		return this._userMenuOpened;
	}

	changeNotifications(notifications: boolean): void {
		this._notificationsOpened = notifications;
	}

	listenToIncrementUnreadNotificationsCounter() {
		// const observable = new Observable(observer => {
		// 	this._socket.on('incrementUnreadNotificationsCounter', data => {
		// 		observer.next(data);
		// 	});
		// });
		// return observable;
	}

	private changeTheme(): void {
		if (localStorage.getItem('theme')) {
			this.theme = localStorage.getItem('theme') as 'old' | 'new';
		}
	}
}
