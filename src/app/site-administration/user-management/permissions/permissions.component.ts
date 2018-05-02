import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { UserRolesComponent } from './user-roles/user-roles.component';
import { UserRolesEditComponent } from './user-roles-edit/user-roles-edit.component';
import { Subscription } from 'rxjs/Subscription';
import { SiteAdministrationService } from './../../site-administration.service';
import { RootVCRService } from 'app/root_vcr.service';

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
    private _siteAdministrationService: SiteAdministrationService) { }
    
    
  ngOnInit() {
    this.userRoles = this._siteAdministrationService.getUserRoles();
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

  editUserRoles(userRole) {
   const userRoleEdit = this._root_vcr.createComponent(UserRolesEditComponent);
   userRoleEdit.userRole = userRole;
  }
  ngOnDestroy() {
    this.newUserRoleSubscription.unsubscribe();
  }

}
