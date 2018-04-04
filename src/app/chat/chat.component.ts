import { Component, OnInit, ViewChild, ElementRef, Renderer, OnDestroy, HostListener, QueryList, AfterViewInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { ChatService } from './chat.service';
import { MentionModule } from 'angular2-mentions/mention';
import * as _ from 'underscore';
import { Socket } from 'ng-socket-io';
import { reject } from 'q';
import { CoreService } from '../core/core.service';
import { Parse } from '../parse.service';
import { AlertComponent } from '../shared/alert/alert.component';
import { RootVCRService } from '../root_vcr.service';
import { Router } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { stat } from 'fs';
import { FormControl } from '@angular/forms';
// tslint:disable
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy {

  public messages;
  public teamMember: ChatTeamMember;
  public datesArrayToDisplay: Array<any> = [];
  public userId: string;
  public dialogId: string;
  public loadMessages = true;
  public teamMemberParams;
  public teamMemberQueryParams;
  public messageStorage = [];
  public noMessages = false;
  public teammates = [];
  public loader: boolean;
  public beginning = false;
  public messagesRecievedStorage = [];
  public tempMessage: LooseObject = {};
  public teamMemberId: string;
  public typing = false;
  private timer;
  private newMessagesCount: number = 0;
  public jobMentionsHidden = true;
  public textAreaValue = new FormControl;
  public cursorHidden = true;
  public space = 'editable!';
  public sanitizedUrl; 
  public jobMentionsArray;
  public listenToChat = false;
  public currentJobId;
  public observer;
  private focusOffset: number;
  public placeholder: string;

  @ViewChild('messagesBlock') private messagesBlock: ElementRef;
  @ViewChild('messageBlock') private messageBlock: QueryList<any>;
  @ViewChild('messageInput') public messageTextArea: HTMLTextAreaElement;
  @ViewChild('jobMentions') public jobMentions: HTMLDivElement;
  @ViewChild('fakeCursor') private fakeCursor: HTMLSpanElement;
  @ViewChild('fakeInput') private fakeInput: ElementRef;
  
  constructor(
    private _ar: ActivatedRoute,
    private _chatService: ChatService,
    private _coreService: CoreService,
    private _socket: Socket,
    private _parse: Parse,
    private _root_vcr: RootVCRService,
    private _sanitizer: DomSanitizer,
    private _roter: Router,
    private _elRef: ElementRef,
    private _renderer: Renderer
  ) { }


  ngOnInit() {

    this.userId = this._parse.getCurrentUser().id;

    this.listenToDialogIdUpdated().subscribe(data => {
      console.log(data);
      this.updateDialogId(data);
      // this._chatService.updateDialogIdInCore(data);
    })

   
    this.editPartnersMessage().subscribe(data => {
      console.log(data);
      this.turnEditedMessage(data);
    });

    this.listeToDeletedMessage().subscribe(data => {
      this.deleteMessage(data);
    });

    this.recieveColleagueMessage().subscribe(data => {
      console.log(data);
      clearTimeout(this.timer);
      this.typing = false;
      if (this.dialogId != undefined) {
        this.addMessageToChat(data);
      }
    });

    this.listenToRecruiterColleagueTypes().subscribe(data => {
      console.log(data);
      this.checkIfTyping(data);
    });

    this._ar.params.subscribe(params => {   
      if (params.id === 'false') {
        this.messages = [];
        this.noMessages = false;
        this.beginning = true;
        this.dialogId = params.id;
        return;
      } else {
        this.dialogId = params.id;
        this.setDialogIdToLocalStorage(params);
        this.getMessages(params);
      }
    });

    this._ar.queryParams.subscribe(queryParams => {
      this.teamMemberQueryParams = queryParams;
      this.teamMemberId = queryParams[4];
      this.teamMember = this._chatService.createTeamMember(this.dialogId, this.teamMemberQueryParams);
      this.placeholder = "Message " + this.teamMember.firstName + ' ' + this.teamMember.lastName;
      console.log(this.placeholder);
    });

    this._chatService.getTeamMembers().then(team => this.teammates = team);
    this.clearMessagesCount();
    
    this.getTeamMemberOnline().subscribe(data => {
        this.teamMember.sessionStatus = 'true';
    });
    this.getTeamMemberOffline().subscribe(data => {
        this.teamMember.sessionStatus = 'false';
    });
    this.recieveJobTags().subscribe(data => {
      console.log(data);
      this.jobMentionsArray = data;
    });
    this.textAreaValue.setValue('');
  }

  setDialogIdToLocalStorage (params) {
    if (!localStorage.getItem('chatRoom')){
      localStorage.setItem('chatRoom', params.id);
      this._socket.emit('enter-chat-room', {
        dialogId: params.id
      });
      return;
    } else {
      let dialogIdToLeave = localStorage.getItem('chatRoom');
      this._socket.emit('leave-chat-room', {
        dialogId: dialogIdToLeave
      });
      localStorage.setItem('chatRoom', params.id);
      this._socket.emit('enter-chat-room', {
        dialogId: params.id
      });
    }
  }

  getMessages(params){
    this.createQueryData(params.id).then(queryData => {
      let data = queryData;
      this._chatService.getUserMessages(data).then(messages => {
        if (messages.length > 0) {
          this.noMessages = true;
          this.loader = true;
          this.beginning = false;
          this.messageStorage = messages;
          this._chatService.createMessagesArraySorted(messages, this.messagesBlock).then(messages => {
            this.messages = messages;
            this.loader = false;
            this._coreService.clearMessagesCount(this.dialogId);
          });
          this.scrollToBottom();
        };
        if (messages.length <= 30) {
          this.beginning = true;
        };
      });
    });
  }

  createQueryData (dialogId) {
    return new Promise(resolve => {
      localStorage.setItem(dialogId, '0')
        let data = {
          dialogId: dialogId,
          pageNumber: 0
        }
        resolve(data);
    })
  }

  createQueryDataForScroll (dialogId) {
    return new Promise(resolve => {
        let data = {
          dialogId: dialogId,
          pageNumber: parseFloat(localStorage.getItem(dialogId))
        }
        resolve(data);
    })
  }

  updatePageNumber (number) {
    localStorage.setItem(this.dialogId, number.toString())
  }

  onScrollUp (event) {
    const oldHeight = this.messagesBlock.nativeElement.scrollHeight;
    if (this.loadMessages === true && this.dialogId !== 'false') {
      if (event.target.scrollTop === 0) {
        this.loadMessages = false;
        let data;
        this.createQueryDataForScroll(this.dialogId).then(queryData => {
          data = queryData;
          let number = data.pageNumber + 1;
          data.pageNumber = number;
          this.updatePageNumber(number);
          this._chatService.getUserMessages(data).then(messages => {
            if (messages.length === 0) {
              this.loadMessages = false;
              this.loader = false;
              this.beginning = true;
              return;
            } else {
              this.beginning = false;
              this.messageStorage = this.messageStorage.concat(messages);
              this._chatService.createMessagesArraySorted(this.messageStorage, this.messagesBlock).then(messages => {
                this.messages = messages;
                this.scrollAfterLoading(oldHeight);
              })
            }
          });
        });
      }
    } else {
      return;
    }
  }

  scrollAfterLoading (oldHeight) {
    this.loadMessages = true;
    this.loader = false;
    try {
      setTimeout(() => {
        let newHeight = this.messagesBlock.nativeElement.scrollHeight;
        let difference = newHeight - oldHeight;
        let newScroll = newHeight + difference;
        newScroll = newHeight + oldHeight + difference;
        newScroll = newScroll/difference;
        this.messagesBlock.nativeElement.scrollTop = (newHeight + oldHeight)/newScroll;
      },0)
    }  catch (error) {
      console.log('error');
    }
  }

  sendColleagueMessage (value, event) {
    event.preventDefault();
    console.log(value.value);
    if (value.value != '') {
      event.preventDefault();
      this._socket.emit('outgoing-to-colleague', {
        message: encodeURIComponent(value.value),
        sender: this._parse.getCurrentUser().id,
        dialog: this.dialogId,
        recipientId: this.teamMemberId,
        type: 'AppChat'
      }).then(this.textAreaValue.setValue(''));
    };
    if (value.value === '') {
      event.preventDefault();
    };
  }

  recieveColleagueMessage () {
    const observable = new Observable(observer => {
      this._socket.on('updated-from-colleague', data => {
        observer.next(data);
      })
    });
    return observable;
  }

  addMessageToChat (data) {
    this._coreService.closeTypingStatus(this.teamMemberId);
    Object.defineProperty(data, 'className', {value: 'Message'});
    let message = this._parse.Parse.Object.fromJSON(data);
    if (this.dialogId === 'false') {
      this.messageStorage = [];
      this.messages = [];
      this.messageStorage.push(message);
      console.log('FALSE');
      console.log(this.messageStorage);
      this.noMessages = true;
    } else {
      console.log('MESSAGE STORAGE EXISTS');
      this.messageStorage.unshift(message);
    }
    this._chatService.createMessagesArraySorted(this.messageStorage, this.messageBlock).then(messagesSorted => {
      this.messages = messagesSorted;
      if (this.messagesBlock.nativeElement.scrollHeight - this.messagesBlock.nativeElement.scrollTop - this.messagesBlock.nativeElement.offsetHeight <= 20) {
        this.scrollToBottom();
      };
    });
  }

  RecruiterColleagueTypes () {
    this._socket.emit('typing-message', {
      dialogId: this.dialogId,
      sender: this._parse.getCurrentUser().id,
      recipient: this.teamMemberId
    })
  }

  listenToRecruiterColleagueTypes () {
    const observable = new Observable(observer => {
      this._socket.on('typing-message-listen', data => {
        observer.next(data);
      })
    })
    return observable;
  }

  checkIfTyping (data) {
    if (data.sender === this.teamMemberId) {
      this.typing = true;
    };
    if (this.timer != undefined) {
      clearTimeout(this.timer);
    };
    const self = this;
    this.timer = setTimeout(function () {
      self.typing = false;
    }, 7000);
  }

  editMessage (value, message, encodedValue) {
    console.log(value, encodedValue);
    if (value === this.decodeMessageForEditing(message.get('message'))) {
      message.editHidden = false;
    }
    console.log(Object.getOwnPropertyNames(message));
    if (value !== message.get('message') && value != "") {
      message.set('message', value);
        message.isEdited = true;
      message.editHidden = false;
      this._socket.emit('edit-message', {
        dialogId: this.dialogId, 
        messageId: message.id, 
        message: value
      });
    }
    if (value === '') {
      this.alertDeleteMessage(message, value);
    }
  }

  editPartnersMessage () {
    const observable = new Observable(observer => {
      this._socket.on('message-edited', data => {
        observer.next(data);
      })
    })
    return observable;
  }

  turnEditedMessage(data) {
    this.messages.forEach(message => {
      let day = message[1].messages;
      day.forEach(message => {
        if (message.id === data.objectId) {
          message.isEdited = true;
          message.set('message', data.message);
        }
      })
    })
  }

  alertDeleteMessage (message, value) {
    const alert = this._root_vcr.createComponent(AlertComponent);
    alert.title = "Delete message"
    alert.content = `
    <p style="margin-bottom: 10px; font-size: 18px;">Are you sure you want to delete this message? This cannot be undone.</p>
    <div style="display: flex;padding: 10px;border: 1px solid;border-radius: 5px; width: 100%;">
      <div style="display: flex;align-items: center;justify-content: center;">
        <img style="border-radius: 3px;margin-right: 10px; max-width: 50px;" src="` + message.get('author').get('avatarURL') + `" alt="">
      </div>
    <div style="display: flex;flex-direction: column;justify-content: space-between; width:93%">
        <div style="display: flex; height: 50%;">
          <span style="margin-right: 10px; font-weight-bold">` + message.get('author').get('firstName') + ` ` +  message.get('author').get('lastName') + `</span>
          <span>` + message.get('createdAt') + `</span>
        </div>
        <p class="message-block-text" style="min-height: 50%;max-height:50%; white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">` + this.decodeMessage(message.get('message')) + ` </p>
      </div>
    </div>
    `;
    alert.addButton({
      type: 'primary',
      title: 'Cancel',
      onClick: () => {
        this._root_vcr.clear();
        if (value !== '') {
          message.editHidden = false;
        }
      }
    })
    alert.addButton({
      type: 'warn',
      title: 'Delete',
      onClick: () => {
        this.deleteMessage(message);
      }
    })
  }

  deleteMessage (data) {
    this.messages.forEach(message => {
      let dayMessages = message[1].messages;
      for (let next = 1, i = 0; i < dayMessages.length; ++next, i++) {
        if (dayMessages[i].id === data.id || dayMessages[i].id === data.objectId) {
          if (dayMessages[next] != undefined) {
            let nextMessageAuthor = dayMessages[next].author;
            let currentMessageAuthor = dayMessages[i].author;
            if (nextMessageAuthor === undefined) {
              dayMessages[next].author = currentMessageAuthor;
            }
          }
          dayMessages.splice(dayMessages.indexOf(dayMessages[i]), 1);
          this._root_vcr.clear();
        };
      }
    });
    this._socket.emit('delete-message', { 
      dialogId: this.dialogId, 
      messageId: data.id
    });
  }

  listeToDeletedMessage () {
    const observable = new Observable(observer => {
      this._socket.on('message-deleted', data => {
        observer.next(data);
      })
    })
    return observable;
  }

  listenToDialogIdUpdated() {
    const observable = new Observable(observer => {
      this._socket.on('dialog-created', data => {
        observer.next(data);
      })
    })
    return observable;
  }

  scrollToBottom(): void {
    try {
      setTimeout(() => {
        this.messagesBlock.nativeElement.scrollTop = this.messagesBlock.nativeElement.scrollHeight;
        this.loadMessages = true;
      }, 0);
    } catch (error) {}
  }


  clearMessagesCount () {
    this._coreService.clearMessagesCount(this.dialogId);
  }

  getTeamMemberOnline() {
		const observable = new Observable(observer => {
			this._socket.on('teamMemberOnline', data => {
				observer.next(data);
			});
		});
		return observable;
	};

	getTeamMemberOffline() {
		const observable = new Observable(observer => {
			this._socket.on('teamMemberOffline', data => {
				observer.next(data);
			});
		});
		return observable;
  };
  
  decodeMessage (message: string) {
    let messageDecoded;
    messageDecoded = decodeURIComponent(message);
    return messageDecoded;
  }

  decodeMessageForEditing (message: string) {
    let messageDecoded;
    messageDecoded = decodeURIComponent(message.replace(/%0A/g, '\n'));
    return messageDecoded;
  }

  encodeMessage(message: string) {
    let messageEncoded;
    messageEncoded = encodeURIComponent(message);
    return messageEncoded;
  }

  updateDialogId(data) {
    this.dialogId = data.dialog;
    let url = '/chat' + data.dialog + '?0=' + this.teamMember.firstName + '&1=' + this.teamMember.lastName + '&2=' + this.teamMember.avatar + '&3=' + this.teamMember.sessionStatus + '&4=' + this.teamMember.id;
    window.history.pushState('object', 'title', url);
  }
  getJobTags() {
    let data = {};
    this.jobMentionsHidden = false;    
    this._socket.emit('get-job-tags', data);
  };

  recieveJobTags () {
    const observable = new Observable(observer => {
			this._socket.on('job-tags-found', data => {
				observer.next(data);
			});
		});
		return observable;
  }

  addJobMentionLink (jobId: string, jobTitle: string, value: string) {
      const self = this;
      const randomId = Math.random().toString(2);
      this.textAreaValue.setValue(this.textAreaValue.value + '<a class="job-link ' + jobId + '" href="javascript:void(0)">'+ jobTitle +'</a>');
      setTimeout(()=> {
        const array = document.getElementsByClassName(jobId);
        for (let i = 0; i < array.length; i++) {
          array[i].addEventListener('click', (event)=> {
              event.preventDefault();
              self.redirectToJob(jobId);
            });
        };  
            this._renderer.invokeElementMethod(this.fakeInput.nativeElement, 'focus');
            const element = array[array.length-1];
            const input = document.getElementById('chat-input');
            const sel = window.getSelection();
            let range = sel.getRangeAt(0);
            range.deleteContents();
            var frag = document.createDocumentFragment(), node, lastNode;
            while ( (node = input.firstChild) ) {
                lastNode = frag.appendChild(node);
            }
            range.insertNode(frag);
            if (lastNode) {
                range = range.cloneRange();
                range.setStartAfter(lastNode);
                range.collapse(true);
                sel.removeAllRanges();
                sel.addRange(range);
            };
      }, 4);
      this.jobMentionsHidden = true;
  }

  sanitizeUrl(url:string) {
    return this._sanitizer.bypassSecurityTrustHtml(url);
  }  

  redirectToJob(jobId) {
    this._roter.navigate(['/jobs', jobId]);
  }

  watch(event) {
    // console.log(document.getSelection().getRangeAt(0).startOffset);
    if (event.key === "#") {
      this.getJobTags();
    }
  }

  ngOnDestroy () {
    this._socket.emit('leave-chat-room', {
      'dialogId': this.dialogId
    });
    this._coreService.removeHighlighter(this.teamMemberId);
  }

}
