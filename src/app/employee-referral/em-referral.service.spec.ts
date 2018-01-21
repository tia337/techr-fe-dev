import { TestBed, inject } from '@angular/core/testing';

import { EmReferralService } from './em-referral.service';

describe('EmReferralService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EmReferralService]
    });
  });

  it('should be created', inject([EmReferralService], (service: EmReferralService) => {
    expect(service).toBeTruthy();
  }));
});
