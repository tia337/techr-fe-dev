import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { ChatService } from './chat.service';
import * as _ from 'underscore';

// tslint:disable
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  public messages: Array<any> = [];
  public teamMember: ChatTeamMember;
  public datesArray: Array<any>;

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
        this.datesArray = this.createDatesArray(messages);
        this.teamMember = this.createTeamMember(params, queryParams);
      })
    })
  }

  createDatesArray (messages: Array<any>) {
    let datesArray = [];
    messages.forEach(message => {
      let date: Date = message.get('createdAt').toLocaleDateString();
      if (!datesArray.includes(date)) {
        datesArray.push(date);
      }
    })
    datesArray =  _.sortBy(datesArray, function (date) { return date });
    return datesArray;
  }

  createTeamMember (params, queryParams): ChatTeamMember {
    let teamMember;
    return teamMember = {
      firstName: queryParams[0],
      lastName: queryParams[1],
      avatar: queryParams[2],
      sessionStatus: queryParams[3],
      id: params.id,
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
    datesArray.forEach(date => {
      let dateArray = [];
      // dateArray.push(date);
      for (let i = 0; i < messages.length; i++) {
        let messageDate = messages[i].get('createdAt').toLocaleDateString();
        if (messageDate === date) {
          dateArray.push(messages[i]);
        }
      }
      messagesSorted.push(dateArray);
    });
    return messagesSorted;
  }

}
