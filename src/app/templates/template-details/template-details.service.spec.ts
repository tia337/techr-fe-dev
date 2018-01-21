import { TestBed, inject } from '@angular/core/testing';

import { TemplateDetailsService } from './template-details.service';

describe('TemplateDetailsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TemplateDetailsService]
    });
  });

  it('should be created', inject([TemplateDetailsService], (service: TemplateDetailsService) => {
    expect(service).toBeTruthy();
  }));
});
