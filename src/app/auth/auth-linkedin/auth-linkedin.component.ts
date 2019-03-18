import { Component, OnInit } from '@angular/core';
import { Login } from 'app/login.service';

@Component({
    selector: 'app-auth-linkedin',
    templateUrl: './auth-linkedin.component.html'
})
export class AuthLinkedinComponent implements OnInit {

    constructor(
        private readonly loginService: Login
    ) {}

    ngOnInit(): void {
        this.signIn();
    }

    private signIn(): void {
        if (window.location.href.includes('?code=')) {
            const location = window.location.href;
            const beginIndex = window.location.href.indexOf('?code=') + 6;
            const endIndex = window.location.href.indexOf('&');
            const code = location.slice(beginIndex, endIndex);

            if (localStorage.getItem('branchData')) {
                const branchData = JSON.parse(localStorage.getItem('branchData'));
                localStorage.removeItem('branchData');
                this.loginService.signInWithLinkedin(code, branchData);

                return;
            }

            this.loginService.signInWithLinkedin(code);
        }
    }

}
