import { Injectable } from '@angular/core';
import { Parse } from '../../../parse.service';

@Injectable()
export class BillingPaymentDetailsService {

  constructor(private _parse: Parse) { }

  getCurrentClient(): any {
    return this._parse.Parse.User.current().get('Client_Pointer').fetch();
  }

  getStripeCustomer(customerId: string) {
    return this._parse.Parse.Cloud.run('getStripeCustomer', {customerId: customerId});
  }

}
