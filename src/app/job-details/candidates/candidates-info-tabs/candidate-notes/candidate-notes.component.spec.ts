import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateNotesComponent } from './candidate-notes.component';

describe('CandidateNotesComponent', () => {
	let component: CandidateNotesComponent;
	let fixture: ComponentFixture<CandidateNotesComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [CandidateNotesComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(CandidateNotesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
