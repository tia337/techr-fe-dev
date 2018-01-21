import { TestBed, inject } from '@angular/core/testing';

import { CandidateNotesService } from './candidate-notes.service';

describe('CandidateNotesService', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [CandidateNotesService]
		});
	});
	
	it('should be created', inject([CandidateNotesService], (service: CandidateNotesService) => {
		expect(service).toBeTruthy();
	}));
});
