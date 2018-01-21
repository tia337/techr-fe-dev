import { Injectable } from '@angular/core';
import { ParseObject, ParsePromise } from 'parse';
import * as parse from 'parse';
import { Parse } from '../../parse.service';

@Injectable()

export class IntegrationService{

Parse;

constructor(private _parse: Parse){  
}    

getButtons(){
    var query = this._parse.Query("IntegrationCategories");
    return query.find().then(function(results){
        return results;    
        });
    }
getCategoryIntegrations(categoryObject?: ParseObject): ParsePromise{
    let query = this._parse.Query("Integrations");
    if (categoryObject) {
        query.equalTo("Integration_Category", categoryObject);
        }
    query.equalTo("is_Visible", true);
    return query.find().then(results => {
        console.log(results);
        return results;  
        });
    }
    
getIntegCompanies(clientId:string){
    let query = this._parse.Query("Clients");
    query.equalTo("objectId", clientId);
    return query.first().then(results =>{
        return results.get("Active_Integrations");
        });
    }
getAccessLevel(){
        this._parse.Parse.User.current().fetch().then(res=>{
            console.log(res.get("HR_Access_Level"));
        });
        console.log(this._parse.getCurrentUser());
        return this._parse.getCurrentUser().get("HR_Access_Level");
        
    }
}

