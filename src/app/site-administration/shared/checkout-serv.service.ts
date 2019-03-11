import { Injectable } from '@angular/core';
import { Parse } from '../../parse.service';
import {BehaviorSubject} from 'rxjs/Rx';


@Injectable()

export class CheckoutServService {
curTarif: BehaviorSubject<string> = new BehaviorSubject<string>('');
curPrice: BehaviorSubject<number> = new BehaviorSubject<number>(0);
curCurrency: BehaviorSubject<string> = new BehaviorSubject<string>('');
monthlyPrice: BehaviorSubject<number> = new BehaviorSubject<number>(0);
curPayingPlan: BehaviorSubject<string> = new BehaviorSubject<string>('year');

constructor(
   private _parse: Parse
){

}

changeCurTarif(tarif){
    const query = new this._parse.Parse.Query('Plans');
    query.equalTo("IntervalString", this.curPayingPlan);
    query.equalTo("Currency", this.curCurrency);
    query.equalTo("NameSwipeIn", tarif);
    query.first().then(res=>{
        this.curTarif.next(res.get("NameSwipeIn"));
        this.curPrice.next(res.get("Amount"));
        this.curCurrency.next(res.get("Currency"));
        if(res.get("IntervalString") === 'year'){

        }
        return 
    });
}

setCurTarif(name: string, curr:any[]){
    this.curTarif.next(name);
    this.curPrice.next(curr[0]);
    this.curCurrency.next(curr[1]);
    console.log(name);
    // this._parse.Parse.Session.current().then(res=>{
    //     res.det("",);
    //     });
    }
createCartObj(tarif:string, currency: string, payingplan: string){
    return this._parse.Parse.Session.current().then(res=>{
        res.set("Subscriptions_Cart", {
            "tarif" : tarif,
            "currency" : currency,
            "payingplan" : payingplan
        });
        return res.save();
    });
}
setNewTarif(name:string){
    let newCartObj;
    this._parse.Parse.Session.current().then(res=>{
        newCartObj = res.get("Subscriptions_Cart");
        newCartObj.tarif = name;
        res.set("Subscriptions_Cart", newCartObj);
        res.save();
    });
}
setNewPayingPlan(name:string){
    let newCartObj;
    console.log(name);
    this._parse.Parse.Session.current().then(res=>{
        newCartObj = res.get("Subscriptions_Cart");
        newCartObj.payingplan = name;
        res.set("Subscriptions_Cart", newCartObj);
        console.log(res);
        res.save();
    });
}
getCartObj(){
    return this._parse.Parse.Session.current().then(res=>{
        return res.get("Subscriptions_Cart");
    }).then(result=>{
        this.curTarif.next(result.tarif);
        this.curPayingPlan.next(result.payingplan);
        this.curCurrency.next(result.currency);
        return console.log("cart Obj Success");
    });

}

}
