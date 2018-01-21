import { TestBed, inject } from '@angular/core/testing';

import { GmailDraftsService } from './gmail-drafts.service';

describe('GmailDraftsService', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [GmailDraftsService]
		});
	});

	it('should be created', inject([GmailDraftsService], (service: GmailDraftsService) => {
		expect(service).toBeTruthy();
	}));
});
