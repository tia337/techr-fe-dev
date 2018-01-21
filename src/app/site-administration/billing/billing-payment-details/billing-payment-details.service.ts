import { Injectable } from '@angular/core';
import { Parse } from '../../../parse.service';
import { ParsePromise } from 'parse';

@Injectable()
export class BillingPaymentDetailsService {

  constructor(private _parse: Parse) { }

  getCurrentClient(): ParsePromise {
    return this._parse.Parse.User.current().get('Client_Pointer').fetch();
  }

  getStripeCustomer(customerId: string) {
    return this._parse.Parse.Cloud.run('getStripeCustomer', {customerId: customerId});
  }

}
