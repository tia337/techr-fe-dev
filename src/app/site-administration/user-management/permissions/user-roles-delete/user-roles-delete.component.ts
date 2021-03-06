import { Component, OnInit } from '@angular/core';
import { RootVCRService } from 'app/root_vcr.service';
import { SiteAdministrationService } from './../../../site-administration.service';
import { MatSnackBar } from '@angular/material';
import { AccessLevelPageService } from '../../access-level-page/access-level-page.service';

@Component({ 
  selector: 'app-user-roles-delete',
  templateUrl: './user-roles-delete.component.html',
  styleUrls: ['./user-roles-delete.component.scss']
})
export class UserRolesDeleteComponent implements OnInit {

  currentUserRole;
  currentUserRoles;
  users: any = [];

  constructor(
    private _rootVCRService: RootVCRService,
    private _siteAdministrationService: SiteAdministrationService,
    private _snackbar: MatSnackBar,
    private _alService: AccessLevelPageService
  ) { }

  ngOnInit() {
    this._alService.getTeamMembersUserRoles(this.currentUserRole.roleName).then(data => {
      console.log(data);
      this.users = data;
    }).catch(error => {
      console.log(error);
    });
  }

  set userRole(userRole) {
    this.currentUserRole = userRole;
  }

  set userRoles(userRoles) {
    this.currentUserRoles = userRoles;
  }
    
  deleteUserRole() {
    const index = this.currentUserRoles.indexOf(this.currentUserRole);
    this.currentUserRoles.splice(index, 1);

    this._siteAdministrationService.deleteUserRole(this.currentUserRole);

    this.closeModal();
		this._snackbar.open('User Role Deleted', '', { duration: 2000, horizontalPosition: 'center', verticalPosition: 'bottom'});        
  }

  closeModal() {
    this._rootVCRService.clear();
  }
}
