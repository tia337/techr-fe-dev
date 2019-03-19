import { Component, OnInit } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IntegrationService } from './app-integrations.service';
import { Parse } from '../../parse.service';
import { AlertComponent } from '../../shared/alert/alert.component';
import { RootVCRService } from '../../root_vcr.service';

import { FeedbackAlertComponent } from 'app/core/feedback-alert/feedback-alert.component';
import { ContactUsComponent } from "app/contact-us/contact-us.component";

@Component({
  selector: 'app-app-integrations',
  templateUrl: './app-integrations.component.html',
  styleUrls: ['./app-integrations.component.scss']
})

export class AppIntegrationsComponent implements OnInit {

companies: any[];
integCompanies: any[];
Parse;
accessLevel: number;
admins: any[];
adminsList: string;
notEmptyCateg: any[] = [];
selectedCat: string;

ngOnInit() {
  this.getAdmins();
  this.selectedCat = 'All';
  this.accessLevel = this._testService.getAccessLevel();
  this._testService.getButtons().then(result => {
    this.hasItems(result);
   });
  this._testService.getIntegCompanies(this._parse.getCurrentUser().get('Client_Pointer').id).then(result=>{
    this.integCompanies = result
  });
  this._testService.getCategoryIntegrations().then(result => {
    this.companies = result;
  });

}

constructor(
  private _testService:IntegrationService,
  private _parse: Parse, 
  private _root_vcr:RootVCRService ){
  
}

getActiveIntegrations():any[]{
  return this._parse.getCurrentUser().get('Client_Pointer').get('Active_Integrations');
}

isIntegrated(company:any){
  if(this.integCompanies){
    for(let int of this.integCompanies){
      if(int.equals(company)){
        return true;
      }
    }
  }
}

hasItems(categories: any[]){
  for(let categoryObj of categories){
    this._testService.getCategoryIntegrations(categoryObj).then((comp)=>{
      if(comp.length>0){
        this.notEmptyCateg.push(categoryObj);
      }
    });
  }
}

getID(categoryObj?: any){
  this._testService.getCategoryIntegrations(categoryObj).then((comp)=>{
    this.companies = comp;
  });
  if(categoryObj){
    this.selectedCat = categoryObj.get('Category');
  }else{
    this.selectedCat = 'All';
  }
  
}

doIntegrate(integCompany: any){
  const client = this._parse.getCurrentUser().get("Client_Pointer");
  if(this.isIntegrated(integCompany) == true){
    client.remove("Active_Integrations", integCompany);
    client.save();
  }else{
    client.addUnique("Active_Integrations", integCompany);
    client.save();
  }
  this._testService.getIntegCompanies(this._parse.getCurrentUser().get('Client_Pointer').id).then(result=>{
    this.integCompanies = result});
  }
getAdmins(){
  this._parse.Parse.User.current().get("Client_Pointer").fetch().then(client=>{
    console.log(client);
    this.admins = [];
    this._parse.Parse.Object.fetchAllIfNeeded(client.get("TeamMembers")).then(teamMembers=>{
      console.log(teamMembers);
    for(let teamMember of teamMembers){
      console.log(teamMember.get("HR_Access_Level"));
      if(teamMember.get("HR_Access_Level") === 1){
        this.admins.push(teamMember);
      }
      console.log(this.admins);
      if( this.admins.length > 1){
       this.adminsList = this.admins[0].get('firstName') + ' ' + this.admins[0].get('lastName') + ' or ' + this.admins[1].get('firstName') + ' ' + this.admins[1].get('lastName');
      }else{
        this.adminsList = this.admins[0].get('firstName') + ' ' + this.admins[0].get('lastName');
      }
    }
    });
  });
}

accessCheck(com){
  console.log(this.admins);
  console.log(this.accessLevel);
    if(this.accessLevel == 1 ){
      
      this.doIntegrate(com)
    }else if(this.accessLevel > 1){
      const alert = this._root_vcr.createComponent(AlertComponent);
    alert.title = 'Access level Required';
    alert.icon = 'lock';
    alert.type = "sad";
    alert.contentAlign = 'left';
    alert.content = `<a style = "white-space:nowrap">Hi, ` + this._parse.Parse.User.current().get('firstName') + `. You need to be site admin in order to integrate your company's profile with apps.</a><br><a style = "white-space:nowrap"><strong>` +
     this.adminsList + `</strong> can set you up as a site admin if needed.</a>` +
      `<a style = "white-space:nowrap">Contact SwipeIn if you need urgent access to App Integrations.</a><br><a style = "white-space:nowrap">And if you can't integrate your company's profile with apps.</a>`;

    // alert.content = `
      
    // `;
    alert.addButton({
      title: 'Contact SwipeIn',
      type: 'secondary',
      onClick: () => {
        this._root_vcr.clear();
        let contactForm = this._root_vcr.createComponent(ContactUsComponent);
        contactForm.contactType = "K9A4lQwYNs";
      }
    });
    alert.addButton({
      title: 'Close',
      type: 'primary',
      onClick: () => this._root_vcr.clear()
    });
    
    // const alert = this._root_vcr.createComponent(AlertComponent);

    // alert.title = 'Access level Required';
    // alert.icon = '';
    // alert.addLine('Hi, ' + this._parse.Parse.User.current().get('firstName') + '. You need to be site admin in order to integrate your company`s profile with apps.');
    // alert.addLine( this.adminsList + ' can set you up as a site admin if needed.');
    // alert.addLine( 'Contact SwipeIn if you need urgent access to App Integrations and you can`t integrate your company`s profile with apps.');
    // alert.addButton({
    //   title: 'Close',
    //   type: 'secondary',
    //   onClick: () => this._root_vcr.clear()
    // });
  }
}

feedbackCreation() {
  this._root_vcr.createComponent(FeedbackAlertComponent);
}

}
