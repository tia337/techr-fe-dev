import { CandidateChatService } from './../job-details/candidates/candidates-info-tabs/candidate-chat/candidate-chat.service';
import { Gapi } from './../gmail-auth2.service';
import {
	Component, OnInit, Input, ViewChild, ElementRef, OnChanges, Renderer2, Renderer,
	EventEmitter, OnDestroy
} from '@angular/core';
import { GmailDraftsService } from './gmail-drafts.service';
import { AlertComponent } from './../shared/alert/alert.component';
import { RootVCRService } from './../root_vcr.service';
import { GmailNotesChatsIntegrationService } from './gmail-notes-chats-integration.service';
import base64 from 'base-64';
import base64_url from 'base64-url';
import wtf8 from 'wtf-8';
import { Parse } from './../parse.service';
import { GmailService } from './gmail.service';
import { MatMenuModule } from '@angular/material';
import { FormControl, Validators } from '@angular/forms';
import { AsyncPipe } from '@angular/common';
import * as _ from 'underscore';
import { CandidateSingleViewService } from '../talentbase/candidate-single-view/candidate-single-view.service';

declare const gapi: any;

@Component({
	selector: 'app-gmail',
	templateUrl: './gmail.component.html',
	styleUrls: ['./gmail.component.scss']
})

export class GmailComponent implements OnInit, OnChanges, OnDestroy {

	private _onDestroy: EventEmitter<any> = new EventEmitter();
	private _onSend: EventEmitter<any> = new EventEmitter();

	private gapi: any;
	private _isSignedIn: boolean;
	userEmail = 'userservice@mg.swipein.co.uk';

	private templates_standard = [];
	private templates_custom = [];
	private templates_standard_promise = [];
	private templates_custom_promise = [];
	private companyName;
	private uploadedFiles = [''];
	private candidateEmail: string;
	private selectedText = 'Templates';
	private emailTemplate: string;
	private _isPrivate = 'false';
	private allDrafts = [];
	private emailDraft: string;
	private _isSaving: boolean;
	private templateTitle: string;
	private savingTemplateType = 'Select Type';
	private templates_fillers = {
		fEmail: <string>'',
		fCompanyName: <string>'',
		fCandidateName: <string>'',
		fJobTitle: <string>'',
		fMyName: <string>'',
		fMyPosition: <string>'',
		fERPContract: <string>'',
		fERPPWD: <string>'',
		fERPPage: <string>'',
	};
	// myControl: FormControl = new FormControl();
	mentions = [];
	emailSuggestions = [];
	dropdownCCVisible: boolean;
	dropdownBCCVisible: boolean;
	dropdownTOVisible: boolean;
	public activeForCC = false;
	public activeForBCC = false;
	public activeForTO = false;
	public selectionRnICounter = 0;
	public filteredRnIList = [];
	public queryCC = '';
	public queryBCC = '';
	public queryTO = '';
	CC = [];
	BCC = [];
	TO = [];
	public selectedCC = [];
	public selectedBCC = [];
	public selectedTO = [];
	public activatedDropdown: string;
	@ViewChild('uploadBtn') uploadBtn: ElementRef;
	@ViewChild('eSubject') subjectField: ElementRef;
	@ViewChild('eBody') bodyField: ElementRef;
	public sendingEmail;
	public userId: string;
	public contractId: string;
	public saveChat: boolean;
	public saveNote: boolean;
	public reply: any;
	public needTemplates: boolean;
	public templateTypes = ['', '', '', ''];
	public templateOptions = [];
	public emailSubj: string;
	public emailBody: string;
	public filesToSend = [];
	public attachments = [];

	emailSending: boolean = false;

	constructor(
		private _gService: GmailService,
		private _parse: Parse,
		private _renderer: Renderer2,
		private _rendererD: Renderer,
		private _notechat: GmailNotesChatsIntegrationService,
		private _rootVCR: RootVCRService,
		private _gDraft: GmailDraftsService,
		private _gapi: Gapi,
		private _elementRef: ElementRef,
		private _chatService: CandidateChatService,
		private _candidateSingleViewService: CandidateSingleViewService
	) {
	}

	ngOnInit() {
		this.bodyField.nativeElement.value = this.emailBody;
		this.subjectField.nativeElement.value = this.emailSubj;
		this._gapi.getGapi().then(received_gapi => {
			// console.log('received_gapi', received_gapi);
			this.gapi = received_gapi;
			this._isSignedIn = this.gapi.auth2.getAuthInstance().isSignedIn.get();
			this.gapi.auth2.getAuthInstance().isSignedIn.listen(status => {
				if (status) {
					this._isSignedIn = true;
				} else {
					this._isSignedIn = false;
				}
			});
			if (this.isSignedIn) {
				this.makeApiCall();
				this.getAllDrafts('me');
				this.fillEmail(this.gapi.auth2.getAuthInstance().currentUser.get());
			}
		});

		if (this.attachments[0]) {
			this.sendValue({ target: { files: this.attachments } });
		}

		if (this.templateOptions.includes(0)) {
			this.templateTypes[0] = 'Ge8Om3Enth';
		}
		if (this.templateOptions.includes(1)) {
			this.templateTypes[1] = 'MyYsOVzPf0';
		}
		if (this.templateOptions.includes(2)) {
			this.templateTypes[2] = 'UCqe0Dsx5Z';
		}
		if (this.templateOptions.includes(3)) {
			this.templateTypes[3] = '9rvqe95mlL';
		}
		if (this.templateOptions.includes('all')) {
			this.templateTypes[0] = 'Ge8Om3Enth';
			this.templateTypes[1] = 'MyYsOVzPf0';
			this.templateTypes[2] = 'UCqe0Dsx5Z';
			this.templateTypes[3] = '9rvqe95mlL';
		}
		this.templates_standard_promise.push(this._gService.getStandardTemplates(this.templateTypes[0]));
		this.templates_standard_promise.push(this._gService.getStandardTemplates(this.templateTypes[1]));
		this.templates_standard_promise.push(this._gService.getStandardTemplates(this.templateTypes[2]));
		this.templates_standard_promise.push(this._gService.getStandardTemplates(this.templateTypes[3]));

		this.templates_custom_promise.push(this._gService.getCustomTemplatesForClient(this.templateTypes[0]));
		this.templates_custom_promise.push(this._gService.getCustomTemplatesForClient(this.templateTypes[1]));
		this.templates_custom_promise.push(this._gService.getCustomTemplatesForClient(this.templateTypes[2]));
		this.templates_custom_promise.push(this._gService.getCustomTemplatesForClient(this.templateTypes[3]));

		this._parse.Parse.Promise.when(this.templates_custom_promise).then(temp => {
			this.templates_custom = temp;
		});

		this._parse.Parse.Promise.when(this.templates_standard_promise).then(temp => {
			this.templates_standard = temp;
		});

		this._gService.getCompanyName().then(clientName => {
			this.companyName = clientName;
		});

		this.candidateEmail = '';
		this._gService.getFillers(this.contractId, this.userId).then(data => {
			this.templates_fillers = {
				fEmail: this.userEmail,
				fCompanyName: data.fCompanyName,
				fCandidateName: data.fCandidateName,
				fJobTitle: data.fJobTitle,
				fMyName: data.fMyName,
				fMyPosition: data.fMyPosition,
				fERPPage: data.fERPPage,
				fERPPWD: data.fERPPWD,
				fERPContract: data.fERPContract,
			};
			this.candidateEmail = data.fCandidateEmail;
		});
		if (localStorage.getItem('candidateEmail')) this.candidateEmail = localStorage.getItem('candidateEmail');
	}




	filter(val: string): string[] {
		return this.emailSuggestions.filter(option =>
			option.toLowerCase().indexOf(val.toLowerCase()) === 0);
	}

	ngOnChanges(changes) {

	}

	sendEmail(email) {
		this.emailSending = true;
		const message = {
			from: email.from.value,
			to: (this.selectedTO && this.selectedTO[0]) ? this.selectedTO.join(';') : email.to.children[1].children[0].children[0].children[0].children[0].value,
			cc: (this.selectedCC && this.selectedCC[0]) ? this.selectedCC.join(';') : null,
			bcc: (this.selectedBCC && this.selectedBCC[0]) ? this.selectedBCC.join(';') : null,
			sub: email.sub.value,
			body: email.body.value,
			att: this.filesToSend,
			userEmail: this.userEmail
		};
		if (this.reply) {
			message['resub'] = (this.reply.subj[0] === 'R' && this.reply.subj[1] === 'e' && this.reply.subj[2] === ':') ?
				this.reply.subj : `Re: ${this.reply.subj}`;
			message['references'] = this.reply['messageId'];
			message['inReply'] = this.reply['messageId'];
			message['threadId'] = this.reply['message']['threadId'];
			email.sub.value = message['resub'];
			if (this.reply.message.payload.parts[0]) {
				message.body = message.body + '\n>' + base64_url.decode(this.reply.message.payload.parts[0].body.data).replace(/\n/g, '\n>');
			} else if (this.reply.message.payload.body.data) {
				message.body = message.body + '\n>' + base64_url.decode(this.reply.message.payload.body.data).replace(/\n/g, '\n>');
			}
		}
		if (localStorage.getItem('token-ms')) {
			let token = localStorage.getItem('token-ms');
			this._parse.execCloud('sendEmailOutlook', { token: token, message: message })
			.then(res => {
				this.emailSending = false;
				this.closePopup();
				this._onSend.emit();
				const alert = this._rootVCR.createComponent(AlertComponent);
				alert.title = 'Information';
				alert.contentAlign = 'left';
				alert.content = `Email successfully sent!`;
				alert.addButton({
					type: 'primary',
					title: 'Ok',
					onClick: () => {
						this._rootVCR.clear();
					}
				});
			})
			.catch(err => {
				console.error(err);
				this.emailSending = false;
				this.closePopup();
			});

			return;
		}
		if (this.isSignedIn) {
			this._gapi.sendMessage(message, res => {
				console.log(res.threadId);
				this.emailSending = false;
				if (this.saveNote) {
					this._notechat.saveGmailToNotes(email, this.userId, this.contractId, this.emailTemplate, this._isPrivate).then(notes => {
						if (this.saveChat) {
							this._notechat.saveGmailToChat(email, this.userId, this.contractId, res.threadId).then(chat => {
								if (chat && notes) {
									this.emailSending = false;
									console.log('Message && Note saved!');
									email.from.value = '';
									email.to.value = '';
									email.cc.value = '';
									email.bcc.value = '';
									email.sub.value = '';
									email.body.value = '';
									if (this.selectedCC) {
										this.selectedCC.forEach(el => {
											this.CCRemove(el);
										});
									}
									if (this.selectedBCC) {
										this.selectedBCC.forEach(el => {
											this.BCCRemove(el);
										});
									}
									if (this.selectedTO) {
										this.selectedTO.forEach(el => {
											this.TORemove(el);
										});
									}
									this.closePopup();
									this._onSend.emit();
									const alert = this._rootVCR.createComponent(AlertComponent);
									alert.title = 'Information';
									alert.content = `Email successfully sent!`;
									alert.contentAlign = 'left';
									alert.addButton({
										type: 'primary',
										title: 'Ok',
										onClick: () => {
											this._rootVCR.clear();
										}
									});
								}
							});
						}
					});
				} else {
					this.closePopup();
					this._onSend.emit();
					const alert = this._rootVCR.createComponent(AlertComponent);
					alert.title = 'Information';
					alert.contentAlign = 'left';
					alert.content = `Email successfully sent!`;
					alert.addButton({
						type: 'primary',
						title: 'Ok',
						onClick: () => {
							this._rootVCR.clear();
						}
					});
				}
			});
		} else {
			message.att = this.uploadedFiles;
			this._parse.execCloud('sendData', message).then(res => {
				this.emailSending = false;
				if (this.saveNote) {
					this._notechat.saveGmailToNotes(email, this.userId, this.contractId, this.emailTemplate, this._isPrivate).then(notes => {
						if (this.saveChat) {
							this._notechat.saveGmailToChat(email, this.userId, this.contractId, res.threadId).then(chat => {
								if (chat && notes) {
									console.log('Message && Note saved!');
									email.from.value = '';
									email.to.value = '';
									email.cc.value = '';
									email.bcc.value = '';
									email.sub.value = '';
									email.body.value = '';
									if (this.selectedCC) {
										this.selectedCC.forEach(el => {
											this.CCRemove(el);
										});
									}
									if (this.selectedBCC) {
										this.selectedBCC.forEach(el => {
											this.BCCRemove(el);
										});
									}
									if (this.selectedTO) {
										this.selectedTO.forEach(el => {
											this.TORemove(el);
										});
									}
									this.closePopup();
									this._onSend.emit();
									const alert = this._rootVCR.createComponent(AlertComponent);
									alert.title = 'Information';
									alert.contentAlign = 'left';
									alert.content = `Email successfully sent!`;
									alert.addButton({
										type: 'primary',
										title: 'Ok',
										onClick: () => {
											this._rootVCR.clear();
										}
									});
								}
							});
						}
					});
				} else {
					this.closePopup();
					this._onSend.emit();
					const alert = this._rootVCR.createComponent(AlertComponent);
					alert.title = 'Information';
					alert.contentAlign = 'left';
					alert.content = `Email successfully sent!`;
					alert.addButton({
						type: 'primary',
						title: 'Ok',
						onClick: () => {
							this._rootVCR.clear();
						}
					});
				}
			});
		}
	}

	loadTemplate(template, sub, body) {
		// console.log(this.templates_fillers);
		const subject = this._gService.prepareText(template.get('EmailSubject'), this.templates_fillers);
		const text = this._gService.prepareText(template.get('EmailBody'), this.templates_fillers);
		this.emailTemplate = template.get('Title');
		sub.value = subject;
		body.value = text;
		this.selectedText = this.emailTemplate;
	}

	closePopup() {
		this._isPrivate = 'false';
		this.selectedText = 'Templates';
		this.emailTemplate = '';
		this.uploadedFiles = [];
		this.filesToSend = [];
		this._isSaving = false;
		this.templateTitle = '';
		this._rootVCR.clear();
	}
	getAllDrafts(userId) {
		this._gDraft.listDrafts(this.gapi, userId, list => {
			if (list) {
				list.forEach(draft => {
					this._gDraft.getDraft(this.gapi, userId, draft.id, draftInfo => {
						let text = draftInfo.message.payload.headers[4].value !== '' ?
							draftInfo.message.payload.headers[4].value : '';
						text = text.length > 15 ? text.slice(0, 12) + '...' : text;
						this.allDrafts.push({
							date: (new Date((new Date(draftInfo.message.payload.headers[2].value)).getTime())).toDateString(),
							placeholder: text,
							draft: draftInfo
						});
					});
				});
			}
		});
	};
	makeApiCall() {
		this.gapi.client.people.contactGroups.list().then((response) => {
		}, (reason) => {
			console.log('Error: ' + reason.result.error.message);
		});
		this.gapi.client.people.people.connections.list({
			'resourceName': 'people/me',
			'personFields': 'emailAddresses'
		}).then((response) => {
			if (response.result && response.result.connections && response.result.connections[0] && response.result.connections[0].emailAddresses && response.result.connections[0].emailAddresses[0]) {
				response.result.connections.forEach(connection => {
					this.CC.push(connection.emailAddresses[0].value);
					this.BCC.push(connection.emailAddresses[0].value);
					this.TO.push(connection.emailAddresses[0].value);
				});
			}
		}, function (reason) {
			console.log('Error: ' + reason.result.error.message);
		});
	}
	signInGapi(type) {
		this._gapi.handleAuthClick().then(res => {
			if (this.gapi.auth2 && ((this._isSignedIn = this.gapi.auth2.getAuthInstance().isSignedIn.get()))) {
				// console.log(this.gapi.auth2.getAuthInstance().isSignedIn.get());
				this.getAllDrafts('me');
				this.fillEmail(this.gapi.auth2.getAuthInstance().currentUser.get());
				this.makeApiCall();
			}
		});
	}

	singInOutlook() {

	}

	loadDraft(draft, sub, body) {
		const subject = this._gService.prepareText(draft.draft.message.payload.headers[4].value, this.templates_fillers);
		const text = this._gService.prepareText(base64.decode(draft.draft.message.payload.parts[0].body.data), this.templates_fillers);
		this.emailDraft = draft.placeholder;
		sub.value = subject;
		body.value = text;
	}

	selectTemplateType(el) {
		this.savingTemplateType = el._elementRef.nativeElement.childNodes[0].data;
	}


	savingAsTemplate() {
		this._isSaving = true;
	}
	goBack() {
		this._isSaving = false;
	}
	upload() {
		const event = new MouseEvent('click', { bubbles: true });
		this._rendererD.invokeElementMethod(
			this.uploadBtn.nativeElement, 'dispatchEvent', [event]);
	}
	saveTemplate(data) {
		let typeId;
		switch (this.savingTemplateType) {
			case 'Job offer Templates':
				typeId = 'Ge8Om3Enth';
				break;
			case 'Employee Referral Templates':
				typeId = 'MyYsOVzPf0';
				break;
			case 'Job Interview Templates':
				typeId = 'UCqe0Dsx5Z';
				break;
			case 'Rejection Templates':
				typeId = '9rvqe95mlL';
				break;
		}
		this._gDraft.createTemplate({
			typeId: typeId,
			body: data.body,
			subject: data.sub,
			title: this.templateTitle,
		}).then(res => {
			this.closePopup();
		});
	}

	fillEmail(gUser) {
		this.userEmail = 'userservice@mg.swipein.co.uk';
		if (localStorage.getItem("token-ms")) {
			this.userEmail = this._parse.getCurrentUser().get('microsoftEmail');
			return;
		}
		if (gUser.getBasicProfile()) {
			this.userEmail = gUser.getBasicProfile().getEmail();
		}
	}

	sendValue(event) {
		const those = this;
		if (event.target.files[0]) {
			const files = event.target.files;
			Object.keys(files).forEach(function (i) {
				const file = files[i];
				those.createAttachements(file);
				const parseFile = those._parse.File(file.name, file);
				parseFile.save().then(() => {
					those._chatService.createCVFile(parseFile, file.name).then(newFile => {
						const filetoSee = newFile.attributes;
						those.uploadedFiles.unshift(filetoSee);
					});
				});
			});
		}
	}
	createAttachements(file) {
		this.filesToSend.push(file);
	}
	prevDefRnI(value, name: string) {
		if (value.code !== 'Click') {
			if (name === 'CC') {
				this.activeForCC = true;
			} else if (name === 'BCC') {
				this.activeForBCC = true;
			} else if (name === 'TO') {
				this.activeForTO = true;
			}
			this.dropdownCCVisible = false;
			this.dropdownBCCVisible = false;
			this.dropdownTOVisible = false;
		}
		if (value.code === 'Enter') {
			value.preventDefault();
		}
		if (value.code === 'ArrowRight') {
			value.preventDefault();
		}
		if (value.code === 'ArrowLeft') {
			value.preventDefault();
		}
		if (value.code === 'ArrowUp') {
			value.preventDefault();
			if (this.selectionRnICounter > 0) {
				this.selectionRnICounter -= 1;
			}
		}
		if (value.code === 'ArrowDown') {
			value.preventDefault();
			if (this.selectionRnICounter < (this.filteredRnIList.length - 1)) {
				this.selectionRnICounter += 1;
			}
		}
	}
	selectTO(TO, value?) {
		// const roleComponent = this._postJobService.createRoleComponent(role);

		if (!TO && value) {
			TO = value.value;
		}
		this.selectedTO.push(TO);
		const roleRows = this._elementRef.nativeElement.querySelectorAll('._' + TO.slice(0, TO.indexOf('@')));
		roleRows.forEach(element => {
			this._renderer.setStyle(element, 'display', 'none');
		});
		this.TO = _.without(this.TO, TO);
		this.queryTO = '';
		this.filteredRnIList = [];
	}

	selectCC(CC, value?) {
		// const roleComponent = this._postJobService.createRoleComponent(role);
		if (!CC && value) {
			CC = value.value;
		}
		this.selectedCC.push(CC);
		const roleRows = this._elementRef.nativeElement.querySelectorAll('._' + CC.slice(0, CC.indexOf('@')));
		roleRows.forEach(element => {
			this._renderer.setStyle(element, 'display', 'none');
		});

		this.CC = _.without(this.CC, CC);
		this.queryCC = '';
		this.filteredRnIList = [];
	}
	selectBCC(BCC, value?) {
		if (!BCC && value) {
			BCC = value.value;
		}
		this.selectedBCC.push(BCC);
		const roleRows = this._elementRef.nativeElement.querySelectorAll('._' + BCC.slice(0, BCC.indexOf('@')));
		roleRows.forEach(element => {
			this._renderer.setStyle(element, 'display', 'none');
		});

		this.BCC = _.without(this.BCC, BCC);
		this.queryBCC = '';
		this.filteredRnIList = [];
	}
	filterRnI(query, items) {
		if (query.length === 1) {
			const char = '\\b' + query.toUpperCase();
			const exp = new RegExp(char, 'g');
			this.filteredRnIList = items.filter(el => {
				if (el && el.toUpperCase().match(exp)) {
					return el;
				}
			}).slice(0, 50);
		} else if (query !== '') {
			this.filteredRnIList = items.filter(el => {
				if (el) {
					return el.toLowerCase().indexOf(query.toLowerCase()) > -1;
				} else {
					return;
				}
			}).slice(0, 50);
			this.selectionRnICounter = 0;
		} else {
			this.filteredRnIList = [];
		}
	}
	keyRnIPressing(value: any, name: string, templateCc) {
		if (document.activeElement['placeholder'] === 'CC') {
			this.activatedDropdown = 'CC';
		} else if (document.activeElement['placeholder'] === 'BCC') {
			this.activatedDropdown = 'BCC';
		} else if (document.activeElement['placeholder'] === 'To') {
			this.activatedDropdown = 'TO';
		}
		if (value.code === 'Enter') {
			if (name === 'CC') {
				this.selectCC(this.filteredRnIList[this.selectionRnICounter], templateCc);
			} else if (name === 'BCC') {
				this.selectBCC(this.filteredRnIList[this.selectionRnICounter], templateCc);
			} else if (name === 'TO') {
				this.selectTO(this.filteredRnIList[this.selectionRnICounter], templateCc);
			}
		} else if (value.code !== 'ArrowDown' && value.code !== 'ArrowUp' &&
			value.code !== 'Enter' && value.code !== 'ArrowRight' && value.code !== 'Click') {
			if (name === 'CC') {
				this.filterRnI(this.queryCC, this.CC);
			} else if (name === 'BCC') {
				this.filterRnI(this.queryBCC, this.BCC);
			} else if (name === 'TO') {
				this.filterRnI(this.queryTO, this.TO);
			}
		}
	}
	TORemove(TO) {
		this.TO.push(TO);
		this.selectedTO.splice(this.selectedTO.indexOf(TO), 1);
		const TORows = this._elementRef.nativeElement.querySelectorAll('._' + TO.slice(0, TO.indexOf('@')));
		TORows.forEach(element => {
			this._renderer.removeStyle(element, 'display');
		});
	}
	CCRemove(CC) {
		this.CC.push(CC);
		this.selectedCC.splice(this.selectedCC.indexOf(CC), 1);
		const CCRows = this._elementRef.nativeElement.querySelectorAll('._' + CC.slice(0, CC.indexOf('@')));
		CCRows.forEach(element => {
			this._renderer.removeStyle(element, 'display');
		});
	}
	BCCRemove(BCC) {
		this.BCC.push(BCC);
		this.selectedBCC.splice(this.selectedBCC.indexOf(BCC), 1);
		const BCCRows = this._elementRef.nativeElement.querySelectorAll('._' + BCC.slice(0, BCC.indexOf('@')));
		BCCRows.forEach(element => {
			this._renderer.removeStyle(element, 'display');
		});
	}
	activeDropdown(name: string) {
		if (name === 'CC' && (this.dropdownBCCVisible === true || this.dropdownTOVisible === true)) {
			this.dropdownTOVisible = false;
			this.dropdownBCCVisible = false;
		} else if (name === 'BCC' && (this.dropdownCCVisible === true || this.dropdownTOVisible === true)) {
			this.dropdownTOVisible = false;
			this.dropdownCCVisible = false;
		} else if (name === 'TO' && (this.dropdownBCCVisible === true || this.dropdownCCVisible === true)) {
			this.dropdownBCCVisible = false;
			this.dropdownCCVisible = false;
		}
	}
	activeCCUnSet() {
		setTimeout(() => { this.activeForCC = false; }, 400);
	}
	activeBCCUnSet() {
		setTimeout(() => { this.activeForBCC = false; }, 400);
	}
	activeTOUnSet() {
		setTimeout(() => { this.activeForTO = false; }, 400);
	}

	get isSignedIn() {
		return this._isSignedIn;
	}

	get isSaving() {
		return this._isSaving;
	}

	get isPrivate() {
		return this._isPrivate;
	}

	get onDestroy() {
		return this._onDestroy;
	}

	get onSend() {
		return this._onSend;
	}

	set email (value) {
		this.candidateEmail = value;
	}

	get email () {
		return this.candidateEmail;
	}

	ngOnDestroy() {
		this._onDestroy.emit();
		if (localStorage.getItem('candidateEmail')) localStorage.removeItem('candidateEmail');
	}

}
