import { TestBed, inject } from '@angular/core/testing';

import { TalentbaseService } from './talentbase.service';

describe('TalentbaseService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TalentbaseService]
    });
  });

  it('should be created', inject([TalentbaseService], (service: TalentbaseService) => {
    expect(service).toBeTruthy();
  }));
});
