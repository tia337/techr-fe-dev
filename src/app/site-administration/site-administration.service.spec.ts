import { TestBed, inject } from '@angular/core/testing';

import { SiteAdministrationService } from './site-administration.service';

describe('SiteAdministrationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SiteAdministrationService]
    });
  });

  it('should be created', inject([SiteAdministrationService], (service: SiteAdministrationService) => {
    expect(service).toBeTruthy();
  }));
});
