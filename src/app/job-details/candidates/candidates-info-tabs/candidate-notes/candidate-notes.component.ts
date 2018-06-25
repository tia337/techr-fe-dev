import { Loading } from './../../../../shared/utils';
import { Observable } from 'rxjs/Observable';
import { Socket } from 'ng-socket-io';
import { Component, OnInit, Input, OnDestroy, ViewChild, ElementRef, Renderer, ViewEncapsulation } from '@angular/core';
import { CandidateNotesService } from './candidate-notes.service';
import { Parse } from '../../../../parse.service';
import { MatSelectModule } from '@angular/material';
import { MatButtonModule } from '@angular/material';
import { MatAutocompleteModule } from '@angular/material';
import { MentionModule } from 'angular2-mentions/mention';
import { CandidatesService } from '../../candidates.service';
import { HighlightTag } from 'angular-text-input-highlight';

@Component({
	selector: 'app-candidate-notes',
	templateUrl: './candidate-notes.component.html',
	styleUrls: ['./candidate-notes.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class CandidateNotesComponent implements OnInit, OnDestroy {

	private userId: string;
	private contractId: string;
	@ViewChild('uploadBtn') uploadBtn: ElementRef;

	note = '';
	notes = [];
	sortedNotes = [];
	chatUser = this._parse.getCurrentUser();
	candidate;
	owner;
	isWorking = 0;
	file;
	isInRoom: boolean;
	room: string;
	isPrivate = 'false';
	teammates: object[];
	hasMessages;
	private _subscriptions = [];

	tags: HighlightTag[] = [];

	tagClicked: HighlightTag;

	constructor(
		private _parse: Parse,
		private CandidateNotesService: CandidateNotesService,
		private _socket: Socket,
		private _candidatesService: CandidatesService,
		private _renderer: Renderer
	) { }

	ngOnInit() {
		this.contractId = this._candidatesService.contractId;
		const notesRoomSubscription = this.getRoom().subscribe(data => {
			this.room = data['room'];
			this.isInRoom = true;
		});
		const notesUpdatedSubscription = this.getNotesUpdated().subscribe(data => {
			if (!data['note'].IsPrivate || data['note'].Author.objectId === this.chatUser.id) {
				this.notes.unshift(data['note']);
				console.log(this.notes);
			}
			if (!this.hasMessages) {
				this.hasMessages = Loading.success;
			}
		});
		const notesIncomingSubscription = this.getNotesIncoming().subscribe(data => {
			if (!data['note'].IsPrivate || data['note'].Author.objectId === this.chatUser.id) {
				this.notes.unshift(data);
				console.log(this.notes);
			}
			if (!this.hasMessages) {
				this.hasMessages = Loading.success;
			}
		});

		const notesRemovedSubscription = this.getNotesRemoved().subscribe(data => {
			this.notes.find(checkNote);
			this.notes.indexOf(this.notes.find(checkNote));
			this.notes.splice(this.notes.indexOf(this.notes.find(checkNote)), 1);
			console.log(this.notes);
			function checkNote(note) {
				return note.objectId == data['noteId'];
			}
		});

		this._subscriptions.push(notesUpdatedSubscription);
		this._subscriptions.push(notesRoomSubscription);
		this._subscriptions.push(notesIncomingSubscription);
		this._subscriptions.push(notesRemovedSubscription);

		let userID = 'net';

		const userIdSubscription = this._candidatesService.userId.subscribe(userId => {
			this.hasMessages = Loading.loading;
			// Leaving the socket room
			if (userID && userID !== 'net') {
				this._socket.emit('leave-note', (this.contractId + userID));
			}

			if (!(userID === userId)) {
				userID = userId;
				this.userId = userId;
				this.CandidateNotesService.getTeamMembers().then(team => {
					this.teammates = team;
				});

				this.notes = [];
				this.sortedNotes = [];
				this.CandidateNotesService.getCandidate(userId).then(user => {
					this.candidate = user;
					this._socket.emit('start-noting', {
						'contract': this.contractId,
						'candidate': user.id
					});
					this.CandidateNotesService.getNotesHistory({
						lastNoteDate: new Date,
						typeNotes: 'old',
						contractID: this.contractId,
						candidateID: user.id
					}).then((notes) => {
						notes.forEach(note => {
							if (!note.IsPrivate || note.Author.id === this.chatUser.id) {
								this.sortedNotes = this.sortedNotes.concat(note);
							}
						});
						return (this.sortedNotes);
					}).then((notes) => {
						return this.CandidateNotesService.getContractApply(this.contractId, userId).then(applies => {
							this.sortedNotes = notes.concat(applies);
							return (this.sortedNotes);
						});
					}).then((notes) => {
						return this.CandidateNotesService.getScorecardScoring(this.contractId, userId).then(scores => {
							this.sortedNotes = notes.concat(scores);
							return (this.sortedNotes);
						});
					}).then((notes) => {
						this.CandidateNotesService.getUserList(this.contractId, userId).then(userList => {
							this.sortedNotes = notes.concat(userList);
							this.sortedNotes.sort(function compare(a, b) {
								const dateA = new Date(a.updatedAt);
								const dateB = new Date(b.updatedAt);
								return dateB.getTime() - dateA.getTime();
							});
							this.sortedNotes.forEach(note => {
								this.notes.push(note);
							});
							if (this.notes && this.notes[0]) {
								setTimeout(() => {
									this.hasMessages = Loading.success;
								}, 1000);
							} else {
								this.hasMessages = Loading.error;
							}
						});
					}).then(() => {
						this.CandidateNotesService.getContractOwner(this.contractId).then(owner => {
							console.log('owner', owner);
							this.owner = owner;
						});
					});
				});
			}
		});
		this._subscriptions.push(userIdSubscription);
	}

	ngOnDestroy() {
		if (this.userId && this.userId !== 'net') {
			this._socket.emit('leave-note', (this.contractId + this.userId));
		}
		this._socket.removeAllListeners('updated-note');
		this._socket.removeAllListeners('started-noting');
		this._socket.removeAllListeners('incoming-note');
		this._socket.removeAllListeners('remove-note');
		if (this.notes) {
			this.notes = [];
		}
		if (this.sortedNotes = []) {
			this.notes = [];
		}
		this._subscriptions.map(subscription => {
			subscription.unsubscribe();
		});
	}


	sendNote() {
		console.log('The user is in the room-', this.isInRoom, '- number : ', this.room);
		console.log(this._socket);
		if (this.isInRoom) {
			const tags = this.checkMentions(this.note, this.teammates);
			this._socket.emit('outgoing-note', {
				author: this.chatUser.id,
				candidate: this.userId,
				message: { message: this.note },
				client: this.owner.get('Client_Pointer').id,
				contract: this.contractId,
				roomName: this.room,
				isPrivate: this.isPrivate === 'true' ? true : false,
				TaggedColleagues: tags,
				notePipelineStage: localStorage.getItem('activeStage')
			});
			// this.addTags();
			this.note = '';
			this.isPrivate = 'false';
		}
	}

	checkMentions(text, team) {
		const tags = [];
		team.forEach(el => {
			if (text.includes(`@${el.name}`)) {
				if (!tags.includes(el.teamMemberPoint)) {
					tags.push(
						el.teamMemberPoint);
				}
			}
		});
		return tags;
	}
	getNotesUpdated() {
		const observable = new Observable(observer => {
			this._socket.on('updated-note', data => {
				observer.next(data);
			});
		});
		return observable;
	}

	getRoom() {
		const observable = new Observable(observer => {
			this._socket.on('started-noting', data => {
				observer.next(data);
			});
		});
		return observable;
	}

	getNotesIncoming() {
		const observable = new Observable(observer => {
			this._socket.on('incoming-note', data => {
				observer.next(data);
			});
		});
		return observable;
	}

	getNotesRemoved() {
		const observable = new Observable(observer => {
			this._socket.on('remove-note', data => {
				observer.next(data);
			});
		});
		return observable;
	}

	keypressHandler(event) {
		if (event.keyCode === 13 && event.shiftKey) {
			event.preventDefault();
			this.sendNote();
		} else if (event.keyCode === 13) {
		}
		this.addTags();
	}

	sendValue($event) {
		this.file = this._parse.File($event.target.files[0].name, $event.target.files[0]);
		this.file.save().then(() => {
			this.CandidateNotesService.createCVFile(this.file, $event.target.files[0].name).then((obj) => {
				this._socket.emit('outgoing-note', {
					author: this.chatUser.id,
					candidate: this.userId,
					message: { message: $event.target.files[0].name },
					client: this.owner.get('Client_Pointer').id,
					contract: this.contractId,
					roomName: this.room,
					attached: {
						objectId: obj.id
					}
				});
			});
		});
	}
	upload() {
		const event = new MouseEvent('click', { bubbles: true });
		this._renderer.invokeElementMethod(
			this.uploadBtn.nativeElement, 'dispatchEvent', [event]);
	}

	addTags() {
		this.tags = [];
		const matchMentions = /(@\w+) ?/g;
		let mention;
		while ((mention = matchMentions.exec(this.note))) {
			this.tags.push({
				indices: {
					start: mention.index,
					end: mention.index + mention[1].length
				},
				data: mention[1]
			});
		}
		// const matchHashtags = /(%\w+) ?/g;
		// let hashtag;
		// // tslint:disable-next-line;
		// while ((hashtag = matchHashtags.exec(this.note))) {
		// 	this.tags.push({
		// 		indices: {
		// 			start: hashtag.index,
		// 			end: hashtag.index + hashtag[1].length
		// 		},
		// 		cssClass: 'bg-pink',
		// 		data: hashtag[1]
		// 	});
		// }
	}

	addDarkClass(elm: HTMLElement) {
		if (elm.classList.contains('bg-blue')) {
			elm.classList.add('bg-blue-dark');
		} else if (elm.classList.contains('bg-pink')) {
			elm.classList.add('bg-pink-dark');
		}
	}

	removeDarkClass(elm: HTMLElement) {
		elm.classList.remove('bg-blue-dark');
		elm.classList.remove('bg-pink-dark');
	}
	get Loading() {
		return Loading;
	}
}
