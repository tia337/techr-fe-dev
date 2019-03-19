import { Injectable } from '@angular/core';
import { Parse } from '../../../../../parse.service';
import { ParseObject, ParsePromise } from 'parse';

@Injectable()
export class UpdateCardService {

  constructor(private _parse: Parse) { }

  updateCard(cardId: string, cardDetailsObject: any): any {
    return this._parse.Parse.Cloud.run('stripeUpdateCard', {
      cardId: cardId,
      cardOptions: cardDetailsObject
    });
  }

}
