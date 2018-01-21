import { Component, OnInit } from '@angular/core';
import { ParseObject, ParsePromise } from 'parse';
import * as parse from 'parse';
import { Parse } from '../../parse.service';
import { Injectable } from '@angular/core';

@Injectable()

export class SubscriptionService{
    constructor(private _parse: Parse){

    }
    getActivePlan(subsctiption){
        console.log("test1");
        let query = this._parse.Query("Plans");
        console.log(subsctiption.get("PlanName"));
        query.equalTo("Name", subsctiption.get("PlanName"));
        console.log(subsctiption.get("PlanName"));
         return query.first().then(results => {
             console.log(results);
            return results.get("NameSwipeIn");  
        });
    }
    getSubscriptions(){
        let query = this._parse.Query("Plans");
        query.equalTo("Currency", "GBP");
        return query.find().then(results => {
            return results;  
        });
    }
    getTrialActive(){
        let query = this._parse.Query("Clients");
        query.equalTo("objectId", this._parse.getCurrentUser().get("Client_Pointer").id);
        return query.first();
    }
}

