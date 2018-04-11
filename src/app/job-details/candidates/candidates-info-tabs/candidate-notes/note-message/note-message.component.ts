import { Socket } from 'ng-socket-io';
import { CandidateNotesService } from './../candidate-notes.service';
import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Parse } from './../../../../../parse.service';

@Component({
	selector: 'app-note-message',
	templateUrl: './note-message.component.html',
	styleUrls: ['./note-message.component.scss']
})
export class NoteMessageComponent implements OnInit, OnChanges {

	@Input('note') private note;
	@Input('room') private room;
	chatUser = this._parse.getCurrentUser();
	isLoading = true;
	message = {
		sender: {
			name: '',
			avatar: ''
		},
		date: '',
		text: '',
		attachedFileURL: ''
	};
	isSender: boolean;
	isPrivate: boolean;
	isSystem = false;
	constructor(
		private CandidateNotesService: CandidateNotesService,
		private _parse: Parse,
		private _socket: Socket
	) { }

	ngOnInit() {
		const notesQuery = new this._parse.Parse.Query('CandidateNotes');
		notesQuery.equalTo('objectId', this.note.objectId);
		notesQuery.include('isReadByTaggedColleagues');
		notesQuery.find().then(result => {
			if (result.length > 0) {
				const taggedColleagues = result[0].attributes.TaggedColleagues;
				taggedColleagues.forEach(colleague => {
					if (colleague.id === this._parse.getCurrentUser().id) {
						const array = result[0].attributes.isReadByTaggedColleagues;
						if (array && !array.includes(this._parse.getCurrentUser().id)) {
							array.push(this._parse.getCurrentUser().id);
							result[0].set('isReadByTaggedColleagues', array);
							result[0].save();
							return;
						} else if (array === undefined) {
							result[0].set('isReadByTaggedColleagues', [this._parse.getCurrentUser().id]);
							result[0].save();
						}
					}
				});
			}
		});
	}

	ngOnChanges(changes: any) {
		if (typeof (changes.note.currentValue.Author) !== 'string') {
			this.CandidateNotesService.getCandidate(changes.note.currentValue.Author.objectId).then(user => {
				this.isPrivate = this.note.IsPrivate;
				this.message = {
					sender: {
						name: user.get('firstName'),
						avatar: user.get('avatarURL') ? user.get('avatarURL') : '../../../../../../assets/img/default-userpic.png'
					},
					date: new Date(new Date(this.note.updatedAt).getTime()).toDateString() + ' ' +
						new Date(new Date(this.note.updatedAt).getTime()).toLocaleTimeString(),
					text: this.note.Message,
					attachedFileURL: this.note.FileAttached ? (this.note.FileAttached.documentFile ?
						this.note.FileAttached.documentFile.url :
						this.note.FileAttached.get('documentFile').url()) : (null)
				};
				if (user.id === this.chatUser.id) {
					this.isSender = true;
				}
				this.isLoading = false;
			});
		} else {
			this.isSystem = true;
			this.message = {
				sender: {
					name: this.note.Author,
					avatar: '../../../../../../assets/img/swipein_user_icon.png'
				},
				date: new Date(new Date(this.note.updatedAt).getTime()).toDateString() + ' ' +
					new Date(new Date(this.note.updatedAt).getTime()).toLocaleTimeString(),
				text: this.note.Message,
				attachedFileURL: null
			};
			this.isLoading = false;
		}
	}
	updateStatus(note) {
		this.isPrivate = !this.isPrivate;
		this._socket.emit('update-note', {
			noteId: note.objectId,
			isPrivate: this.isPrivate,
			roomName: this.room
		});
		// const query = this._parse.Query('CandidateNotes');
		// query.get(note.objectId).then(noteC => {
		// 	if (noteC.get('IsPrivate')) {
		// 		noteC.set('IsPrivate', false);
		// 	} else {
		// 		noteC.set('IsPrivate', true);
		// 	}
		// 	noteC.save();
		// });
	}
}
