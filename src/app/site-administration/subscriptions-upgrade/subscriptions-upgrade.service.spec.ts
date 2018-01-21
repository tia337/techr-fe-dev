import { TestBed, inject } from '@angular/core/testing';

import { SubscriptionsUpgradeService } from './subscriptions-upgrade.service';

describe('SubscriptionsUpgradeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SubscriptionsUpgradeService]
    });
  });

  it('should be created', inject([SubscriptionsUpgradeService], (service: SubscriptionsUpgradeService) => {
    expect(service).toBeTruthy();
  }));
});
