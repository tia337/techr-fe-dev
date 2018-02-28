import { Component, EventEmitter, OnInit, Output, Input, ElementRef, Renderer} from '@angular/core';
// tslint:disable:indent
@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {

  @Input()
  notifications: boolean;

  @Output() notificationsStatus: EventEmitter<boolean> = new EventEmitter();
  constructor(
    private _elemenRef: ElementRef,
    private _renderer: Renderer
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
      notifications = !notifications;
      this.notificationsStatus.emit(notifications);
      event.stopPropagation();
  }
}
