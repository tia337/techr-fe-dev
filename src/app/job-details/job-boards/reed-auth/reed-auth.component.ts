import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { RootVCRService } from 'app/root_vcr.service';
import { JobBoardsService } from 'app/job-details/job-boards/job-boards.service';
import { JobBoardsComponent } from 'app/job-details/job-boards/job-boards.component';
import { FormControl, Validators } from '@angular/forms';

@Component({
	selector: 'app-reed-auth',
	templateUrl: './reed-auth.component.html',
	styleUrls: ['./reed-auth.component.scss']
})
export class ReedAuthComponent implements OnInit {

	title = 'Reed integration needs your Reed auth information';
	apiKey;
	reedEmail;
	board;
	index;
	parent: JobBoardsComponent;
	jobBoard;
	// @ViewChild('infoButton') infoButton: ElementRef;
	showInfo = false;

	emailFormControl = new FormControl('', [
		Validators.required,
		Validators.email,
	]);

	constructor(private _vcr: RootVCRService, private _serv: JobBoardsService) {}

	ngOnInit() {}
	addToCart() {
		// if (this.apiKey && this.apiKey.length === 36 && this.emailFormControl.valid) {
			this.parent.activeSpinners.push(this.index);
			this.parent._CartAddingService.callAnimation();
			if (this.jobBoard) {
				this.parent._CartAddingService.addPaid(this.jobBoard, this.parent.contractId).then(() => {
					return this.parent.getInCart();
				}).then(() => {
					this.parent.activeSpinners.splice(this.parent.activeSpinners.indexOf(this.index), 1);
					this._serv.setPartnerReedPostingKeys(this.apiKey, this.emailFormControl.value);
					this.parent.reedApiExistance = true;
					this.exit();
				});
			} else {
				this.parent._CartAddingService.addFree(this.board, this.parent.contractId).then(() => {
					this.parent.getInCart();
				}).then(res => {
					this.parent.activeSpinners.splice(this.parent.activeSpinners.indexOf(this.index), 1);
					this._serv.setPartnerReedPostingKeys(this.apiKey, this.emailFormControl.value);
					this.parent.reedApiExistance = true;
					this.exit();
				});
			}
		// } else {
			// this.apiKey = 'Enter URL or cancel integration';
		// }
	}
	exit() {
		if (this.showInfo) {
			this.showInfo = false;
		} else {
			this._vcr.clear();
		}
	}
	showInfoFunc() {
		this.showInfo = true;
	}
}
