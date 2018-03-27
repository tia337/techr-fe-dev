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
	public notificationCandidateName: string;
	public notificationCandidateId: string;
	public notificationContractId: string;
	public notificationMessage: string;
	public notificationMessageSender: string;
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

	set candidateName(value: string) {
		this.notificationCandidateName = value;
	}

	set candidateId(value: string) {
		this.notificationCandidateId = value;
	}

	set contractId (value: string) {
		this.notificationContractId = value;
	}

	set messageSender (value: string) {
		this.notificationMessageSender = value;
	}

	set message (value: string) {
		this.notificationMessage = value;
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

	get candidateName () {
		return this.notificationCandidateName;
	}

	get candidateId () {
		return this.notificationCandidateId;
	}

	get contractId () {
		return this.notificationContractId;
	}

	get messageSender () {
		return this.notificationMessageSender;
	}

	get message () {
		return this.notificationMessage;
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
