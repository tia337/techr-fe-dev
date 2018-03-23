import { Component, EventEmitter, OnInit, Output, Input, ElementRef, Renderer} from '@angular/core';
import { not } from '@angular/compiler/src/output/output_ast';
import { NotificationComponent } from './notification/notification.component';
import { RootVCRService } from '../../root_vcr.service';
import { SocketIoConfig, Socket } from 'ng-socket-io';
import { Observable } from 'rxjs/Observable';
import { HeaderService } from '../header.service';


// tslint:disable:indent
@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {



  @Input() notifications: boolean;

  @Output() notificationsStatus: EventEmitter<boolean> = new EventEmitter();

  constructor(
    private _elemenRef: ElementRef,
    private _renderer: Renderer,
    private _root_vcr: RootVCRService,
    public _socket: Socket,
    public _headerService: HeaderService
  ) {
      this._renderer.listenGlobal('body', 'click', (event) => {
        if (this.notifications === true) {
          this.notifications = !this.notifications;
          this.notificationsStatus.emit(this.notifications);
        }
        event.stopPropagation();
    });
  }

  ngOnInit() {
    this._socket.connect();
    this.getNoteMentionsNotificationsUpdated().subscribe(data => {
      this.createOn(data);
      this._headerService.updateNotificationsCount('1');
    });
    this.getContractApplyNotifications().subscribe(data => {
      this.createOn(data);
      this._headerService.updateNotificationsCount('1');
    });
    this.getScoringMentionNotifications().subscribe(data => {
      this.createOn(data);
      this._headerService.updateNotificationsCount('1');
    });
    this.getEmployeeReferralsNotifications().subscribe(data => {
      this.createOn(data);
      this._headerService.updateNotificationsCount('1');
    });
    this.getTeamMemberMessageNotifications().subscribe(data => {
      // this.createOn(data);
      console.log(data);
      this._headerService.updateNotificationsCount('1');
    });
  }

  closeNotifications(notifications: boolean, event): void {
      notifications = !notifications;
      this.notificationsStatus.emit(notifications);
      event.stopPropagation();
  }

  createOn (data) {
    this._root_vcr.clear();
    const notification = this._root_vcr.createComponent(NotificationComponent);
    notification.notificationType = data.notificationType;
    if (data.candidateName) {
      notification.candidateName = data.candidateName;
    };
    if (data.contractTitle) {
      notification.notificationTitle = data.contractTitle;
    };
    notification.candidateId = data.candidateId;
    notification.contractId = data.contractId;
  }

  create() {
    this._root_vcr.clear();
    const notification = this._root_vcr.createComponent(NotificationComponent);
    notification.notificationType = 'NoteMention';
    notification.candidateName = 'Lil Jordan Michael Wayne';
    notification.notificationTitle = 'Angular 2+ developer/Middle';
    notification.candidateId = '2';
    notification.contractId = '2';
  }

  getNoteMentionsNotificationsUpdated () {
    const observable = new Observable(observer => {
			this._socket.on('MentionOnNoteNotification', data => {
				observer.next(data);
			});
		});
		return observable;
  };

  getContractApplyNotifications () {
    const observable = new Observable(observer => {
			this._socket.on('ContractApplyNotification', data => {
				observer.next(data);
			});
		});
		return observable;
  };

  getScoringMentionNotifications () {
    const observable = new Observable(observer => {
			this._socket.on('MentionScoringNotification', data => {
				observer.next(data);
			});
		});
		return observable;
  };

  getEmployeeReferralsNotifications () {
    const observable = new Observable(observer => {
			this._socket.on('EmployeeReferralNotification', data => {
				observer.next(data);
			});
		});
		return observable;
  }

  getTeamMemberMessageNotifications () {
    const observable = new Observable(observer => {
			this._socket.on('NewMessagePartnerNotification', data => {
				observer.next(data);
			});
		});
		return observable;
  }

}
