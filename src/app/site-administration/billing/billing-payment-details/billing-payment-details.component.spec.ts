import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingPaymentDetailsComponent } from './billing-payment-details.component';

describe('BillingPaymentDetailsComponent', () => {
  let component: BillingPaymentDetailsComponent;
  let fixture: ComponentFixture<BillingPaymentDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillingPaymentDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillingPaymentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
