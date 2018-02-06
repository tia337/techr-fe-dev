import { Component, ElementRef, OnInit, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { RootVCRService } from 'app/root_vcr.service';
import { Login } from 'app/login.service';
import { PreloaderComponent } from 'app/shared/preloader/preloader.component';
import { ConfirmationAlertComponent } from 'app/header/confirmation-alert/confirmation-alert.component';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

	_currentUserSubscription;

	feedback = [
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

	constructor(private _router: Router, private _root_vcr: RootVCRService, private _login: Login) {
		this._router.navigate(['/', 'login', {outlets: {'login-slider': ['reach-and-manage-candidates']}}], {skipLocationChange: true});
	}

	ngOnInit() {
		if (this.getMobileOperatingSystem() == 'iOS') {
			//redirect to App Store
			document.getElementById('ios-wrap').style.display = 'none';
            window.location.href = 'https://itunes.apple.com/ua/app/swipein-microsoft-contractors/id1069929825?l=ru&mt=8';
		}
		else if (this.getMobileOperatingSystem() == 'Android') {
			//redirect to Play Market
			window.location.href = 'https://play.google.com/store/apps/details?id=com.swipein';
		}
	}
    getMobileOperatingSystem() {
        var userAgent = navigator.userAgent || navigator.vendor;

        // Windows Phone must come first because its UA also contains "Android"
        if (/windows phone/i.test(userAgent)) {
            return "Windows Phone";
        }

        if (/android/i.test(userAgent)) {
            return "Android";
        }

        // iOS detection from: http://stackoverflow.com/a/9039885/177710
        if (/iPad|iPhone|iPod/.test(userAgent)) {
            return "iOS";
        }
        console.log('User Agent', userAgent);
        return "unknown";
    }

	signIn() {
		this._login.signIn().then(user => {
			if (!user.get('Client_Pointer')) {
				this._root_vcr.createComponent(ConfirmationAlertComponent);
			}
		});
	}

}
