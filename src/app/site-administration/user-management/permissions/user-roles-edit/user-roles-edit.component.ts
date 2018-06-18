import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SiteAdministrationService } from '../../../site-administration.service';
import { RootVCRService } from '../../../../root_vcr.service';
import { MatSnackBar } from '@angular/material';
//tslint:disable:indent
@Component({
  selector: 'app-user-roles-edit',
  templateUrl: './user-roles-edit.component.html',
  styleUrls: ['./user-roles-edit.component.scss']
})
export class UserRolesEditComponent implements OnInit {

  userRolesRights = [];
  userRolesFormGroup: FormGroup;

  currentUserRole;
  currentUserRoles = [];

  constructor(
    private _siteAdministrationService: SiteAdministrationService,
    private _rootVCRService: RootVCRService,
    private _snackbar: MatSnackBar
  ) { }

  ngOnInit() {
     this._siteAdministrationService.getUserRolesRights()
      .then(data => {
        this.userRolesRights = data;
      });

    const currentUserRoleRights = [];
    this.currentUserRole.roleRights.forEach(currentUserRoleRight => {
      currentUserRoleRights.push(currentUserRoleRight.description);
    });

    this.userRolesFormGroup = new FormGroup({
      'roleName' : new FormControl(this.currentUserRole.roleName, Validators.required),
      'roleDescription' : new FormControl(this.currentUserRole.roleDescription, Validators.required),
      'roleRights': new FormControl(currentUserRoleRights, Validators.required)
    });
  }

  set userRole(userRole) {
    this.currentUserRole = userRole;
  }
  set userRoles(userRoles) {
    this.currentUserRoles = userRoles;
  }

  get userRole() {
    return this.currentUserRole;
  }
  
  editUserRole() {
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

    const newUserRole = {
      roleName: this.userRolesFormGroup.value.roleName,
      roleDescription: this.userRolesFormGroup.value.roleDescription,
      roleRights: userRoleRights
    };
    
    const index = this.currentUserRoles.indexOf(this.currentUserRole);
    this.currentUserRoles[index] = newUserRole;
    
    this._siteAdministrationService.editUserRole(this.currentUserRole, newUserRole);
    this.userRolesFormGroup.reset();
		this._snackbar.open('User Role Edited', '', { duration: 2000, horizontalPosition: 'center', verticalPosition: 'bottom'});            
    this.closeModal();
  }

  closeModal() {
    this._rootVCRService.clear();
  }

}
