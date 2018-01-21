import { Injectable } from '@angular/core';
import { ParseObject }  from 'parse';
import { Parse } from '../parse.service';
import * as _ from 'underscore';

@Injectable()
export class CheckoutPageService {

  private _global;
  private _stripe;

  constructor(private _parse: Parse) {
    this._global = window as any;
    this._stripe = this._global.Stripe('pk_test_DOxsBoIZIbzfu3y6EafzMDNU');
   }

  get stripe() {
    return this._stripe;
  }

  getClient(){
    return this._parse.getCurrentUser().get("Client_Pointer").fetch();
  }

  getPlanId(interval:string, tarifName: string){
    let query = this._parse.Query("Plans");
    query.equalTo("IntervalString", interval);
    query.equalTo("Currency", "GBP");
    query.equalTo("NameSwipeIn", tarifName);
    return query.first().then(results => {
        return results.get("StripeIdPlan");  
    });
  }

  findPaidJobBoardsContr(){
    let conts: any[] = [];
    return this._parse.Parse.Session.current().then(res=>{
      return res.get("Shopping_Cart").paid;}).then(pc =>{
        for(let paid of pc){
          conts.push(paid.contract);
        }
        return conts;
      }).then(res=>{
        console.log("supertest1");
        console.log(_.uniq(res));
       return _.uniq(res);
      })
  }

  findPaidJobBoards(cont):any{
    console.log("supertest2");
    let matched: any[] = [];
    return this._parse.Parse.Session.current().then(res=>{
      return res.get("Shopping_Cart").paid;
    }).then(result=>{
      console.log("supertest3");      
      for (let res of result){
        if(res.contract === cont){
          if(res.JobBoardPrice.id){
            matched.push(res.JobBoardPrice.id);
          }else if(res.JobBoardPrice.objectId){
            matched.push(res.JobBoardPrice.objectId);          
          }
        }
      }
      console.log("supertest4");   
      console.log(matched);   
      return matched;
    }).then(match=>{
      console.log(match);
      let query = new this._parse.Parse.Query("JobBoardPrices");
      query.containedIn("objectId", match);
      query.include("JobBoard");
      console.log(query.find());      
      return query.find()}).then(rest=>{
      console.log(rest);
      return rest;
    });
  }

  getContract(id:string){
    console.log(id);
    let query = new this._parse.Parse.Query("Contract");
    query.equalTo("objectId", id);
    return query.first().then(res=>{
      console.log(res);
      return res;
    })
  }

  findFreeJobBoardsContr(){
    let conts: any[] = [];
    return this._parse.Parse.Session.current().then(res=>{
      return res.get("Shopping_Cart").free;}).then(fc =>{
        for(let free of fc){
          conts.push(free.contract);
        }
        return conts;
      }).then(res=>{
        console.log("supertest1");
        console.log(_.uniq(res));
       return _.uniq(res);
      })
  }

  findFreeJobBoards(cont){
    console.log("supertest2");
    let matched: any[] = [];
    return this._parse.Parse.Session.current().then(res=>{
      return res.get("Shopping_Cart").free;
    }).then(result=>{
      console.log("supertest3");      
      for (let res of result){
        if(res.contract === cont){
          if(res.jobBoard.jobBoard.id){
            matched.push(res.jobBoard.jobBoard.id);
          }else if(res.jobBoard.jobBoard.objectId){
            matched.push(res.jobBoard.jobBoard.objectId);          
          }
        }
      }
      console.log("supertest4");   
      console.log(matched);   
      return matched;
    }).then(match=>{
      console.log(match);
      let query = new this._parse.Parse.Query("JobBoards");
      query.containedIn("objectId", match);
      console.log(query.find());      
      return query.find()}).then(rest=>{
      console.log(rest);
      return rest;
    });
  }

  createPointer(objectClass, objectID) {
    let Foo = this._parse.Parse.Object.extend(objectClass);
    let pointerToFoo = new Foo();
    pointerToFoo.id = objectID;
    return pointerToFoo;
}

  doPaidJobBoardPushes(jobBoard, job, priceSelected){
    let priceSelectedObject = new this._parse.Parse.Query("JobBoardPrices");
    priceSelectedObject.equalTo("objectId", priceSelected.id);
    return priceSelectedObject.first().then(selectedPriceObj =>{
      let contract = new this._parse.Parse.Query("Contract");
      contract.equalTo("objectId", job);
      return contract.first().then(contractObj =>{
        var push =  new this._parse.Parse.Object("JobBoardPush");
        push.set('PriceSeleted', selectedPriceObj.toPointer());
        push.set('Author', this._parse.getCurrentUser().toPointer());
        push.set('Client', this._parse.getCurrentUser().get("Client_Pointer").toPointer());
        push.set('PushOnBoard', jobBoard);
        push.set('Job', contractObj.toPointer());
        push.set('Status', 1);
        return push.save().then(push => {
          return push;
        }, error => {
          console.log(error);
        });
      });
    });
  }

  doFreeJobBoardPushes(jobBoard, job){
    let contract = new this._parse.Parse.Query("Contract");
    let contractObject;
    let clientObject;
    contract.equalTo("objectId", job);
    return contract.first().then(contractObj =>{
      contractObject = contractObj;
      return this._parse.getCurrentUser().fetch();
      }).then(client=>{
      clientObject = client;
      var push =  new this._parse.Parse.Object("JobBoardPush");
      push.set('Author', this._parse.getCurrentUser().toPointer());
      push.set('Client', clientObject.get("Client_Pointer").toPointer());
      push.set('PushOnBoard', jobBoard.jobBoard);
      push.set('Job', contractObject.toPointer());
      push.set('Status', 1);
      return push.save().then(push => {
        console.log("success");
        return push;
      }, error => {
        console.log(error);
      });
    });
  }

  getErrorPushes(errorData, errorFreeData){
    console.log(errorData);
    console.log(errorFreeData);
    let errorPushData = errorData.concat(errorFreeData);
    let pushedIds: any[] = [];
    let errorLog: string = '';
    let successLog: string = '';
    let success: number = 0;
    let fail: number = 0;
    errorPushData.forEach(data => {
      pushedIds.push(data.jBPId);
    });
    const errorPushQuery =  new this._parse.Parse.Query("JobBoardPush");
    errorPushQuery.containedIn("objectId", pushedIds);
    errorPushQuery.include("PushOnBoard");
    return errorPushQuery.find().then(res=>{
      res.forEach(jbp=>{
        if(jbp.get('push_error')){
          fail += 1;
          this.unsetJBPush(jbp);
          errorLog += "<br>" + jbp.get("PushOnBoard").get("Name") + ' - ' + jbp.get("push_error");
        }else if(!jbp.get('push_error')){
          success += 1;
          successLog += '<br>' + jbp.get("PushOnBoard").get("Name");
        }
      });
      if(success>0){
        successLog = "<strong>Jobs successfully published: " + success + '</strong><br>' +
        'Congratulations! your jobs were successfully published on the following job boards: ' +
        successLog + "<br>";
      }
      if(fail>0){
        errorLog = "<strong>Jobs with errors: " + fail + "</strong>" + errorLog;
      }
      console.log(errorLog);
      errorLog = successLog + errorLog;
      return [errorLog, fail===0];
    })
  }

  unsetJBPush(jBP:ParseObject){
    const errorPushQuery =  new this._parse.Parse.Query("JobBoardPush");
    errorPushQuery.get(jBP.id).then(res=>{
      res.set("Status", 0);
      console.log(res);
      res.save();
    })
  }


}
