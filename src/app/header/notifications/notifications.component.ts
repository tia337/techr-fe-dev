import { Component, EventEmitter, OnInit, Output, Input} from '@angular/core';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {

  @Input()
  notifications;

  @Output() changeNotifications: EventEmitter<boolean> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  closeNotifications(notifications: boolean): void {
      notifications = !notifications;
      this.changeNotifications.emit(notifications);
  }  

}
