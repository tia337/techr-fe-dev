import { Injectable } from '@angular/core';
import { environment } from './../../../environments/environment';

@Injectable()
export class StripeService {

  private _global;
  private _stripe;

  constructor() {
    this._global = window as any;
    this._stripe = this._global.Stripe(environment.STRIPE_KEY);
  }

  get stripe() {
    return this._stripe;
  }

}
