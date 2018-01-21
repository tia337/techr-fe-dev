import { ErpService } from './erp.service';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { EmReferralService, ERPType, EmpReferalObject } from './../../employee-referral/em-referral.service';
import { JobDetailsService } from '../job-details.service';
import { RootVCRService } from 'app/root_vcr.service';
import { GmailComponent } from 'app/gmail/gmail.component';

@Component({
  selector: 'erp-job',
  templateUrl: './erp-job.component.html',
  styleUrls: ['./erp-job.component.scss']
})
export class ErpJobComponent implements OnInit, OnDestroy {
  @Input() contract;
  samplesArray: EmpReferalObject[];
  customsArray: EmpReferalObject[];
  erpTypes: ERPType[];
  cmpName: string;

  isActive = false;

  buttonName = 'Select Program';

  typeForSave: ERPType;
  erProgramsArrayLook: EmpReferalObject[];
  choicedProgram: EmpReferalObject;

  constructor(
    private _service: EmReferralService,
    private _erp: ErpService,
    private _jobDetailsService: JobDetailsService,
    private _vcr: RootVCRService
  ) {
   _service.getEmpRefTmplts().then(res => {
     this.customsArray = res;
   });
   _service.getEmpRefSamplesTmplts().then(res => {
     this.samplesArray = res;
   });
   _service.getEmpRefTypes().then(res => {
     this.erpTypes = res;
   });
   this.cmpName = _service.getUserClient().get('ClientName');
  }

  ngOnInit() {
    this.isActive = false;
    this.contract = this._jobDetailsService.contract;
    console.log(this.contract);
    const erp = this.contract.get('employeeReferralProgram');
    if (erp !== undefined) {
      this.choicedProgram = this.getErpInfo(erp);
    }
    const act = this.contract.get('isActiveForReferralPage');
    this.isActive = act !== undefined ? act : false;
	console.log(this.contract);
  }

	sendEmail() {
		const email = this._vcr.createComponent(GmailComponent);
		email.contractId = this.contract.id;
		email.needTemplates = true;
		email.templateOptions = [1];
		email.emailBody = '';
		email.emailSubj = '';
	}

  choiceProgram(erp: EmpReferalObject) {
    this.choicedProgram = erp;
    this.contract.set('employeeReferralProgram',
      this._service.createPointer('EmployeeReferralPrograms', this.choicedProgram.id));
    this.contract.save();
  }
  removeErpProgram() {
    this.choicedProgram = null;
    this.contract.set('employeeReferralProgram', null);
    this.contract.save();
  }
  changeActiveStateForErp() {
    if (this.isActive) {
      console.log('Deactivation!');
      this.contract.set('isActiveForReferralPage', false);
      this.contract.save();
    } else {
      console.log('Activation!');
      this.contract.set('isActiveForReferralPage', true);
      this.contract.save();
    }
  }
  getErpInfo(erp): EmpReferalObject {
    const erpResult = new EmpReferalObject();
    erpResult.descr = erp.get('Description');
    erpResult.eleg = erp.get('Elegibility');
    erpResult.id = erp.id;
    erpResult.postedAt = erp.createdAt;
    erpResult.title = erp.get('Title');
    erpResult.type = new ERPType(erp.get('Type').get('Type'), erp.get('Type').id);
    return (erpResult);
  }

  ngOnDestroy() {
    this._jobDetailsService = null;
  }

}
