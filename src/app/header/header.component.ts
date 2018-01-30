import { Component, OnInit, ViewContainerRef, ComponentFactoryResolver, OnDestroy } from '@angular/core';
import { Login } from '../login.service';
import { Parse } from '../parse.service';
import { CartAdding } from './cartadding.service';
import { Router } from '@angular/router';
import { AdministrationMenuComponent } from './administration-menu/administration-menu.component';
import { ConfirmationAlertComponent } from './confirmation-alert/confirmation-alert.component';
import { ParseUser } from 'parse';
import { RootVCRService } from '../root_vcr.service';
import { HeaderService } from './header.service';
import { CompanySettingsService } from 'app/site-administration/company-settings/company-settings.service';
import { AlertComponent } from '../shared/alert/alert.component';
import { Socket } from 'ng-socket-io';
import { PostJobService } from 'app/post-job-page/post-job.service';

import { ContactUsComponent } from "app/contact-us/contact-us.component";



@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {

	cartAmount: number;
	CartTotal: number;
	currency: string;
	currentUser: ParseUser;
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

	constructor(
		private router: Router,
		private _root_vcr: RootVCRService,
		private _CartAddingService: CartAdding,
		private _login: Login,
		private _parse: Parse,
		private _vcr: ViewContainerRef,
		private _cfr: ComponentFactoryResolver,
		private _headerService: HeaderService,
		private _companySettingsService: CompanySettingsService,
		private _socket: Socket,
		private _postJobService: PostJobService
	) {
		this._CartAddingService.CartCount.subscribe(CartCount => {
			this.cartAmount = CartCount;
		});
		this._CartAddingService.CartTotal.subscribe(CartTotal => {
			this.CartTotal = CartTotal;
		});
		this._CartAddingService.Currency.subscribe(currency => {
			this.currency = currency;
		});
		this._CartAddingService.animationActive.subscribe(animation => {
			this.animationActive = animation;
		});
	}

	ngOnInit() {

		this.loadLogoSubsc = this._companySettingsService.logoUpdate.subscribe(() => {
			this.getLogo();
		});

		this.loadLogoSubscPJ = this._postJobService.logoUpdate.subscribe(() => {
			this.getLogo();
		});

		if (this._parse.getCurrentUser()) {
			this.getLogo();
		}
		this._currentUserSubscription = this._login.profile.subscribe(profile => {
			// console.log('PROFILE: ', profile1);
			// console.log('CALL CONFIRM ALERT FROM HEADER OnInit');
			if (profile) {
				// profile1.fetch().then(profile => {
				this.currentUser = profile;
				console.log('profile', profile);
				console.log(`profile.get('Client_Pointer')`, profile.toJSON().Client_Pointer);
				console.log(`profile.has('Client_Pointer')`, profile.has('Client_Pointer'));
				if (!profile.toJSON().Client_Pointer) {
					console.log("CONFORMATION ALERT");
					this._root_vcr.clear();
					this._root_vcr.createComponent(ConfirmationAlertComponent);
				}
				// });
			}
		});
	}

	closeAdminMenu(event?) {
		if (event) {
			// console.log(event.clientY);
			if (event.clientY < 55) {
				this._closeAnim = true;
				// console.log(this.closeAnim);
				setTimeout(() => {
					// console.log(this.closeAnim);
					if (this._closeAnim === true) {
						this._menuOpened = false;
						this._closeAnim = false;
					}
				}, 450);
			}
		} else {
			this._closeAnim = true;
			// console.log(this.closeAnim);
			setTimeout(() => {
				// console.log(this._closeAnim);
				if (this.closeAnim === true) {
					this._menuOpened = false;
					this._closeAnim = false;
				}
			}, 450);
		}
	}

    closeUserMenu(event?) {
        if (event) {
            // console.log(event.clientY);
            if (event.clientY < 55) {
                this._closeUserAnim= true;
                console.log('_closeUserAnim',this._closeUserAnim);
                setTimeout(() => {
                    // console.log(this.closeAnim);
                    if (this._closeUserAnim === true) {
                        this._userMenuOpened = false;
                        this._closeUserAnim = false;
                    }
                }, 450);
            }
        } else {
            this._closeUserAnim = true;
            // console.log(this.closeAnim);
            setTimeout(() => {
                console.log('_closeUserAnim',this._closeUserAnim);
                if (this.closeUserAnim === true) {
                    this._userMenuOpened = false;
                    this._closeUserAnim = false;
                }
            }, 450);
        }
    }


	getLogo() {
		this._headerService.getClientLogo().then(logo => {
			this._clientLogo = logo;
			// console.log(logo._url);
		});
	}

	signIn() {
		this._login.signIn().then(user => {
			if (!user.has('Client_Pointer')) {
				console.log('CALL CONFIRM ALERT FROM HEADER SignIn');
				this._root_vcr.clear();
				this._root_vcr.createComponent(ConfirmationAlertComponent);
			}
		});
	}

	signOut() {
		this._login.signOut();
		this.currentUser = null;
		this._socket.emit('disconnect', {});
		this._socket.disconnect();
	}

	openAdminMenu() {
		this._closeAnim = false;
		this._menuOpened = true;
		// const menu = this._vcr.createComponent(this._cfr.resolveComponentFactory(AdministrationMenuComponent)).instance;
		// menu.containerRef = this._vcr;
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
		console.log("test conformation");
		this._root_vcr.createComponent(ConfirmationAlertComponent);
	}

	accessCheck(event) {
		event.stopPropagation();
		// console.log('access Check');
		this._headerService.getAccessLevel().then(alevel => {
			this.accessLevel = alevel;
			return this._headerService.getAdmins();
		}).then(admins => {
			// console.log(this.accessLevel);
			if (this.accessLevel === 1) {
				// console.log('1 access level');
				this.router.navigate(['/', 'administration', 'billing']);
			} else if (this.accessLevel > 1) {
				// console.log('alert');
				const alert = this._root_vcr.createComponent(AlertComponent);
				alert.title = 'Access level Required';
				alert.icon = 'lock';
				alert.type = 'sad';
				alert.contentAlign = 'left';
				alert.content = `<a style = 'white-space:nowrap'>Hi, ` + this._parse.Parse.User.current().get('firstName') +
					`. You need to be site admin in order to see your billing information.</a><br><a style = 'white-space:nowrap'><strong>` +
					admins + `</strong> can set you up as a site admin if needed.</a>` +
					`<a style = 'white-space:nowrap'>Contact SwipeIn if you need urgent access to Billing and you can't reach your Billing information.</a>`;

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
}
