import { UserRolesDeleteComponent } from './user-roles-delete/user-roles-delete.component';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { UserRolesComponent } from './user-roles/user-roles.component';
import { UserRolesEditComponent } from './user-roles-edit/user-roles-edit.component';
import { Subscription } from 'rxjs/Subscription';
import { SiteAdministrationService } from './../../site-administration.service';
import { RootVCRService } from 'app/root_vcr.service';
import { Parse } from '../../../parse.service';
//tslint:disable:indent

@Component({
  selector: 'app-permissions',
  templateUrl: './permissions.component.html',
  styleUrls: ['./permissions.component.scss']
})
export class PermissionsComponent implements OnInit, OnDestroy {

  userRoles = [];
  newUserRoleSubscription: Subscription;

  constructor(
    private _router: Router,
    private _root_vcr: RootVCRService,
    private _siteAdministrationService: SiteAdministrationService,
    private _parse: Parse
  ) { }

  ngOnInit() {
    this._parse.execCloud('getUserRoles', {clientId: this._parse.getCurrentUser().get('Client_Pointer').id})
      .then(roles => {
        this.userRoles = roles;
      });
    this.userRoles = this._siteAdministrationService.getInitialUserRights();
    this.newUserRoleSubscription = this._siteAdministrationService.
      newUserRoleSubject
      .subscribe(newUserRole => {
        this.userRoles.push(newUserRole);
      });
  }

  goToAccessLevel(accessLevel: number) {
    this._router.navigate(['/', 'administration', 'user-management', { outlets: { 'user-management-sections': ['access-level', accessLevel] } }], {skipLocationChange: true});
  }

  openUserRolesModal() {
   const userRoles = this._root_vcr.createComponent(UserRolesComponent);
  }

  editUserRoles(userRole, userRoles) {
   const userRoleEdit = this._root_vcr.createComponent(UserRolesEditComponent);
   userRoleEdit.userRole = userRole;
   userRoleEdit.userRoles = userRoles;
  }

  deleteUserRoles(userRole, userRoles) {
    const userRoleDelete = this._root_vcr.createComponent(UserRolesDeleteComponent);

    userRoleDelete.userRole = userRole;
    userRoleDelete.userRoles = userRoles;
  }

  ngOnDestroy() {
    this.newUserRoleSubscription.unsubscribe();
  }

}
