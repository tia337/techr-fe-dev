import { RootVCRService } from 'app/root_vcr.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { SiteAdministrationService } from './../../../site-administration.service';

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
    private _rootVCRService: RootVCRService ) { }

  ngOnInit() {
    this.userRolesRights = this._siteAdministrationService.getUserRolesRights();
    this.userRolesFormGroup = new FormGroup({
      'roleName' : new FormControl('', Validators.required),
      'roleDescription' : new FormControl('', Validators.required),
      'roleRights': new FormControl('', Validators.required)
    });
  }
  addUserRole() {
    const userRole = {
      roleName: this.userRolesFormGroup.value.roleName,
      roleDescription: this.userRolesFormGroup.value.roleDescription,
      roleRights: [...this.userRolesFormGroup.value.roleRights]
    };

    this._siteAdministrationService.addUserRoles(userRole);
    this.userRolesFormGroup.reset();
    this.closeModal();
  }

  closeModal() {
    this._rootVCRService.clear();
  }
}
