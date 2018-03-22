import { Injectable } from '@angular/core';
import { ElementRef } from '@angular/core';
import { ParseObject } from 'parse';
import { Parse } from '../parse.service';
import * as _ from 'underscore';
import { BehaviorSubject } from 'rxjs';
import { environment } from './../../environments/environment';

@Injectable()
export class ChatService {
//tslint:disable

public datesArrayToDisplay: Array<any> = [];
node;    
previousScrollHeightMinusTop: number;    
readyFor: string;    
toReset: boolean = false; 

constructor(
  private _parse: Parse
) {}

    getUserMessages(data) {
        const params = { 
            dialogId: data.dialogId,
            pageNumber: data.pageNumber
        };
        return this._parse.execCloud('getMessages', params).then(result => {
          console.log(result);
          return result;
        });
    };

    createDatesArray (messages: Array<any>): Array<string> { // here we are creating filtered dates array to compare and also creating array 'datesArrayToDisplay' for displaying day of messages
        let datesArray = [];
        this.datesArrayToDisplay = [];
        messages.forEach(message => {
          let date: Date = message.get('createdAt').toLocaleDateString(); // this variable looks like '12.03.2018', so it's for comparing
          if (!datesArray.includes(date)) {
            datesArray.push(date);
            let newDate = this.createDate(message.get('createdAt')); // here we use function for creating date like 'Monday, July 12'
            this.datesArrayToDisplay.push(newDate); // here we pushing created date to datesArrayToDisplay
          }
        })
        datesArray =  _.sortBy(datesArray, function (date) { return date }).reverse(); // sorting array by dates from descending to ascending
        return datesArray;
      }
      
      createDate (date: Date): string {
        let newDate: string;
        let day = date.toLocaleString('en-us', {day: "numeric"}); // day looks like '12'
        let weekDay = date.toLocaleString('en-us', {weekday: "long"}); // weekDay as 'Monday'
        let month = date.toLocaleString('en-us', {month: "long"}); // month as 'July'
        return newDate = weekDay + ', ' + month + ' ' + day; // here we are concating 
      }

      checkPreviousAuthor (messages) { // checking previous and next author message
        let checkedMessagesByAthor = messages; // creating the array to iterate
        checkedMessagesByAthor.forEach(message => {
          const messagesArray = message[1].messages; // taking here the message array of one day, because day array looks like [{date: 'Moday, July 12'}, {messages: [messages]}], that's why we need to take only messages 
          for (let prev = -1, i = 0; i < messagesArray.length; ++prev, i++) {
            if (prev >= 0) {
              let previousMessageAuthor = messagesArray[prev].get('author').id; // taking previous message author id
              let currentMessageAuthor = messagesArray[i].get('author').id; // taking current message author id
              if (previousMessageAuthor === currentMessageAuthor) { // if previous and next message author id are the same, turning author name to undefined not to display avatar and author name
                  messagesArray[i].author = undefined; // turning author to undefined
              }
            }
          }
          return checkedMessagesByAthor;
        });
      }
    
      createMessagesArraySorted (messages, element) { // function that does everything and returns messages in the right way to display them
        return new Promise (resolve => {
          let messagesSorted = [];
          let datesArray = this.createDatesArray(messages); // creating filtered dates array to compare; creating array to display the dates in right format
          let i = 0;
          datesArray.forEach(date => { // iterating through dates array that looks like this: ['08.03.2018', '09.03.2018', '10.03.2018']
            let dateArray = []; // creating array for one date, for example '08.03.2018'
            let messagesArray = []; // creating array for messages for this date 
            dateArray.push({date: this.datesArrayToDisplay[i]}); // pushing right format date of this date  
            i++;
            for (let i = 0; i < messages.length; i++) { // iterating through all the messages that we recieved
              let messageDate = messages[i].get('createdAt').toLocaleDateString(); // making date of the message to compare, it will look like ('08.03.2018')
              if (messageDate === date) { // comparing message date to datesArray which was made for comparing 
                  messages[i].author = messages[i].get('author').get('firstName') + ' ' + messages[i].get('author').get('lastName'); // pushing author of the message check in the future the previous message author
                  messages[i].optionsHidden = false;
                  messages[i].editHidden = false;
                  messagesArray.push(messages[i]); // pushing message to array of this day messages
              };
            }
            messagesArray = messagesArray.reverse(); // reversing messages for right queue of displaying
            dateArray.push({messages: messagesArray}); // pushing messages of one day array to the date array which includes day to display and messages of one day
            messagesSorted.push(dateArray); // pushing one day messages to the all messages array
          });
          this.checkPreviousAuthor(messagesSorted);  // checking the whole messages array for the previous author
          messagesSorted = messagesSorted.reverse();
          resolve(messagesSorted);
          return messagesSorted  // reversing the array to display in right queue
        })
      }
    
      createTeamMember (params, queryParams): ChatTeamMember { // creating a team member object
        let teamMember;
        let undefinedAvatar = queryParams[0].charAt(0) + queryParams[1].charAt(0); // if undefined avatar - take first letter of the name and surname 
        let randomColor = '#' + Math.random().toFixed(20).substring(5,10); // random color of bg of undefined avatar
        return teamMember = {
          firstName: queryParams[0],
          lastName: queryParams[1],
          avatar: queryParams[2],
          sessionStatus: queryParams[3],
          id: params,
          undefinedAvatar: undefinedAvatar,
          background: randomColor
        };
      }

      scrollToBottom(element: ElementRef): void {
        try {
          setTimeout(() => {
            element.nativeElement.scrollTop = element.nativeElement.scrollHeight;
          }, 0);
        } catch (error) {}
      }

    getTeamMembers() { // just copied this piece from another component
      let team = [];
      let i = 0;
      const client = this._parse.getCurrentUser().get('Client_Pointer');
      let clientId;
      if (client) {
        clientId = this._parse.getCurrentUser().get('Client_Pointer').id;
      }
      const query = this._parse.Query('Clients');
      query.include('TeamMembers');
      return query.get(clientId).then(clientC => {
        clientC.get('TeamMembers').forEach(teamMember => {
          team[i] = {
            name: `${teamMember.get('firstName')}_${teamMember.get('lastName')}`,
            teamMemberPoint: teamMember.toPointer()
          };
          i++;
        });
        return (team);
      });
    }

    init(node) {    
      this.node = node;    
      this.previousScrollHeightMinusTop = 0;    
      this.readyFor = 'up';  
    }   
    restore() {    
      if(this.toReset) {    
          console.log("restore");   
           if (this.readyFor === 'up') {  
                this.node.scrollTop = this.node.scrollHeight - this.previousScrollHeightMinusTop;      
           }        
           this.toReset = false;    
      }  
    }  
    prepareFor(direction) {    
      this.toReset = true;    
      this.readyFor = direction || 'up'; 
      this.previousScrollHeightMinusTop = this.node.scrollHeight - this.node.scrollTop;  
    }

}
