import { Loading } from './../../../../shared/utils';
import { Observable } from 'rxjs/Observable';
import { Socket } from 'ng-socket-io';
import { Component, OnInit, OnDestroy, ViewChild, Renderer, ElementRef } from '@angular/core';
import { CandidateChatService } from './candidate-chat.service';
import { Parse } from '../../../../parse.service';
import { CandidatesService } from '../../candidates.service';

@Component({
	selector: 'app-candidate-chat',
	templateUrl: './candidate-chat.component.html',
	styleUrls: ['./candidate-chat.component.scss']
})
export class CandidateChatComponent implements OnInit, OnDestroy {

	private userId: string;
	private contractId: string;

	message = '';
	chat = [];
	sortedChat = [];
	chatUser = this._parse.getCurrentUser();
	candidate;
	owner;
	dialogObject;
	isWorking = 0;
	file;
	private _userIdSubscriprion;
	isShortlist = true;
	threadIds = [];
	hasMessages;
	@ViewChild('uploadBtn') private uploadBtn: ElementRef;
	@ViewChild('textarea') private textarea: ElementRef;
	constructor(
		private _parse: Parse,
		private _candidatesService: CandidatesService,
		private CandidateChatService: CandidateChatService,
		private _socket: Socket,
		private _renderer: Renderer
	) { }

	ngOnInit() {
		this.getMessagesUpdated().subscribe(data => {
			this.chat.unshift(data['message']);
		});
		this.getMessagesIncoming().subscribe(data => {
			this.CandidateChatService.setIsReaded(data['objectId']);
			this.chat.unshift(data);
		});
		this.contractId = this._candidatesService.contractId;
		this.userId = this._candidatesService.userId;

		this._userIdSubscriprion = this._candidatesService.userId.subscribe(userId => {
			this.hasMessages = Loading.loading;
			console.log('userId subscription: ', userId);
			this.userId = userId;
			this.threadIds = null;
			this.chat = [];
			this.sortedChat = [];
			this.CandidateChatService.getCandidate(userId).then(user => {
				console.log('user', user);
				this.candidate = user;
				console.log(this.chatUser.id, user.id, this.contractId);
				this.CandidateChatService.getDialogForContract(this.chatUser.id, user.id, this.contractId)
					.then(dialog => {
						console.log('dialog', dialog);
						if (dialog) {
							setTimeout(() => {
								this.hasMessages = Loading.success;
							}, 1000);
						} else {
							this.hasMessages = Loading.error;
						}
						this.dialogObject = dialog;
						this.CandidateChatService.getDialogHistory({
							lastMessageDate: new Date,
							dialogID: this.dialogObject.id,
							typeMessages: 'old',
						}, this.chatUser).then(res => {
							if (res.length > 0) {
								this.threadIds = this.CandidateChatService.getGmailThreadId(res);
								console.log(this.threadIds);
							} else {
								this.threadIds = null;
							}
							this.sortedChat = this.sortedChat.concat(res);
							this.sortedChat.sort(function compare(a, b) {
								const dateA = new Date(a.createdAt);
								const dateB = new Date(b.createdAt);
								return dateB.getTime() - dateA.getTime();
							});
							this.sortedChat.forEach(message => {
								this.chat.push(message);
							});
							console.log('this.chat', this.chat);
						});
					});
			}).then(() => {
				this.CandidateChatService.getContractOwner(this.contractId).then(owner => {
					console.log('OWNER: ', owner);
					this.owner = owner;
				});
			}, error => {
				console.error(error);
			});
		});
	}

	ngOnDestroy() {
		this._socket.removeAllListeners('updated');
		this._socket.removeAllListeners('incoming');
		this._userIdSubscriprion.unsubscribe();
	};

	sendMessage() {
		console.log('dialog', this.dialogObject);
		if (this.dialogObject) {
			this._socket.emit('outgoing', {
				'author': this.chatUser.id,
				'message': { message: this.message },
				'dialog': this.dialogObject.id,
				'type': 'P7x3pz5IrP'
			});
			this.message = '';
		} else {
			this.CandidateChatService.createDialog(this.chatUser.id, this.userId, this.contractId).then(d => {
				this.hasMessages = Loading.success;
				this.dialogObject = d;
			}).then(() => {
				this._socket.emit('outgoing', {
					'author': this.chatUser.id,
					'message': { message: this.message },
					'dialog': this.dialogObject.id,
					'type': 'P7x3pz5IrP'
				});
				this.message = '';
			});
		}
	}

	getMessagesUpdated() {
		const observable = new Observable(observer => {
			this._socket.on('updated', data => {
				observer.next(data);
			});
		});
		return observable;
	}

	getMessagesIncoming() {
		const observable = new Observable(observer => {
			this._socket.on('incoming', data => {
				observer.next(data);
			});
		});
		return observable;
	}

	keypressHandler(event) {
		if (event.keyCode === 13 && event.shiftKey) {
			event.preventDefault();
			this.sendMessage();
		}
	}

	sendValue($event) {
		this.file = this._parse.File($event.target.files[0].name, $event.target.files[0]);
		this.file.save().then(() => {
			this.CandidateChatService.createCVFile(this.file, $event.target.files[0].name).then((obj) => {
				this._socket.emit('outgoing', {
					'author': this.chatUser.id,
					'message': { message: $event.target.files[0].name },
					'dialog': this.dialogObject.id,
					'documentCV': {
						'objectId': obj.id
					}
				});
			});
		});
	}
	get Loading() {
		return Loading;
	}
	changetype() {
		this.isShortlist = !this.isShortlist;
	}
	upload() {
		const event = new MouseEvent('click', { bubbles: true });
		this._renderer.invokeElementMethod(
			this.uploadBtn.nativeElement, 'dispatchEvent', [event]);
	}
}


