import { Component, OnInit } from '@angular/core';
import { RootVCRService } from '../../../../root_vcr.service';
import { Parse } from '../../../../parse.service';
import { AccessLevelPageService } from '../access-level-page.service';
//tslint:disable:indent
@Component({
  selector: 'app-edit-user-role',
  templateUrl: './edit-user-role.component.html',
  styleUrls: ['./edit-user-role.component.scss']
})
export class EditUserRoleComponent implements OnInit {

  user: {email: string, name: string, userId: string, userRoles: any};
  response = 'pending';

  roles: Array<any> = [];
  constructor(
    private _root_vcr: RootVCRService,
    private _parse: Parse,
    private _alService: AccessLevelPageService
  ) { }

  ngOnInit() {
    this._alService.getUserRoles().then(roles => {
      for (let i = 0; i < roles.length; i++) {
        this.roles[i] = roles[i];
        Object.defineProperty(this.roles[i], 'checked', {value: false, writable: true});
      }
      this.checkUserRoles(roles);
    }).catch(error => console.log(error));
  };

  set setUser (value) {
    this.user = value;
  }

  get getUser () {
    return this.user;
  }

  closeModal () {
    this._root_vcr.clear();
  }

  checkUserRoles(roles: Array<any>) {
    this.user.userRoles.forEach(role => {
      this.roles.forEach(userRole => {
        if (userRole.roleName === role.roleName) {
          userRole.checked = true;
        };
      });
    });
  }

  addNewRoleToUser(role) {
    let tempRole;
    if (role.checked === false) {
      tempRole = Object.assign({}, role);
      delete tempRole.checked;
      this.user.userRoles.push(tempRole);
      role.checked = true;
      return;
    } else if (role.checked === true) {
      this.user.userRoles.forEach(item => {
        if (item.roleName === role.roleName) {
          const index = this.user.userRoles.indexOf(item);
          this.user.userRoles.splice(index, 1);
        }
      });
      role.checked = false;
    }
  }

  saveUserRoles() {
    this.editTeamMemberUserRole().then(data => {
      this.openSuccessModal();
    }).catch(error => {
      this.openErrorModal();
    });
  }

  editTeamMemberUserRole() {
    const promise = new Promise ((resolve, reject) => {
      this._parse.execCloud('editTeamMemberUserRole', {userId: this.user.userId, userRoles: this.user.userRoles}).then(data => {
        resolve(data);
        reject(data);
      });
    });
    return promise;
  }

  openSuccessModal() {
    this.response = 'success';
    setTimeout(() => {
      this._root_vcr.clear();
    }, 1500);
  }

  openErrorModal() {
    this.response = 'error';
    setTimeout(() => {
      this._root_vcr.clear();
    }, 2000);
  }

}
