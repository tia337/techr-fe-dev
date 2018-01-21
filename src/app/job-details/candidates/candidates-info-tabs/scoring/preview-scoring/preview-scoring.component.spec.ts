import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewScoringComponent } from './preview-scoring.component';

describe('PreviewScoringComponent', () => {
  let component: PreviewScoringComponent;
  let fixture: ComponentFixture<PreviewScoringComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreviewScoringComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewScoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
