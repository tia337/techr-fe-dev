import { TestBed, inject } from '@angular/core/testing';

import { InviteUserPageService } from './invite-user-page.service';

describe('InviteUserPageService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InviteUserPageService]
    });
  });

  it('should be created', inject([InviteUserPageService], (service: InviteUserPageService) => {
    expect(service).toBeTruthy();
  }));
});
