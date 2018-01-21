/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ErpService } from './erp.service';

describe('Service: Erp', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ErpService]
    });
  });

  it('should ...', inject([ErpService], (service: ErpService) => {
    expect(service).toBeTruthy();
  }));
});