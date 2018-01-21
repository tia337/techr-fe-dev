import { TestBed, inject } from '@angular/core/testing';

import { CheckoutPageService } from './checkout-page.service';

describe('CheckoutPageService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CheckoutPageService]
    });
  });

  it('should be created', inject([CheckoutPageService], (service: CheckoutPageService) => {
    expect(service).toBeTruthy();
  }));
});
