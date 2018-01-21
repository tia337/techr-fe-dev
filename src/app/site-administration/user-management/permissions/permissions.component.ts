import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-permissions',
  templateUrl: './permissions.component.html',
  styleUrls: ['./permissions.component.scss']
})
export class PermissionsComponent implements OnInit {

  constructor(private _router: Router) { }

  ngOnInit() {
  }

  goToAccessLevel(accessLevel: number) {
    this._router.navigate(['/', 'administration', 'user-management', { outlets: { 'user-management-sections': ['access-level', accessLevel] } }], {skipLocationChange: true});
  }



}
