import { TestBed, async, inject } from '@angular/core/testing';

import { JobDetailsGuard } from './job-details.guard';

describe('JobDetailsGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [JobDetailsGuard]
    });
  });

  it('should ...', inject([JobDetailsGuard], (guard: JobDetailsGuard) => {
    expect(guard).toBeTruthy();
  }));
});
