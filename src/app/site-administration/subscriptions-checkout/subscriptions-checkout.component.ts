import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Parse } from '../../parse.service';
import {Location} from '@angular/common';

@Component({
	selector: 'app-subscriptions-checkout',
	templateUrl: './subscriptions-checkout.component.html',
	styleUrls: ['./subscriptions-checkout.component.scss']
})
export class SubscriptionsCheckoutComponent implements OnInit {

	constructor(private router: Router, private _location: Location) { }

	ngOnInit() {
	}


	back(){
		this._location.back();
	}
}
