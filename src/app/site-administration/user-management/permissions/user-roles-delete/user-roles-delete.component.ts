import { Component, OnInit } from '@angular/core';
import { RootVCRService } from 'app/root_vcr.service';

@Component({ 
  selector: 'app-user-roles-delete',
  templateUrl: './user-roles-delete.component.html',
  styleUrls: ['./user-roles-delete.component.scss']
})
export class UserRolesDeleteComponent implements OnInit {

  currentUserRole;
  currentUserRoles;

  constructor(private _rootVCRService: RootVCRService) { }

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
    this.closeModal();
  }

  closeModal() {
    this._rootVCRService.clear();
  }
}
