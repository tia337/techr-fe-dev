import { GmailComponent } from './../../../../../gmail/gmail.component';
import base64 from 'base-64';
import base64_url from 'base64-url';
import { Base64 } from 'js-base64';
import { Gapi } from './../../../../../gmail-auth2.service';
import { Component, OnInit, Input, OnChanges, OnDestroy } from '@angular/core';
import { RootVCRService } from 'app/root_vcr.service';
declare const gapi;

@Component({
	selector: 'app-thread-gmail',
	templateUrl: './thread-gmail.component.html',
	styleUrls: ['./thread-gmail.component.scss']
})
export class ThreadGmailComponent implements OnInit, OnChanges {


	// @Input('isShortlist') private isShortlist;
	@Input('threadId') private threadId;
	@Input('userId') private userId;
	@Input('contractId') private contractId;
	@Input('msg') msg;
	gapi: any;
	thread = [];
	rootMsg;
	lastMsg;
	isShortlist = true;
	countMessages;
	currThread;
	sendingEmail: {
		status: string,
		msg: any
	};
	msgId;
	constructor(
		private _gapi: Gapi,
		private _root_vcr: RootVCRService
	) { }

	ngOnInit() {
		this.thread = [];
		this._gapi.getGapi().then((gapi) => {
			this.gapi = gapi;
			if (this.gapi.auth2.getAuthInstance().isSignedIn.get()) {
				console.log('All is working as expected!');
			}
		});
	}


	ngOnChanges(changes) {
		console.log(changes);
		this.lastMsg = null;
		this.rootMsg = null;
		this.thread = null;
		console.log(changes.userId);
		if (changes.userId) {
			this.currThread = null;
		}
		if (this.threadId) {
			console.log(this.threadId);
			this.currThread = this.threadId;
		}
		console.log(this.currThread);
		if (this.currThread) {
			console.log(this.currThread);
			this.getMesasgesFromThread('me', this.currThread);
		}
	}

	changeListType() {
		this.isShortlist = !this.isShortlist;
	}

	getThread(userId, threadId, callback) {
		console.log(userId);
		console.log(threadId);
		const request = gapi.client.gmail.users.threads.get({
			'userId': userId,
			'id': threadId
		});
		request.execute(callback);
	}

	getMesasgesFromThread(userId: string, threadId: string) {
		console.log(userId);
		console.log(threadId);
		this.getThread(userId, threadId, thread => {
			console.log(thread);
			let author;
			let subj;
			let text;
			let time;
			let i;
			i = 0;
			if (thread && thread.messages) {
				this.countMessages = thread.messages.length;
				console.log(thread);
				thread.messages.forEach(el => {
					console.log(el);
					if (el.payload.headers.find(header => {
						return header.name === 'from';
					})) {
						author = el.payload.headers.find(header => {
							return header.name === 'from';
						}).value;
						console.log(author);
					}

					if (el.payload.headers.find(header => {
						return header.name === 'Message-Id';
					})) {
						this.msgId = el.payload.headers.find(header => {
							return header.name === 'Message-Id';
						}).value;
					}

					if (el.payload.headers.find(header => {
						return header.name === 'From';
					})) {
						author = el.payload.headers.find(header => {
							return header.name === 'From';
						}).value;
					}

					if (el.payload.headers.find(header => {
						return header.name === 'subject';
					})) {
						subj = el.payload.headers.find(header => {
							return header.name === 'subject';
						}).value;
					}

					if (el.payload.headers.find(header => {
						return header.name === 'Subject';
					})) {
						subj = el.payload.headers.find(header => {
							return header.name === 'Subject';
						}).value;
					}
					if (el.payload.headers.find(header => {
						return header.name === 'Date';
					})) {
						time = el.payload.headers.find(header => {
							return header.name === 'Date';
						}).value;
					}
					if (el.payload.parts && el.payload.parts[0].body.data) {
						console.log(Base64.decode(el.payload.body.data));
						// console.log(base64_url.decode(el.payload.parts[0].body.data));

						text = base64_url.decode(el.payload.parts[0].body.data);
						// text = Base64.decode(el.payload.body.data);
					}
					if (el.payload.body && el.payload.body.data) {
						console.log(Base64.decode(el.payload.body.data));
						// console.log(base64_url.decode(el.payload.body.data));
						text = base64_url.decode(el.payload.body.data);
						// text = Base64.decode(el.payload.body.data);
					}
					const message = [`Subject: ${subj}`, `Body: ${text}`].join('\n');
					const data = {
						sender: {
							name: '',
						},
						date: time,
						text: message,
						type: 'thread',
						message: el,
						messageId: this.msgId,
						subj: subj

					};
					console.log(data);

					if (i === 0) {
						this.rootMsg = data;
					}
					if (i === this.countMessages - 1) {
						console.log(data);
						this.lastMsg = data;
					}
					console.log(this.rootMsg);
					console.log(this.lastMsg);
					i++;
				});
			}
		});
	};

	sendResponse(msg) {
		const gmail = this._root_vcr.createComponent(GmailComponent);
		gmail.userId = this.userId;
		gmail.contractId = this.contractId;
		gmail.saveChatNote = true;
		gmail.reply = msg;
	}
}
