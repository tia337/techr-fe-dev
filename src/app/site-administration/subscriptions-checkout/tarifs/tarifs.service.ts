import { Injectable } from '@angular/core';
import { Parse } from '../../../parse.service';
import { CheckoutServService } from '../../shared/checkout-serv.service'


@Injectable()
export class TarifsService {

  constructor(private _parse: Parse, private _CheckoutServService: CheckoutServService) { 
    
  }
  getMonthlyPrice(){
      let query = this._parse.Query("Plans");
      query.equalTo("IntervalString", "month");
      query.equalTo("Currency", "GBP");
      query.equalTo("NameSwipeIn", this._CheckoutServService.curTarif.value);
      query.first().then(results => {
      this._CheckoutServService.monthlyPrice.next(results.get("Amount"));  
        });
    }
  getAnuallyPrice(){
      let query = this._parse.Query("Plans");
      query.equalTo("IntervalString", "year");
      query.equalTo("Currency", "GBP");
      query.equalTo("NameSwipeIn",this._CheckoutServService.curTarif.value);
      query.first().then(results => {
      this._CheckoutServService.curPrice.next(results.get("Amount"));  
        });
    }
  getAmountOfUsers(){
      return this._parse.getCurrentUser().fetch().then(res=>{
         return res.get("Client_Pointer");
      });
    }
}
