import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScorecardsAssessmentsComponent } from './scorecards-assessments.component';

describe('ScorecardsAssessmentsComponent', () => {
  let component: ScorecardsAssessmentsComponent;
  let fixture: ComponentFixture<ScorecardsAssessmentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScorecardsAssessmentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScorecardsAssessmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
