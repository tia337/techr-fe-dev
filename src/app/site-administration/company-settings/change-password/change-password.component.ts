import { Component, OnInit } from '@angular/core';
import { RootVCRService } from 'app/root_vcr.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

	clientId;
	pwdOne = new FormControl();
	pwdTwo = new FormControl();

  constructor(private _vcr: RootVCRService) { }

  ngOnInit() {
	  console.log(this.clientId);
  }
  closeMakeReferral() {
	  this._vcr.clear();
  }
  savePassword() {
	if (this.pwdOne.value == this.pwdTwo.value) {
		this.clientId.set('erpPagePwd', this.pwdOne.value);
		this.clientId.save();
		this.closeMakeReferral();
	}
  }
}
