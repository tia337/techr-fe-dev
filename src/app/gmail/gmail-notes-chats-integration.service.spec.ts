import { TestBed, inject } from '@angular/core/testing';

import { GmailNotesChatsIntegrationService } from './gmail-notes-chats-integration.service';

describe('GmailNotesChatsIntegrationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GmailNotesChatsIntegrationService]
    });
  });

  it('should be created', inject([GmailNotesChatsIntegrationService], (service: GmailNotesChatsIntegrationService) => {
    expect(service).toBeTruthy();
  }));
});
