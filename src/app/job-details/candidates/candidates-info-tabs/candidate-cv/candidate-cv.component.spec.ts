import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateCVComponent } from './candidate-cv.component';

describe('CandidateCVComponent', () => {
  let component: CandidateCVComponent;
  let fixture: ComponentFixture<CandidateCVComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CandidateCVComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateCVComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
