import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SiteAdministrationService } from '../../../site-administration.service';
import { RootVCRService } from '../../../../root_vcr.service';
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
    private _rootVCRService: RootVCRService ) { }

  ngOnInit() {
    this.userRolesRights = JSON.parse(localStorage.getItem('roles'));
    console.log(this.userRolesRights);
    console.log(this.currentUserRole.roleRights);
    setTimeout(() => {
      this.userRolesFormGroup = new FormGroup({
        'roleName' : new FormControl(this.currentUserRole.roleName, Validators.required),
        'roleDescription' : new FormControl(this.currentUserRole.roleDescription, Validators.required),
        'roleRights': new FormControl(this.currentUserRole.roleRights, Validators.required)
      });
    }, 4);
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
    const userRole = {
      roleName: this.userRolesFormGroup.value.roleName,
      roleDescription: this.userRolesFormGroup.value.roleDescription,
      roleRights: [...this.userRolesFormGroup.value.roleRights]
    };
    const index = this.currentUserRoles.indexOf(this.currentUserRole);

    this.currentUserRoles[index] = userRole;
    
    // this._siteAdministrationService.addUserRoles(userRole);
    this.userRolesFormGroup.reset();
    this.closeModal();
  }

  closeModal() {
    this._rootVCRService.clear();
  }

}
