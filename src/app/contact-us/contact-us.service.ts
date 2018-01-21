import { Injectable } from '@angular/core';
import { Parse } from 'app/parse.service';

@Injectable()
export class ContactUsService {

  constructor(
    private _parse: Parse
  ) { }

  getContactTypes() {
		const query = this._parse.Query('ContactUsInquiryType');
		return query.find();
  }
  
  saveUserForms(typeId: string, text:string, phoneNum?: string, usingOtherSoft?: boolean, numOfRecruiters?: number) {
		const newForm = this._parse.Object('ContactUsInquiry');
    newForm.set('User', this.createPointer('_User', this._parse.Parse.User.current().id));
		newForm.set('InquiryText', text);
    newForm.set('Type', this.createPointer('ContactUsInquiryType', typeId));
    if(phoneNum || usingOtherSoft || numOfRecruiters){
      newForm.set('PhoneNumber', phoneNum);
      newForm.set('NumberOfRecruiters', numOfRecruiters);
      newForm.set('currentlyUsingOtherSoftware', usingOtherSoft); 
    }
    newForm.set('EmailAddress', this._parse.Parse.User.current().get('email'));
    newForm.set('Name', this._parse.Parse.User.current().get('firstName'));
    newForm.set('isMessageSent', false);
    this._parse.Parse.User.current().get('Client_Pointer').fetch().then(client=>{
      newForm.set('ClientName', client.get('ClientName'));
      newForm.save();
    });
  }
  
  createPointer(className, id) {
		const object = this._parse.Object(className);
		object.id = id;
		return object;
	}

}
