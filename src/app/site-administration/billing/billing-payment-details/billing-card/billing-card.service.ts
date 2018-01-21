import { Injectable } from '@angular/core';
import { Parse } from '../../../../parse.service';
import { ParsePromise } from 'parse';

@Injectable()
export class BillingCardService {

  constructor(private _parse: Parse) { }

  removeCard(cardId: string): ParsePromise {
    return this._parse.Parse.Cloud.run('stripeRemoveCard', {cardId: cardId});
  }

  setToDefault(cardId: string) {
    return this._parse.Parse.Cloud.run('stripeUpdateCustomer', {
      args: { default_source: cardId }
    });
  }

}
