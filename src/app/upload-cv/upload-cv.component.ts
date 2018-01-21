import {
	Component,
	OnInit,
	Input,
	ElementRef
} from '@angular/core';
import {
	Ng4FilesService,
	Ng4FilesConfig,
	Ng4FilesSelected,
	Ng4FilesStatus
} from 'angular4-files-upload';
import {
	UploadCvService,
	UserFromCV
} from './upload-cv.service';
import {
	FormControl
} from '@angular/forms';
import {
	MatSelectChange,
	MatAutocompleteTrigger,
	MatMenuTrigger
} from '@angular/material';
import {
	FileDropModule,
	UploadFile,
	UploadEvent
} from 'ngx-file-drop/lib/ngx-drop';
import {
	RootVCRService
} from 'app/root_vcr.service';

@Component({
	selector: 'upload-cv',
	templateUrl: './upload-cv.component.html',
	styleUrls: ['./upload-cv.component.scss']
})
export class UploadCvComponent implements OnInit {

	selectedContract: {
		name: string,
		id: string
	};
	public files: File[] = new Array();
	public ffolder: WebKitDirectoryReader;
	public selectedFile;
	public cvFile = ' ';
	name = ' ';
	sourceCandidate = 'Channel Source';
	sourceJobBoard = 'Choice JobBoard';
	sourceChannelCtrl = new FormControl();
	sourceOnlineJobBoard;
	sourceDifferentways;
	userListChoice = -1;
	src: {
		srcChID: string,
		srcJBID: string
	};
	isReady = false;
	isActive = false;
	isReadyPreLoader = false;
	filesCount: number;
	resultsReady = false;
	public resultsArray: {
		cvName: string,
		result: string,
		resultCode: number
	}[] = new Array();
	private testConfig: Ng4FilesConfig = {
		maxFilesCount: 5,
		maxFileSize: 10485760,
		totalFilesSize: 104857600
	};
	public testfiles: UploadFile[] = [];

	//  			EMPLOYEE REFERRALS
	fewLines = '';
	employeeEmail = '';
	referralLinkedIn = '';

	constructor(
		private ng4FilesService: Ng4FilesService,
		private _upload: UploadCvService,
		private _vcr: RootVCRService
	) {
		this.ng4FilesService.addConfig(this.testConfig);
		this._upload.getAllCandiadateSources().then(result => {
			this.sourceDifferentways = result;
		});
		this._upload.getAllJobBoards().then(result => {
			this.sourceOnlineJobBoard = result;
		});
		this.src = {
			srcChID: '',
			srcJBID: ''
		};
	}

	public dropped(event: UploadEvent) {
		this.testfiles = event.files;
		for (let file of event.files) {
			file.fileEntry.file(info => {
				this.files.push(info);
			});
		}
	}
	public fileOver(event) {
		console.log(event);
	}

	public fileLeave(event) {
		console.log(event);
	}
	ngOnInit() {}
	public filesSelect(selectedFiles: Ng4FilesSelected): void {
		if (this.files !== undefined) {
			selectedFiles.files.forEach(f => {
				this.files.push(f);
			});
		} else {
			this.files = selectedFiles.files;
		}
		while (this.files.length > 5) {
			this.files.shift();
		}
		this.choiceSource();
		this.choiceJobBoard();
	}

	choiceSource(val? ) {
		if (val) {
			this.src.srcChID = val.id;
			this.sourceCandidate = val.name;
			if (val.name === 'Employee Referral') {
				this.userListChoiceFunc(5);
			}
			if (val.name !== 'Employee Referral') {
				// this.userListChoiceFunc(-1);
			}
		}
		if ((this.sourceCandidate !== 'Online JobBoard' || (this.sourceCandidate === 'Online JobBoard' && this.sourceJobBoard !== 'Choice JobBoard')) && this.files.length !== 0) {
			this.isActive = true;
		} else {
			this.isActive = false;
		}
	}
	choiceJobBoard(val ? ) {
		if (val) {
			this.src.srcJBID = val.id;
			this.sourceJobBoard = val.name;
		}
		if (this.files.length > 0 &&
			(this.sourceCandidate !== 'Online JobBoard' || this.sourceJobBoard !== 'Choice JobBoard') &&
			this.sourceCandidate !== 'Channel Source') {
				this.isActive = true;
			} else {
				this.isActive = false;
			}
		}
		userListChoiceFunc(val: number) {
			if (val > -2 && val < 5) {
				this.userListChoice = val;
				if (this.sourceCandidate === 'Employee Referral') {
					this.sourceCandidate = 'Channel Source';
					this.sourceJobBoard = 'Choose JobBoard';
					this.src.srcChID = ' ';
					this.src.srcJBID = ' ';
				}
			} else if (val === 5) {
				this.userListChoice = val;
				this.sourceCandidate = 'Employee Referral';
				if (this.files.length > 0) {
					this.isActive = true;
				}
			}
			if (this.sourceCandidate !== 'Employee Referral' && this.sourceCandidate !== 'Online JobBoard' && this.files.length === 0) {
				this.isActive = false;
			}
		}
		cancelFile(file: File) {
			this.files.splice(this.files.indexOf(file), 1);
			this.choiceSource();
			this.choiceJobBoard();
		}
		choseUploadConfig() {
			this.allUploadAndAdd();
		}
		allUploadAndAdd() {
			this.isReady = false;
			this.filesCount = this.files.length;
			this.isReadyPreLoader = true;
			if (this.files.length === 0) {
				alert('Add Files!');
				return;
			}
			this.resultsArray = new Array();
			const src = {
				listChoice: this.userListChoice,
				chSrcId: this.src.srcChID,
				chSrcName: this.sourceCandidate,
				jbSrcId: this.src.srcJBID,
				jbSrcName: this.sourceJobBoard,
				contract: this.selectedContract,
				last: false,
				linkedin: this.referralLinkedIn,
				email: this.employeeEmail,
				fewlines: this.fewLines
			};
			this.files.forEach(file => {
				src.last = this.files.indexOf(file) === (this.files.length - 1) ? true : false;
				console.log(src);
				if (this.sourceJobBoard === 'Choice JobBoard') {
					this._upload.parseCvService2(file, src, this);
				} else {
					this._upload.parseCvService2(file, src, this);
				}
			})
			// console.log("foreach test");
		}
		alertForHR() {
			alert('Please, make your choice of Source Channel');
		}
		closePanel() {
			this._vcr.clear();
		}
		closeResults() {
			this.resultsReady = false;
			this.files = new Array();
			this.sourceCandidate = 'Channel Source';
			this.sourceJobBoard = 'Choice JobBoard';
			this.userListChoice = -1;
		}
	}
