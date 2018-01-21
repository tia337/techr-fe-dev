import { TestBed, inject } from '@angular/core/testing';

import { InvitationPageService } from './invitation-page.service';

describe('InvitationPageService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InvitationPageService]
    });
  });

  it('should be created', inject([InvitationPageService], (service: InvitationPageService) => {
    expect(service).toBeTruthy();
  }));
});
