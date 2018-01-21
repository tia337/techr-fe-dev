import { Injectable } from '@angular/core';
import { Parse } from '../../parse.service';

@Injectable()
export class UpgradeDataService {

  private _currentTarif: any;

  constructor(
    private _parse: Parse
  ) { }

  set currentTarif(tarif:string){
    this._currentTarif = tarif;
    console.log(this._currentTarif);
    this.setNewTarifSC(tarif);
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

  setNewTarifSC(name:string){
    this._currentTarif = name;
    let newCartObj;
    return this._parse.Parse.Session.current().then(res=>{
        newCartObj = {"tarif" : name,
        "currency" : '',
        "payingplan" : ''}
        res.set("Subscriptions_Cart", newCartObj)
        return res.save();
    }).then(result=>{
      return "success";
    })
} 
  
  get currentTarif(){
    if(this._currentTarif){
      return this._currentTarif;
    }else{
      return this.getSurTarifSC().then(res=>{
        console.log(res);
        return res;
      })
    }
    
  }
  getSurTarifSC(){
    return this._parse.Parse.Session.current().then(res=>{
        return res.get("Subscriptions_Cart");
    }).then(result=>{
        this._currentTarif = result.tarif;
        return result.tarif;
    });
  }

  getSC(){
    return this._parse.Parse.Session.current().then(res=>{
      return res.get("Subscriptions_Cart");
     });  
  }

}
