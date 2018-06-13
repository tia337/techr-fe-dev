import { Component, OnInit } from '@angular/core';

import { Login } from "app/login.service";

@Component({
  selector: 'app-auth-microsoft',
  templateUrl: './auth-microsoft.component.html'
})
export class AuthMicrosoftComponent implements OnInit {

  constructor(
    private _login: Login
  ) { }

  ngOnInit() {
    if (window.location.href.includes('?code=')) {
      const location = window.location.href;
      const beginIndex = window.location.href.indexOf('?code=') + 6;
      const endIndex = window.location.href.indexOf('&');
      const code = location.slice(beginIndex, endIndex);

      if (localStorage.getItem('branchdata')) {
        let branchData = JSON.parse(localStorage.getItem('branchdata'));
        localStorage.removeItem('branchData');
        this._login.signInWithMicrosoft(code, branchData);
        return;
      }
      this._login.signInWithMicrosoft(code);
    }
  }

}
