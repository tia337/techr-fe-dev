import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScoreCandidateComponent } from './score-candidate.component';

describe('ScoreCandidateComponent', () => {
  let component: ScoreCandidateComponent;
  let fixture: ComponentFixture<ScoreCandidateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScoreCandidateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScoreCandidateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
