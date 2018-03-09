import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { ChatService } from './chat.service';

// tslint:disable
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  public params;
  public messages;

  constructor(
    private _ar: ActivatedRoute,
    private _chatService: ChatService
  ) { }

  ngOnInit() {
    this._ar.params.subscribe((params: { id: string })=> {
      this.params = params.id;
      this._chatService.getUserMessages(params).then(data => this.messages = data);
    })
  }

}
