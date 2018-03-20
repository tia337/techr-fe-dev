import { AlertComponent } from 'app/shared/alert/alert.component';
import { Router, NavigationEnd } from '@angular/router';
import { Component, ViewChild, OnInit, ViewContainerRef, Renderer2, ElementRef, OnDestroy } from '@angular/core';
import { Gapi } from '../gmail-auth2.service';
import { MatSidenav } from '@angular/material';
import { SidenavService } from '../sidenav.service';
import { Login } from '../login.service';
import { Parse } from '../parse.service';
import { RootVCRService } from '../root_vcr.service';
import { Socket } from 'ng-socket-io';
import { CartAdding } from '../header/cartadding.service';
import { CoreService } from './core.service';
import { ActivatedRoute } from '@angular/router';
import { FeedbackAlertComponent } from 'app/core/feedback-alert/feedback-alert.component';
import { Observable } from 'rxjs/Observable';
import { ChatService } from '../chat/chat.service';

@Component({
	selector: 'app-core',
	templateUrl: './core.component.html',
	styleUrls: ['./core.component.scss']
})
export class CoreComponent implements OnInit, OnDestroy {

	@ViewChild('sidenav') public sidenav: MatSidenav;
	@ViewChild('sidenavToggle') sidenavToggle: ElementRef;
	clientLogo: any;

	currentUser;

	private _currentUserSubscription;
	private sideNavPinned = true;
	teamMembers: Array<any> = [];
	inactiveTeamMembers: Array<any> = [];
	invitedMembers;
	showInactiveMembers = true;
	dialog = [];
	private sessionId: string;
	constructor(
		private _sidenav: SidenavService,
		private _coreService: CoreService,
		private _login: Login,
		private _parse: Parse,
		private _vcr: ViewContainerRef,
		private _root_vcr: RootVCRService,
		private _socket: Socket,
		private _renderer: Renderer2,
		private _gapi: Gapi,
		private _cartAdding: CartAdding,
		private _router: Router,
		private _route: ActivatedRoute,
		public _chatService: ChatService
	) {
		this._coreService.currentDeactivatedUser.subscribe(userId => {
			this.teamMembers.forEach(member => {
				const memberId = this.teamMembers.indexOf(member);
				if (member.id === userId) {
					this.teamMembers.splice(memberId, 1);
					this.inactiveTeamMembers.push(member);
				}
			});
		});
	}

	ngOnInit() {
		this._sidenav.setSidenav(this.sidenav);
		this.getTeamMemberOnline().subscribe(data => {
			this.teamMembers.forEach(member => {
				if (member.id === data) {
					member.sessionStatus = true;
				}
			});
		});
		this.getTeamMemberOffline().subscribe(data => {
			this.teamMembers.forEach(member => {
				if (member.id === data) {
					member.sessionStatus = false;
				}
			});
		});
		this.getUnreadMessagesCountUpdated().subscribe(data => {
			console.log(data);
			this.teamMembers.forEach(member => {
				if (member.id === data) {
					member.unreadMessages = parseFloat(member.unreadMessages) + 1;
				}
			});
		});
		this._coreService.readCurrentMessages.subscribe(data => {
			console.log(data);
			this.teamMembers.forEach(member => {
				if (member.dialogId === data) {
					member.unreadMessages = 0;
				}
			});
		});

		this._currentUserSubscription = this._login.profile.subscribe(profile => {
			if (profile) {
				this.currentUser = profile;
				this._coreService.getTeamMembers().then(members => {
					console.log(members);
					this.teamMembers = members;
					this.teamMembers = this.teamMembers.filter(member => {
						return member.id !== this._parse.getCurrentUser().id;
					});
					this.getUnreadMessages(this.teamMembers);
				});

				this._coreService.getInvitations().then(invitations => {
					this.invitedMembers = invitations;
				});

				this._coreService.getInactiveTeamMembers().then(members => {
					this.inactiveTeamMembers = members;
					this.getUnreadMessages(this.inactiveTeamMembers);
				});
			} else {
				this.currentUser = null;
				// this.teamMembers = null;
				this.invitedMembers = null;
			}
		});
		// if (this._login.profile) {
		//   this._coreService.getTeamMembers().then(members => {
		//     this.teamMembers = members;
		//   });
		//
		//
		//   this._coreService.getInvitations().then(invitations => {
		//     this.invitedMembers = invitations;
		//   });
		// }

		console.log(this._parse.Session());
		console.log('First time', this._socket);

		this.sessionId =  Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
		sessionStorage.setItem('sessionId', this.sessionId);
		if (this._parse.getCurrentUser()) {
			this._socket.connect();
			this._socket.emit('subscribe', {userId: this._parse.getCurrentUser().id, sessionId: this.sessionId});
			console.log('Second time', this._socket);
		}
		this._cartAdding.cartLoad();

	}
	test(event) {
		// console.log('open ', event);
	}

	ngOnDestroy() {
		this._currentUserSubscription.unsubscribe();
	}

	pinSideNav() {
		this.sideNavPinned = !this.sideNavPinned;
	}
	toggle() {
		this._renderer.removeClass(this.sidenavToggle.nativeElement, 'open');
		this._renderer.removeClass(this.sidenavToggle.nativeElement, 'close');
		this.sidenav.toggle().then(toggleDrawer => {
			this._renderer.addClass(this.sidenavToggle.nativeElement, toggleDrawer.type);
		});
	}

	mouseEnter(event) {
		if (!this.sideNavPinned) {
			this.toggle();
		}
	}

	postJob() {
		if (this._router.url === '/post-job' || this._router.url === '/post-job.') {
			const alert = this._root_vcr.createComponent(AlertComponent);
			alert.content = `Are you sure you want to start creating the new job? This Job will be saved to drafts.`;
			alert.addButton({
				type: 'primary',
				title: 'Yes, I\'m sure',
				onClick: () => {
					this._root_vcr.clear();
					if(this._router.url === '/post-job')
						this._router.navigate(['/', 'post-job.']);
					if(this._router.url === '/post-job.')
						this._router.navigate(['/', 'post-job']);
					// window.location.href = "/post-job";
					// location.reload();
					// this._router.navigate(['/', 'post-job']);
					// this._router.routeReuseStrategy.shouldReuseRoute = function(){
					// 	return false;
					// };
					// console.log("reload page");
					// this._router.events.subscribe((evt) => {
					// 	if (evt instanceof NavigationEnd) {
					// 		this._router.navigated = false;
					// 		window.scrollTo(0, 0);
					// 	}
					// });
				}
			});
			alert.addButton({
				type: 'primary',
				title: 'No, continue editing this job.',
				onClick: () => {
					this._root_vcr.clear();
				}
			});
			alert.title = 'Attention!';
		} else {
			this._router.navigate(['/', 'post-job']);
		}
	}
	changeLocationToInviteuser() {
		this._router.navigate(['/', 'administration', 'user-management']);
		setTimeout(() => {
			this._router.navigate(['/', 'administration', 'user-management', { outlets: { 'user-management-sections': ['invite-user'] } }], { skipLocationChange: true});
		}, 0);
	}
	feedbackCreation() {
		this._root_vcr.createComponent(FeedbackAlertComponent);
	}

	getUnreadMessages (members: Array<any>) {
		members.forEach(member => {
			this._parse.execCloud('getUnreadMessagesPartnerCount', {memberId: member.id}).then(data => {
				member.unreadMessages = data.unreadMessages;
				member.dialogId = data.dialogId;
			});
		});
		this.getSessionStatus(members);
	};

	getSessionStatus (members: Array<any>) {
		members.forEach(member => {
			this._parse.execCloud('getSessionStatus', {memberId: member.id}).then(status => {
				member.sessionStatus = status;
			});
		});
	};

	getTeamMemberOnline() {
		const observable = new Observable(observer => {
			this._socket.on('teamMemberOnline', data => {
				observer.next(data);
			});
		});
		return observable;
	};

	getTeamMemberOffline() {
		const observable = new Observable(observer => {
			this._socket.on('teamMemberOffline', data => {
				observer.next(data);
			});
		});
		return observable;
	};

	getUnreadMessagesCountUpdated() {
		const observable = new Observable(observer => {
			this._socket.on('IncrementUnreadMessagesCounter', data => {
				observer.next(data);
			});
		});
		return observable;
	};
}
