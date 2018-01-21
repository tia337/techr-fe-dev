import { Component, OnInit } from '@angular/core';
import { RootVCRService } from 'app/root_vcr.service';
import { FeedbackService } from 'app/core/feedback-alert/feedback.service';

@Component({
	selector: 'app-feedback-alert',
	templateUrl: './feedback-alert.component.html',
	styleUrls: ['./feedback-alert.component.scss']
})
export class FeedbackAlertComponent implements OnInit {

	feedbackTypes = new Array();
	text = '';
	feedbackType;
	isSent = false;

	constructor(private _root_vcr: RootVCRService, private _feedbackService: FeedbackService) {
		this._feedbackService.getFeedbackTypes().then(resultTypes => {
			this.feedbackTypes = resultTypes;
		});
	}

	ngOnInit() {
	}
	exit() {
		this._root_vcr.clear();
	}
	saveSendFeedback() {
		console.log(this.text);
		this._feedbackService.saveUserFeedbacks(this.feedbackType.id, this.text);
		this.isSent = true;
	}
	changeType(type) {
		this.feedbackType = type;
	}
}
