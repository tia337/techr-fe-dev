import { consoleTestResultHandler } from 'tslint/lib/test';
import { EmReferralService, EmpReferalObject, ERPType } from '../em-referral.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-employee-referral-customize',
  templateUrl: './employee-referral-customize.component.html',
  styleUrls: ['./employee-referral-customize.component.scss']
})
export class EmployeeReferralCustomizeComponent implements OnInit {

  template: EmpReferalObject;
  currentType: ERPType;
  types: ERPType[] = new Array();
  isEditable: boolean = false;

  constructor(private _route: ActivatedRoute, private _service: EmReferralService) {
    this._service.getSingleEmpRef(_route.snapshot.params.id).then(res => {
      this.template = res
      this.currentType = this.template.type;
    });
    this._service.getEmpRefTypes().then(res => {
      this.types = res;
    });
  }

  ngOnInit() {
    
  }
  choseType(type: ERPType) {
    this.template.type = type;
  }
  makeEditable() {
    this.isEditable = !this.isEditable;
  }
  saveClientERP() {
    this.isEditable = !this.isEditable;
    this._service.saveCustomERP(this.template);
  }

}
