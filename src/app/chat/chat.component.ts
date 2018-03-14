import { Component, OnInit, Input, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { ChatService } from './chat.service';
import { MentionModule } from 'angular2-mentions/mention';

import * as _ from 'underscore';

// tslint:disable
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, AfterViewChecked {

  public messages: Array<any> = [];
  public teamMember: ChatTeamMember;
  public datesArray: Array<any> = [];
  @ViewChild('messagesBlock') private messagesBlock: ElementRef;
  constructor(
    private _ar: ActivatedRoute,
    private _chatService: ChatService
  ) { }

  ngOnInit() {
    Observable
      .combineLatest(this._ar.params, this._ar.queryParams)
      .subscribe(([params, queryParams])=> {
      this._chatService.getUserMessages(params.id).then(messages => {
        this.messages = this.createMessagesArraySorted(messages);
        this.teamMember = this.createTeamMember(params, queryParams);
      });
    })
  }

  ngAfterViewChecked() {
    // this.scrollToBottom();
  }

  createDatesArray (messages: Array<any>): Array<string> {
    let datesArray = [];
    messages.forEach(message => {
      let date: Date = message.get('createdAt').toLocaleDateString();
      if (!datesArray.includes(date)) {
        datesArray.push(date);
        let newDate = this.createDate(message.get('createdAt'));
        this.datesArray.push(newDate);
      }
    })
    datesArray =  _.sortBy(datesArray, function (date) { return date }).reverse();
    return datesArray;
  }

  createTeamMember (params, queryParams): ChatTeamMember {
    let teamMember;
    let undefinedAvatar = queryParams[0].charAt(0) + queryParams[1].charAt(0);
    console.log(queryParams[0].charAt(0), queryParams[1].charAt(0));
    let randomColor = '#' + Math.random().toFixed(20).substring(5,10);
    return teamMember = {
      firstName: queryParams[0],
      lastName: queryParams[1],
      avatar: queryParams[2],
      sessionStatus: queryParams[3],
      id: params.id,
      undefinedAvatar: undefinedAvatar,
      background: randomColor
    };
  }

  createDate (date: Date): string {
    let newDate: string;
    let day = date.toLocaleString('en-us', {day: "numeric"});
    let weekDay = date.toLocaleString('en-us', {weekday: "long"});
    let month = date.toLocaleString('en-us', {month: "long"});
    return newDate = weekDay + ', ' + month + ' ' + day;
  }

  createMessagesArraySorted (messages: Array<any>) {
    let messagesSorted = [];
    let datesArray = this.createDatesArray(messages);
    let i = 0;
    datesArray.forEach(date => {
      let dateArray = [];
      let messagesArray = [];
      dateArray.push({date: this.datesArray[i]});
      i++;
      for (let i = 0; i < messages.length; i++) {
        let messageDate = messages[i].get('createdAt').toLocaleDateString();
        if (messageDate === date) {
            messages[i].author = messages[i].get('author').get('firstName') + ' ' + messages[i].get('author').get('lastName');
            messagesArray.push(messages[i]);
        };
        // if (messages[i].get('au').toLocaleDateString())
      }
      messagesArray = messagesArray.reverse();
      dateArray.push({messages: messagesArray});
      messagesSorted.push(dateArray);
    });
    this.scrollToBottom();
    this.checkMessagesQueue(messagesSorted);    
    return messagesSorted = messagesSorted.reverse();
  }

  checkMessagesQueue (messages) {
    let newMessages = [];
    newMessages = messages;
    newMessages.forEach(message => {
      const oneMessage = message[1].messages;
      for (let prev = -1, i = 0; i < oneMessage.length; ++prev, i++) {
        if (prev >= 0) {
          let previousMessageAuthor = oneMessage[prev].get('author').id;
          let currentMessageAuthor = oneMessage[i].get('author').id;
          if (previousMessageAuthor === currentMessageAuthor) {
              oneMessage[i].author = undefined;
          }
        }
      }
      return newMessages;
    });
  }

  onScrollUp () {
    console.log('scrolled');
  }

  scrollToBottom(): void {
    try {
      setTimeout(() => {
        this.messagesBlock.nativeElement.scrollTop = this.messagesBlock.nativeElement.scrollHeight;
      }, 0);
    } catch (error) {}
  }

}
