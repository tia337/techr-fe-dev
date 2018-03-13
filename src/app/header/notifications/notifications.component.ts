import { Component, EventEmitter, OnInit, Output, Input, ElementRef, Renderer} from '@angular/core';
import { not } from '@angular/compiler/src/output/output_ast';
import { NotificationComponent } from './notification/notification.component';
import { RootVCRService } from '../../root_vcr.service';
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
    private _root_vcr: RootVCRService
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
  }

  closeNotifications(notifications: boolean, event): void {
      this.createOn();
      notifications = !notifications;
      this.notificationsStatus.emit(notifications);
      event.stopPropagation();
  }

  createOn () {
    this._root_vcr.clear();
    const notification = this._root_vcr.createComponent(NotificationComponent);
    notification.notificationType = 'note';
    notification.notificationTitle = 'New Applicant';
    notification.notificationText = 'You have a new applicant';
    notification.notificationJob = 'Front-end Developer';
  }

}
