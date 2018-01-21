import { CandidateChatService } from './../candidate-chat.service';
import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Parse } from './../../../../../parse.service';

@Component({
	selector: 'app-chat-message',
	templateUrl: './chat-message.component.html',
	styleUrls: ['./chat-message.component.scss']
})
export class ChatMessageComponent implements OnInit, OnChanges {

	@Input('msg') private msg;
	@Input('email') email : boolean;
	chatUser = this._parse.getCurrentUser();
	message = {
		sender: {
			name: '',
			avatar: ''
		},
		date: '',
		text: '',
		atatchedFileURL: ''
	};
	isLoading = true;
	isSender: boolean;

	constructor(
		private CandidateChatService: CandidateChatService,
		private _parse: Parse
	) { }

	ngOnInit() {
		console.log(this.msg);
	}
	ngOnChanges(changes: any) {
		if (!changes.msg.currentValue) {
			this.message = null;
		} else if (!changes.msg.currentValue.type && changes.msg.currentValue.author.objectId) {
			this.CandidateChatService.getCandidate(changes.msg.currentValue.author.objectId).then(user => {
				this.message = {
					sender: {
						name: user.get('firstName'),
						avatar: user.get('avatarURL') ? user.get('avatarURL') : '../../../../../../assets/img/default-userpic.png'
					},
					date: new Date(new Date(this.msg.createdAt).getTime()).toDateString() + ' ' +
						new Date(new Date(this.msg.createdAt).getTime()).toLocaleTimeString(),
					text: this.msg.message,
					atatchedFileURL: this.msg.documentCV ?
						this.msg.documentCV.documentFile ?
							this.msg.documentCV.documentFile.url :
							this.msg.documentCV.get('documentFile').url() :
						null
				};
				if (user.id === this.chatUser.id) {
					this.isSender = true;
				}
				this.isLoading = false;
			});
		} else if (changes.msg.currentValue.type) {
			this.message = {
				sender: {
					name: this.msg.sender.name,
					avatar: '../../../../../../assets/img/default-userpic.png'
				},
				date: this.msg.date,
				text: this.msg.text,
				atatchedFileURL: null
			};
			this.isSender = true;
			this.isLoading = false;
		}
	}
}
