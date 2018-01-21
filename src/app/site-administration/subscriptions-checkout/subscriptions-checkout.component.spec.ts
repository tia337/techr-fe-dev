import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionsCheckoutComponent } from './subscriptions-checkout.component';

describe('SubscriptionsCheckoutComponent', () => {
  let component: SubscriptionsCheckoutComponent;
  let fixture: ComponentFixture<SubscriptionsCheckoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubscriptionsCheckoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriptionsCheckoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
