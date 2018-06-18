import { RootVCRService } from 'app/root_vcr.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { SiteAdministrationService } from './../../../site-administration.service';
import { Parse } from '../../../../parse.service';
import { MatSnackBar } from '@angular/material';
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
    private _parse: Parse,
    private _snackbar: MatSnackBar
  ) { }

  ngOnInit() {
    this._siteAdministrationService.getUserRolesRights()
      .then(data => {
        this.userRolesRights = data;
      });
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
    const userRoleRights = [];
    this.userRolesRights.forEach(roleRight => {
      this.userRolesFormGroup.value.roleRights.forEach(formRoleRight => {
        if (roleRight.get('rightDesc') === formRoleRight ) {
          const newRoleRight = {
            id: roleRight.get('rightId'),
            description: formRoleRight
          };
          userRoleRights.push(newRoleRight);
        }
      });
    });
    const userRole = {
      roleName: this.userRolesFormGroup.value.roleName,
      roleDescription: this.userRolesFormGroup.value.roleDescription,
      roleRights: userRoleRights
    };

    this._siteAdministrationService.addUserRole(userRole);
    this.userRolesFormGroup.reset();
    this.closeModal();
		this._snackbar.open('User Role Added', '', { duration: 2000, horizontalPosition: 'center', verticalPosition: 'bottom'});    
  }

  closeModal() {
    this._rootVCRService.clear();
  }
}
