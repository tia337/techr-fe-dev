import { Component, OnInit } from '@angular/core';
import { EmReferralService, EmpReferalObject } from './em-referral.service';
import { FeedbackAlertComponent } from 'app/core/feedback-alert/feedback-alert.component';
import { RootVCRService } from 'app/root_vcr.service';

@Component({
  selector: 'app-employee-referral',
  templateUrl: './employee-referral.component.html',
  styleUrls: ['./employee-referral.component.scss']
})
export class EmployeeReferralComponent implements OnInit {

  counter:				number = 0;
  companyName:			string;
  empRefsArray:			EmpReferalObject[];
  empRefsSamplesArray:	EmpReferalObject[];
  tab = 1;
  empRefActivityArray = new Array();
  
  //				SORT PARAMS

  nameSort:				boolean = true;
  programSort:			boolean = true;
  dateSort:				boolean = true;
  activeInActive:		{active: boolean, inactive: boolean} = {active: true, inactive: true};
  activitiParams:		boolean = true;
  referralsParams:		boolean = false;

  constructor(
		private _service: EmReferralService,
		private _vcr: RootVCRService
	) {
	this._service.getErpActivity().then(res => {
		this.empRefActivityArray = res;
	});
  }

  ngOnInit() {
		window.scrollTo(0, 0);
		this.companyName = this._service.getCompanyName();
		this._service.getEmpRefTmplts().then((res: EmpReferalObject[]) => {
			res.sort((a, b) => {
				return b.updatedAt.getTime() - a.updatedAt.getTime();
			});
			this.empRefsArray = res;
		});
		this._service.getEmpRefSamplesTmplts().then((res: EmpReferalObject[]) => {
			res.sort((a, b) => {
				return (a.type.name > b.type.name) ? 10 : -10;
			});
			this.empRefsSamplesArray = res;
		});
	}
	
	feedbackCreation() {
		this._vcr.createComponent(FeedbackAlertComponent);
	}

  removeProgram(erp: EmpReferalObject) {
    this.empRefsArray.splice(this.empRefsArray.indexOf(erp), 1);
    this._service.deleteERPProgram(erp);
  }
  samples() {
	this.tab = 1;
	this._service.getEmpRefSamplesTmplts().then((res: EmpReferalObject[]) => {
		res.sort((a, b) => {
		  return (a.type.name > b.type.name) ? 10 : -10;
		});
		this.empRefsSamplesArray = res;
	});
  }
  company() {
	this.tab = 2;
	this._service.getEmpRefTmplts().then((res: EmpReferalObject[]) => {
		res.sort((a, b) => {
		  return b.updatedAt.getTime() - a.updatedAt.getTime();
		});
		this.empRefsArray = res;
	});
  }
  rfActivity() {
	this.tab = 3;
	this._service.getErpActivity().then(res => {
		this.empRefActivityArray = res;
	});
  }
  sortByName() {
	  if (this.nameSort) {
		this.empRefActivityArray.sort((a, b) => { 
			if (a.get('title') > b.get('title')) {
				return 1;
			}
			if (a.get('title') < b.get('title')) {
				return -1;
			}
			return 0;
		});
	  this.nameSort = false;
	} else {
	  this.empRefActivityArray.sort((a, b) => {
		if (a.get('title') > b.get('title')) {
			return -1;
		}
		if (a.get('title') < b.get('title')) {
			return 1;
		}
		return 0;
	  });
	  this.nameSort = true;
	}
  }
  sortByProgram() {
	if (this.programSort) {
	  this.empRefActivityArray.sort((a, b) => {
		  let x = a.get('employeeReferralProgram');
		  let y = b.get('employeeReferralProgram');
		  if (x == undefined || y == undefined) {
			  return (1);
		  }
		  else if (x.get('Title') > y.get('Title')) {
			  return (1);
		  }
		  else if (x.get('title') < y.get('title')) {
			  return (-1);
		  }
		  return (0);
	  });
	this.programSort = false;
  } else {
	this.empRefActivityArray.sort((a, b) => {
		let x = a.get('employeeReferralProgram');
		let y = b.get('employeeReferralProgram');
		if (x == undefined || y == undefined) {
			return (-1);
		}
		else if (x.get('Title') < y.get('TitlenameSort')) {
			return (1);
		}
		else if (x.get('title') > y.get('title')) {
			return (-1);
		}
		return (0);
	});
	this.programSort = true;
  }
}
  sortByActivity() {
	this._service.getErpActivity(this.activitiParams).then(res => {
		this.empRefActivityArray = res;
	});
	this.activitiParams = !this.activitiParams;
  }
  sortByCreationDate() {
	if (this.dateSort) {
		this.empRefActivityArray.sort((a, b) => {
			if (a.createdAt.getTime() > b.createdAt.getTime()) {
				return 1;
			}
			if (a.createdAt.getTime() < b.createdAt.getTime()) {
				return -1;
			}
			return 0;
		});
	  this.dateSort = false;
	} else {
	  this.empRefActivityArray.sort((a, b) => {
		if (a.createdAt.getTime() > b.createdAt.getTime()) {
			return -1;
		}
		if (a.createdAt.getTime() < b.createdAt.getTime()) {
			return 1;
		}
		return 0;
	  });
	  this.dateSort = true;
  }
}
	sortByReferrals() {
		if (this.referralsParams) {
			this.empRefActivityArray.sort((a, b) => { 
				if (a.count > b.count) {
					return 1;
				}
				if (a.count < b.count) {
					return -1;
				}
				return 0;
			});
			this.referralsParams = false;
		} else {
		  	this.empRefActivityArray.sort((a, b) => {
				if (a.count > b.count) {
					return -1;
				}
				if (a.count < b.count) {
					return 1;
				}
				return 0;
		  	});
		  	this.referralsParams = true;
		}
	}
}
