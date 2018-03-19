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
      console.log(data);
      this.createOn(data);
      this._headerService.updateNotificationsCount('1');
    });
    this.getContractApplyNotifications().subscribe(data => {
      console.log(data);
      this.createOn(data);
      this._headerService.updateNotificationsCount('1');
    });
    this.getScoringMentionNotifications().subscribe(data => {
      console.log(data);
      this.createOn(data);
      this._headerService.updateNotificationsCount('1');
    });
    this.getEmployeeReferralsNotifications().subscribe(data => {
      console.log(data);
      this.createOn(data);
      this._headerService.updateNotificationsCount('1');
    });
    this.getTeamMemberMessageNotifications().subscribe(data => {
      console.log(data);
      this.createOn(data);
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
    notification.notificationTitle = data.contractTitle;
    notification.candidateName = data.candidateName;
    notification.candidateId = data.candidateId;
    notification.contractId = data.contractId;
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
			this._socket.on('TeamMemberMessageNotifcation', data => {
				observer.next(data);
			});
		});
		return observable;
  }

}
