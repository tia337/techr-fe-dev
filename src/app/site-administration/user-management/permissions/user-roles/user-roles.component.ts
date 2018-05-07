import { RootVCRService } from 'app/root_vcr.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { SiteAdministrationService } from './../../../site-administration.service';
import { Parse } from '../../../../parse.service';
//tslint:disable:indent
@Component({
  selector: 'app-user-roles',
  templateUrl: './user-roles.component.html',
  styleUrls: ['./user-roles.component.scss']
})
export class UserRolesComponent implements OnInit {

  hiddenModal = false;

  userRolesRights = [];
  userRolesFormGroup: FormGroup;

  constructor(
    private _siteAdministrationService: SiteAdministrationService,
    private _rootVCRService: RootVCRService,
    private _parse: Parse
  ) { }

  ngOnInit() {
    this.userRolesFormGroup = new FormGroup({
      'roleName' : new FormControl('', Validators.required),
      'roleDescription' : new FormControl('', Validators.required),
      'roleRights': new FormControl('', Validators.required)
    });
    this._parse.execCloud('getUserRights', {}).then(data => {
      this.userRolesRights = data;
    });
  }
  addUserRole() {
    const userRole = {
      roleName: this.userRolesFormGroup.value.roleName,
      roleDescription: this.userRolesFormGroup.value.roleDescription,
      roleRights: [...this.userRolesFormGroup.value.roleRights]
    };
    const rightsIdArray = [];
    userRole.roleRights.forEach(right => {
      rightsIdArray.push(right.get('rightId'));
    });
    const data = {
      clientId: this._parse.getCurrentUser().get('Client_Pointer').id,
      userRole: {
        roleName: this.userRolesFormGroup.value.roleName,
        roleDescription: this.userRolesFormGroup.value.roleDescription,
        roleRights: rightsIdArray
      }
    };
    this._parse.execCloud('addUserRole', data);
    this._siteAdministrationService.addUserRoles(userRole);

    this.userRolesFormGroup.reset();
    this.closeModal();
  }

  closeModal() {
    this._rootVCRService.clear();
  }
}
