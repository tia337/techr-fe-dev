import { TestBed, inject } from '@angular/core/testing';

import { SubscriptionsBillingService } from './subscriptions-billing.service';

describe('SubscriptionsBillingService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SubscriptionsBillingService]
    });
  });

  it('should be created', inject([SubscriptionsBillingService], (service: SubscriptionsBillingService) => {
    expect(service).toBeTruthy();
  }));
});
