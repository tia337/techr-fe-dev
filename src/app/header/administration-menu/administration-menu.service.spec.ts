import { TestBed, inject } from '@angular/core/testing';

import { AdministrationMenuService } from './administration-menu.service';

describe('AdministrationMenuService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AdministrationMenuService]
    });
  });

  it('should be created', inject([AdministrationMenuService], (service: AdministrationMenuService) => {
    expect(service).toBeTruthy();
  }));
});
