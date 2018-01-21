import { TestBed, inject } from '@angular/core/testing';

import { ScoreCandidateService } from './score-candidate.service';

describe('ScoreCandidateService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ScoreCandidateService]
    });
  });

  it('should be created', inject([ScoreCandidateService], (service: ScoreCandidateService) => {
    expect(service).toBeTruthy();
  }));
});
