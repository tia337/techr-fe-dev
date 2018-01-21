import { Component, OnInit } from '@angular/core';
import { RootVCRService } from 'app/root_vcr.service';
import { ContactUsService } from './contact-us.service';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})
export class ContactUsComponent implements OnInit {

  contactTypes = new Array();
  text = '';
  contactType;
  isSent = false;

  numOfRecruiters: number;
  usingPlatform: boolean;
  phoneNumber: string;

  constructor(
    private _root_vcr: RootVCRService,
    private _contactService: ContactUsService
  ) { }

  ngOnInit() {
    this._contactService.getContactTypes().then(resultTypes => {
      console.log(resultTypes);
			this.contactTypes = resultTypes;
		});
  }

  close() {
		this._root_vcr.clear();
  }

  test(){
    console.log(this.numOfRecruiters);
    console.log(this.usingPlatform);
    console.log(this.phoneNumber);
  }
  
  saveSendContact() {
    console.log(this.phoneNumber);
    console.log(this.usingPlatform);
    console.log(this.numOfRecruiters);
    if(this.phoneNumber || this.usingPlatform || this.numOfRecruiters){
      console.log("if works");
      this._contactService.saveUserForms(this.contactType, this.text, this.phoneNumber, this.usingPlatform, this.numOfRecruiters);
    }else{
      this._contactService.saveUserForms(this.contactType, this.text);
    }
		// this._feedbackService.saveUserFeedbacks(this.feedbackType.id, this.text);
		this.isSent = true;
	}

}
