import { TestBed, inject } from '@angular/core/testing';

import { CandidateChatService } from './candidate-chat.service';

describe('CandidateChatService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CandidateChatService]
    });
  });

  it('should be created', inject([CandidateChatService], (service: CandidateChatService) => {
    expect(service).toBeTruthy();
  }));
});
