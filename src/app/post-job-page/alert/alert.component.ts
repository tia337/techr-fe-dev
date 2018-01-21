import { RootVCRService } from './../../root_vcr.service';
import { Component, OnInit, OnDestroy, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { FormControl } from '@angular/forms';
import { PostJobService } from 'app/post-job-page/post-job.service';
import { Branch } from 'app/shared/services/branch.service';
import { parse, isValidNumber, format} from 'libphonenumber-js';

@Component({
	selector: 'app-alert',
	templateUrl: './alert.component.html',
	styleUrls: ['./alert.component.scss']
})
export class AlertComponentPost implements OnInit {

	numberCtrl = new FormControl();
	isPostJobShowAlert = false;
	isValid = false;

	constructor(
		private _renderer: Renderer2,
		private _elRef: ElementRef,
		private _root_vcr: RootVCRService,
		private _postJobService: PostJobService,
		private _branch: Branch
	) { }

	ngOnInit() {
		this._renderer.appendChild(document.body, this._elRef.nativeElement);
	}
	close() {
		if (this.isPostJobShowAlert) {
			this._postJobService.saveIsPostJobShowAlert();
		}
		this._root_vcr.clear();
	}
	phonenumber() {
		if (isValidNumber(parse(this.numberCtrl.value))) {
			this.isValid = true;
		}
	}
	sendSMS() {
		console.log('Sending to:', format(parse(this.numberCtrl.value), 'International'));
		this._branch.sendSMS(format(parse(this.numberCtrl.value), 'International'));
		this._root_vcr.clear();
	}
}
