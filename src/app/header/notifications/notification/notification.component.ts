import {Component, OnInit, ChangeDetectorRef, AfterViewInit, ViewChild, ElementRef, OnDestroy} from '@angular/core';
import { RootVCRService } from '../../../root_vcr.service';

@Component({
	selector: "notification",
	templateUrl: './notification.component.html',
	styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit, AfterViewInit, OnDestroy {

	public notificationType: string;
	public notificationTitle: string;
	public notificationText: string;
	public notificationCandidate: string;
	public notificationJob: string;
	private _onDestroy: Function;


	constructor(private _root_vcr: RootVCRService, private _changesDetector: ChangeDetectorRef) { }

	ngOnInit() {
		// this.contentBlock.nativeElement.innerHTML = this._content;
	}

	ngAfterViewInit() {
		// this.contentBlock.nativeElement.innerHTML = this._content;
	}

	set type(value: string) {
		this.notificationType = value;
		this._changesDetector.detectChanges();
	}

	set title(value: string) {
		this.notificationTitle = value;
		this._changesDetector.detectChanges();
	}

	set candidate(value: string) {
		this.notificationCandidate = value;
	}

	set job(value: string) {
		this.notificationJob = value;
	}

	set onDestroy(func: Function) {
		this._onDestroy = func;
	}

	get type() {
		return this.notificationType;
	}

	get title() {
		return this.notificationTitle;
	}

	get candidate () {
		return this.notificationCandidate;
	}

	get job () {
		return this.notificationJob;
	}

	close() {
		this._root_vcr.clear();
	}

	ngOnDestroy() {
		if (this._onDestroy) {
			this._onDestroy();
		}
	}
	destroy() {
		this._root_vcr.clear();
	}
	hideShowNotification(event) {
		const notification = document.getElementById('single-notification-wrap');
		if (event.type === 'mouseover') {
		  notification.classList.remove('move');
		  notification.classList.add('stay');
		  if (notification.className.includes('move-after-hover')) {
			notification.classList.remove('move-after-hover');
		  }
		} else if (event.type === 'mouseout') {
			notification.classList.remove('stay');
			notification.classList.add('move-after-hover');
		}
	}
}
