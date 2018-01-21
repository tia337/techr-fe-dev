import { Component, OnInit } from '@angular/core';
import { EmReferralService, EmpReferalObject, ERPType } from '../em-referral.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-employee-referral-create',
  templateUrl: './employee-referral-create.component.html',
  styleUrls: ['./employee-referral-create.component.scss']
})
export class EmployeeReferralCreateComponent implements OnInit {

  template: EmpReferalObject;
  currentType: ERPType;
  types: ERPType[] = new Array();

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
  createClientERP() {
    this._service.createCustomERP(this.template);
  }

}
