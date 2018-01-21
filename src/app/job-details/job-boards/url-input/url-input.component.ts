import {
	Component,
	OnInit
} from '@angular/core';
import {
	RootVCRService
} from 'app/root_vcr.service';
import {
	JobBoardsService
} from 'app/job-details/job-boards/job-boards.service';

@Component({
	selector: 'app-url-input',
	templateUrl: './url-input.component.html',
	styleUrls: ['./url-input.component.scss']
})
export class UrlInputComponent implements OnInit {

	title = 'This JobBoard requires the Job URL';
	url;
	board;
	index;
	parent;
	jobBoard;

	constructor(private _vcr: RootVCRService, private _serv: JobBoardsService) {}

	ngOnInit() {}
	addToCart() {
		if (this.url && this.url.length > 1) {
			this.parent.activeSpinners.push(this.index);
			this.parent._CartAddingService.callAnimation();
			if (this.jobBoard) {
				this.parent._CartAddingService.addPaid(this.jobBoard, this.parent.contractId).then(() => {
					return this.parent.getInCart();
				}).then(() => {
					this.parent.activeSpinners.splice(this.parent.activeSpinners.indexOf(this.index), 1);
					this._serv.setContractUrl(this.url, this.parent.contractId);
					this.parent.isForJobBoardURL = true;
					this.exit();
				});
			} else {
				this.parent._CartAddingService.addFree(this.board, this.parent.contractId).then(() => {
					this.parent.getInCart();
				}).then(res => {
					this.parent.activeSpinners.splice(this.parent.activeSpinners.indexOf(this.index), 1);
					this._serv.setContractUrl(this.url, this.parent.contractId);
					this.parent.isForJobBoardURL = true;
					this.exit();
				});
			}
		} else {
			this.url = 'Enter URL or cancel integration';
		}
	}
	exit() {
		this._vcr.clear();
	}
}
