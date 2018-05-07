import { Component, OnInit } from '@angular/core';
import { RootVCRService } from 'app/root_vcr.service';
import { Parse } from '../../../../parse.service';

@Component({ 
  selector: 'app-user-roles-delete',
  templateUrl: './user-roles-delete.component.html',
  styleUrls: ['./user-roles-delete.component.scss']
})
export class UserRolesDeleteComponent implements OnInit {

  currentUserRole;
  currentUserRoles;

  constructor(
    private _rootVCRService: RootVCRService,
    private _parse: Parse
  ) { }

  ngOnInit() {}

  set userRole(userRole) {
    this.currentUserRole = userRole;
  }

  set userRoles(userRoles) {
    this.currentUserRoles = userRoles;
  }
    
  deleteUserRole() {
    const index = this.currentUserRoles.indexOf(this.currentUserRole);
    this.currentUserRoles.splice(index, 1);
    this._parse.execCloud('deleteUserRole', {
       roleName: this.currentUserRole.roleName,
       clientId: this._parse.getCurrentUser().get('Client_Pointer').id
    });
    this.closeModal();
  }

  closeModal() {
    this._rootVCRService.clear();
  }
}
