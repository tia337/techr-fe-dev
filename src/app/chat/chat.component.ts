import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
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
export class ChatComponent implements OnInit {

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


  @ViewChild('messagesBlock') private messagesBlock: ElementRef;

  constructor(
    private _ar: ActivatedRoute,
    private _chatService: ChatService,
    private _coreService: CoreService,
    private _socket: Socket,
		private _parse: Parse    
  ) { }


  ngOnInit() {
    this._socket.connect();
    this.recieveCollegueMessage().subscribe(data => {
      console.log(data);
    })
    this._ar.params.subscribe(params => {
      this.dialogId = params.id;
      this.createQueryData(params.id).then(queryData => {
        let data = queryData;
        this._chatService.getUserMessages(data).then(messages => {
          console.log(messages.length);
          if (messages.length === 0) {
            this.beginning = true;
          }
          if (messages.length > 0) {
            this.noMessages = true;
            this.loader = true;
            this.beginning = false;
          };
          this.messageStorage = messages;
          this._chatService.createMessagesArraySorted(messages, this.messagesBlock).then(messages => {
            this.messages = messages;
            this.loader = false;
            this._coreService.clearMessagesCount(params.id);
          })
          this.scrollToBottom();
        });
      });   
    })
    this._ar.queryParams.subscribe(queryParams => {
      this.teamMemberQueryParams = queryParams;
      this.teamMember = this._chatService.createTeamMember(this.dialogId, this.teamMemberQueryParams);
    });
    this._chatService.getTeamMembers().then(team => this.teammates = team);
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
    console.log(this.messagesBlock.nativeElement.scrollTop);

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
                this.messages = messages;
                setTimeout(() => {
                  this.scrollAfterLoading(oldHeight);
                },0)
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
    console.log(oldHeight, ' old height');
    this.loadMessages = true;   
    this.loader = false;
    try {
      setTimeout(() => {
        let newHeight = this.messagesBlock.nativeElement.scrollHeight;
        let difference = newHeight - oldHeight;
        let newScroll = newHeight + difference;
        newScroll = newHeight + oldHeight + difference;
        newScroll = newScroll/difference;
        console.log(newScroll, 'coeefic')
        this.messagesBlock.nativeElement.scrollTop = (newHeight + oldHeight)/newScroll;
        console.log('difference= ', newHeight - oldHeight);
        console.log(newHeight, 'newA');
      },0)
    }  catch (error) {
      console.log('error');
    }
  }

  sendColleagueMessage (event) {
    this._socket.emit('outgoing-to-colleague', {
      'message': event.target.value,
      'dialogId': this.dialogId,
      'sender': this._parse.getCurrentUser().id,
      'type': 'AppChat'
    });
    setTimeout(() => {
      event.target.value = null;
    },0);
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
  
}
