import { Injectable } from '@angular/core';

@Injectable()
export class StripeService {

  private _global;
  private _stripe;

  constructor() {
    this._global = window as any;
    this._stripe = this._global.Stripe('pk_test_DOxsBoIZIbzfu3y6EafzMDNU');
  }

  get stripe() {
    return this._stripe;
  }

}
