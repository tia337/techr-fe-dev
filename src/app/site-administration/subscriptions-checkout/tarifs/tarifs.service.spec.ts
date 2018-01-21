import { TestBed, inject } from '@angular/core/testing';

import { TarifsService } from './tarifs.service';

describe('TarifsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TarifsService]
    });
  });

  it('should be created', inject([TarifsService], (service: TarifsService) => {
    expect(service).toBeTruthy();
  }));
});
