import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, QueryList, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { ChatService } from './chat.service';
import { MentionModule } from 'angular2-mentions/mention';
import * as _ from 'underscore';
import { Socket } from 'ng-socket-io';
import { reject } from 'q';
import { CoreService } from '../core/core.service';
import { Parse } from '../parse.service';


// tslint:disable
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, AfterViewInit, OnDestroy {

  public messages;
  public teamMember: ChatTeamMember;
  public datesArrayToDisplay: Array<any> = [];
  public dialogId: string;
  public loadMessages = true;
  public teamMemberParams;
  public teamMemberQueryParams;
  public messageStorage; 
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

  @ViewChild('messagesBlock') private messagesBlock: ElementRef;
  @ViewChild('messageBlock') private messageBlock: QueryList<any>;

  constructor(
    private _ar: ActivatedRoute,
    private _chatService: ChatService,
    private _coreService: CoreService,
    private _socket: Socket,
		private _parse: Parse    
  ) {  
    this._ar.params.subscribe(params => {
      this._socket.emit('enter-chat-room', {
        'dialogId': params.id 
      });
    })
  }


  ngOnInit() {
    this._socket.connect();

    this.recieveColleagueMessage().subscribe(data => {
      Object.defineProperty(data, 'className', {value: 'Message'});
      let message = this._parse.Parse.Object.fromJSON(data);
      this.messageStorage.unshift(message);
      this._chatService.createMessagesArraySorted(this.messageStorage, this.messageBlock).then(messagesSorted => {
        this.messages = messagesSorted;
        if (this.messagesBlock.nativeElement.scrollHeight - this.messagesBlock.nativeElement.scrollTop - this.messagesBlock.nativeElement.offsetHeight <= 20) {
          this.scrollToBottom();
        }
      });
    });

    this.listenToRecruiterColleagueTypes().subscribe(data => {
      this.checkIfTyping(data);
    });

    this._ar.params.subscribe(params => {
      this._socket.emit('leave-chat-room', {
        'dialogId': this.dialogId
      });
      this._socket.connect();
      this.dialogId = params.id;
      this._socket.emit('enter-chat-room', {
        'dialogId': this.dialogId 
      });
      this.createQueryData(params.id).then(queryData => {
        let data = queryData;
        this._chatService.getUserMessages(data).then(messages => {
          if (messages.length === 0 || messages.length <= 30) {
            this.beginning = true;
          };
          if (messages.length > 0) {
            this.noMessages = true;
            this.loader = true;
            this.beginning = false;
          };
          this.messageStorage = messages;
          this._chatService.createMessagesArraySorted(messages, this.messagesBlock).then(messages => {
            this.messages = messages;
            this.loader = false;
            this._coreService.clearMessagesCount(this.dialogId);
          })
          this.scrollToBottom();
        });
      });   
    })
    this._ar.queryParams.subscribe(queryParams => {
      this.teamMemberQueryParams = queryParams;
      this.teamMemberId = queryParams[4];
      this.teamMember = this._chatService.createTeamMember(this.dialogId, this.teamMemberQueryParams);
    });
    this._chatService.getTeamMembers().then(team => this.teammates = team);
  }

  ngAfterViewInit () {
    // this._chatService.init(this.messagesBlock.nativeElement);
    // let sub = this.messageBlock.changes.subscribe(data => {
    //     this._chatService.restore()
    // });
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
    if (this.loadMessages === true) {
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
              // this.loader = true;
              this.beginning = false;
              this.messageStorage = this.messageStorage.concat(messages);
              this._chatService.createMessagesArraySorted(this.messageStorage, this.messagesBlock).then(messages => {
                // this._chatService.prepareFor('up');
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
    // console.log(oldHeight, ' old height');
    this.loadMessages = true;   
    this.loader = false;
    try {
      setTimeout(() => {
        let newHeight = this.messagesBlock.nativeElement.scrollHeight;
        let difference = newHeight - oldHeight;
        let newScroll = newHeight + difference;
        newScroll = newHeight + oldHeight + difference;
        newScroll = newScroll/difference;
        // console.log(newScroll, 'coeefic')
        this.messagesBlock.nativeElement.scrollTop = (newHeight + oldHeight)/newScroll;
        // console.log('difference= ', newHeight - oldHeight);
        // console.log(newHeight, 'newA');
      },0)
    }  catch (error) {
      console.log('error');
    }
  }

  recieveCollegueMessage () {
    const observable = new Observable(observer => {
			this._socket.on('updated-from-colleague', data => {
				observer.next(data);
			});
		});
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

  sendColleagueMessage (event) {
    this._socket.emit('outgoing-to-colleague', {
      'message': event.target.value,
      'dialogId': this.dialogId,
      'sender': this._parse.getCurrentUser().id,
      'type': 'AppChat'
    });
    event.target.value = null;
  }

  recieveColleagueMessage () {
    const observable = new Observable(observer => {
      this._socket.on('updated-from-colleague', data => {
        observer.next(data);
      })
    })
    return observable;
  }

  RecruiterColleagueTypes () {
    console.log(this.teamMemberId);
    this._socket.emit('typing-message', {
      'dialogId': this.dialogId,
      'recipient': this.teamMemberId,
      'sender': this._parse.getCurrentUser().id
    })
  }

  listenToRecruiterColleagueTypes () {
    const observable = new Observable(observer => {
      this._socket.on('typing-message', data => {
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
  
  ngOnDestroy () {
    this._socket.emit('leave-chat-room', {
      'dialogId': this.dialogId
    });
    this._socket.disconnect();
  }
  
}
