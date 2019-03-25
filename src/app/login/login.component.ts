import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Login } from 'app/login.service';
import { FeedBack } from 'types/types';

@Component({
	selector: 'login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

	feedback: Array<FeedBack> = [
		{
			avatarUrl: '../../assets/img/pre-login/avatars/DavidCrabb.jpg',
			name: 'David Crabb',
			position: 'CEO at Cambridge online systems - Leading Microsoft Partner in the UK',
			feedback: '“SwipeIn is the biggest revolution of the IT recruitment industry for the past 25 years.' +
				'Matching jobs to talent accurately and helping companies save time and money compared to using old recruitment methods”'
		},
		{
			avatarUrl: '../../assets/img/pre-login/avatars/ThomasShilcock.jpg',
			name: 'Tom Shilcock',
			position: 'Recruitment consultant at Edenhouse solutions - Leading SAP partner in the UK',
			feedback: '“The SwipeIn team not only has a ground breaking technology but a sound and dedicated service team too. Highly recommended”'
		},
		{
			avatarUrl: '../../assets/img/pre-login/avatars/LaurenCohen.jpg',
			name: 'Lauren Cohen',
			position: 'Head of talent acquisition at BrightGen - Leading Salesforce partner in the UK',
			feedback: '“SwipeIn smart technology provides a recruitment edge to tech & digital companies when compared to other generic platforms. And their services is second to none!”'
		}
	];

	constructor(
		private readonly router: Router,
		private readonly loginService: Login
	) {
		this.router.navigate(['/', 'login', { outlets: { 'login-slider': ['reach-and-manage-candidates'] } }], { skipLocationChange: true });
	}

	ngOnInit(): void {
	}

	signInWithLinkedin() {
		this.loginService.getAuthUrl('linkedin');
	}

}
