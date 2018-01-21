import { TestBed, inject } from '@angular/core/testing';

import { UpgradeDataService } from './upgrade-data.service';

describe('UpgradeDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UpgradeDataService]
    });
  });

  it('should be created', inject([UpgradeDataService], (service: UpgradeDataService) => {
    expect(service).toBeTruthy();
  }));
});
