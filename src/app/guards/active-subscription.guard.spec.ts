import { TestBed, async, inject } from '@angular/core/testing';

import { ActiveSubscriptionGuard } from './active-subscription.guard';

describe('ActiveSubscriptionGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ActiveSubscriptionGuard]
    });
  });

  it('should ...', inject([ActiveSubscriptionGuard], (guard: ActiveSubscriptionGuard) => {
    expect(guard).toBeTruthy();
  }));
});
