import { TestBed, inject } from '@angular/core/testing';

import { TestSkillsService } from './test-skills.service';

describe('TestSkillsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TestSkillsService]
    });
  });

  it('should be created', inject([TestSkillsService], (service: TestSkillsService) => {
    expect(service).toBeTruthy();
  }));
});
