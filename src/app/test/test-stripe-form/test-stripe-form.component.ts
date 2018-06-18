import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-test-stripe-form',
  templateUrl: './test-stripe-form.component.html',
  styleUrls: ['./test-stripe-form.component.scss']
})
export class TestStripeFormComponent implements OnInit {
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvc: string;
  nameCard: string;
  zip: string;
  address1: string;
  address2: string;
  city: string;
  country: string;
  state: string;
  phone: string;
  company: string;

  stripe = (<any>window).Stripe('pk_test_DOxsBoIZIbzfu3y6EafzMDNU');

  message: string;

  getToken() {
    // console.log(this.nameCard);
    this.message = 'Loading...';

    (<any>window).Stripe.card.createToken({
      name: this.nameCard,
      number: this.cardNumber,
      exp_month: this.expiryMonth,
      exp_year: this.expiryYear,
      cvc: this.cvc,
      address_zip: this.zip,
      address_line1: this.address1,
      address_line2: this.address2,
      address_city: this.city,
      address_country: this.country,
      address_state: this.state,

    }, (status: number, response: any) => {
      if (status === 200) {
        this.message = `Success! Card token ${response.card.id}.`;
      } else {
        this.message = response.error.message;
      }
    });
  }

  constructor() { }

  ngOnInit() {

  }

}
