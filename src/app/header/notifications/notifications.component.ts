import { Component, EventEmitter, OnInit, Output, Input, ElementRef, Renderer, ViewChild} from '@angular/core';
import { not } from '@angular/compiler/src/output/output_ast';
import { NotificationComponent } from './notification/notification.component';
import { RootVCRService } from '../../root_vcr.service';
import { SocketIoConfig, Socket } from 'ng-socket-io';
import { Observable } from 'rxjs/Observable';
import { HeaderService } from '../header.service';
import { Router, NavigationEnd, Route, ActivatedRoute } from '@angular/router';
import { Parse } from '../../parse.service';
import { JobDetailsService } from '../../job-details/job-details.service';
import { ClearStringPipe } from '../../clear-string.pipe';
import { DeveloperListType, JobType, ContractStatus } from '../../shared/utils';
import { JobBoxService } from '../../jobs-page/job-box/job-box.service';
// tslint:disable:indent
@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {



  @Input() notifications: boolean;
  @Output() notificationsStatus: EventEmitter<boolean> = new EventEmitter();
  @ViewChild('notificationsBox') private notificationsBox: ElementRef;

  public notificationsArray: Array<any> = [];
  private notificationsStorage: Array<any> = [];
  private notificationsTempStorage: Array<any> = [];
  public loader = false;
  private _notificationsQueryLimits = {
		from: 0,
		to: 15
  };
  private _notificationsArrayLimits = {
    from: 0,
    to: 5
  };

  constructor(
		private _jobDetailsService: JobDetailsService,
    private _jobBoxService: JobBoxService,
    public _headerService: HeaderService,
    private _root_vcr: RootVCRService,
    private _elemenRef: ElementRef,
    private _ar: ActivatedRoute,
    private _renderer: Renderer,
    private _router: Router,
    public _socket: Socket,
    private _parse: Parse,
  ) {
      this._renderer.listenGlobal('body', 'click', (event) => {
        if (this.notifications === true) {
          this.notifications = !this.notifications;
          this.notificationsStatus.emit(this.notifications);
        };
        event.stopPropagation();
    });
  }

  ngOnInit() {
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
      console.log(data);
      this.createOn(data);
      this._headerService.updateNotificationsCount('1');
    });
    this.getTeamMemberMessageNotifications().subscribe(data => {
      console.log(data);
      this.createMessageNotification(data);
      this._headerService.updateNotificationsCount('1');
    });
    this.loadNotifications();
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
    if (data.sender) {
      notification.notificationMessageSender = data.sender;
    };
    if (data.candidateId) {
      notification.notificationCandidateId = data.candidateId;
    };
    if (data.contractId) {
      notification.notificationContractId = data.contractId;
    };
    if (data.notePipelineStage) {
      notification.notificationNotePipelineStage = data.notePipelineStage;
    };
    if(data.scoringPipelineStage) {
      notification.notificationScoringPipelineStage = data.scoringPipelineStage;
    }
  }

  createMessageNotification (data) {
    if (window.location.href.indexOf(data.dialogId) > -1) {
      console.log('Do not show Notification');
    } else {
      this._root_vcr.clear();
      const notification = this._root_vcr.createComponent(NotificationComponent);
      notification.notificationType = 'NewMessagePartner';
      notification.notificationMessageSender = data.sender;
      notification.notificationMessage = data.message;
      notification.notificationDialogId = data.dialogId;
    };
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

  sortNotifications(data) {
		const notificationsSorted = [];
		const dates = this.createDatesArray(data);
		let i = 0;
		dates.forEach(date => {
			const dayNotifications = [];
			const notificationsArray = [];
			dayNotifications.push({date: dates[i]});
			i++;
			data.forEach(notification => {
				const notificationDate: Date = new Date (notification._created_at);
				if (notificationDate.toLocaleDateString() === date) {
					notificationsArray.push(notification);
				}
			});
			dayNotifications.push({ notifications: notificationsArray });
			notificationsSorted.push(dayNotifications);
    });
    this.loader = false;
    return notificationsSorted;
	}


	createDatesArray (data) {
    const dates = [];
		data.forEach(notification => {
			const day: Date = new Date(notification._created_at);
			if (!dates.includes(day.toLocaleDateString())) {
				dates.push(day.toLocaleDateString());
			}
		});
		return dates;
  }

  uploadMoreNotifications (event) {
    if (event.target.scrollHeight - event.target.scrollTop - event.target.offsetHeight === 0) {
      if (this._notificationsQueryLimits.from > this._notificationsArrayLimits.from) {
        this.loader = true;
        const slicedArray = this.notificationsStorage
          .slice(this._notificationsArrayLimits.from, this._notificationsArrayLimits.to);
        this.notificationsTempStorage = this.notificationsTempStorage.concat(slicedArray);
        this.notificationsArray = this.sortNotifications(this.notificationsTempStorage);
        this._notificationsArrayLimits.from += 5;
        this._notificationsArrayLimits.to += 5;
      } else if (this._notificationsQueryLimits.from === this._notificationsArrayLimits.from) {
        this.loadNotifications();
      };
    };
  };

  loadNotifications () {
    this.loader = true;
    const date = new Date();
    date.setMonth(date.getMonth() - 3);
    this._parse.execCloud('getAllNotifications',
      {
        userId: this._parse.getCurrentUser().id,
        clientId: this._parse.getCurrentUser().get('Client_Pointer').id,
        limits: this._notificationsQueryLimits,
        date: date
      })
      .then(result => {
        const data = JSON.parse(result);
        if (this.notificationsArray.length === 0) {
          this.notificationsStorage = data;
          this.notificationsTempStorage = this.notificationsStorage
            .slice(this._notificationsArrayLimits.from, this._notificationsArrayLimits.to);
          this.notificationsArray =	this.sortNotifications(this.notificationsTempStorage);
        } else {
          this.notificationsStorage = this.notificationsStorage.concat(data);
          const slicedArray = this.notificationsStorage
            .slice(this._notificationsArrayLimits.from, this._notificationsArrayLimits.to);
          this.notificationsTempStorage = this.notificationsTempStorage.concat(slicedArray);
          this.notificationsArray = this.sortNotifications(this.notificationsTempStorage);
        }
        this._notificationsQueryLimits.from += 15;
        this._notificationsQueryLimits.to += 15;
        this._notificationsArrayLimits.from += 5;
        this._notificationsArrayLimits.to += 5;
	  	}).catch(error => {
        console.log(error);
      });
  }

  setQueryParams (candidateId, infoTab?: string) {
		const data = {
			candidateId: candidateId,
			infoTab: infoTab ? infoTab : false
		};
		localStorage.setItem('queryParams', JSON.stringify(data));
	}
	setActiveStage (data) {
		this._jobDetailsService.activeStage = data;
  }

  goToJobDetails(contractId: string, stage: number) {
    const contractQuery = this._parse.Query('Contract');
    contractQuery.equalTo('objectId', contractId);
    contractQuery.find().then(contract => {
      this._router.navigate(['/jobs', contractId]);
      this._jobBoxService.activeContract = contract;
      if (contract.get('status') == ContractStatus.draft) {
        this._router.navigate(['/jobs', contractId]);
        setTimeout(() => {
          this._router.navigate(['/jobs', contractId, 'job-overview'], { skipLocationChange: true, relativeTo: this._ar });
        }, 1);
      } else {
      }
      this._jobDetailsService.activeStage = stage;
      localStorage.setItem('activeStage', stage.toString());
    });
	}

}
