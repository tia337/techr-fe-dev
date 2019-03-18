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
		this.detectMobileOperatingSystem();
	}

	signInWithLinkedin() {
		this.loginService.getAuthUrl('linkedin');
	}

	private getMobileOperatingSystem(): string {
		const userAgent = navigator.userAgent || navigator.vendor;

		// Windows Phone must come first because its UA also contains 'Android'
		if (/windows phone/i.test(userAgent)) {
			return 'Windows Phone';
		}

		if (/android/i.test(userAgent)) {
			return 'Android';
		}

		// iOS detection from: http://stackoverflow.com/a/9039885/177710
		if (/iPad|iPhone|iPod/.test(userAgent)) {
			return 'iOS';
		}

		return 'unknown';
	}

	private detectMobileOperatingSystem(): void {
		switch (this.getMobileOperatingSystem()) {
			case 'iOS':
				document.getElementById('ios-wrap').style.display = 'none';
				window.location.href = 'https://itunes.apple.com/ua/app/swipein-microsoft-contractors/id1069929825?l=ru&mt=8';
				break;
			case 'Android':
				document.getElementById('ios-wrap').style.display = 'none';
				window.location.href = 'https://play.google.com/store/apps/details?id=com.swipein';
				break;
			case 'Windows Phone':
				document.getElementById('ios-wrap').style.display = 'none';
				alert('SwipeIn is only available on iOS/Android or https://swipein.hr for the web desktop version');
		}
	}
}
