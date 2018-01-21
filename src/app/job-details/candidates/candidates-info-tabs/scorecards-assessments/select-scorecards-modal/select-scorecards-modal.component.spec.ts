import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectScorecardsModalComponent } from './select-scorecards-modal.component';

describe('SelectScorecardsModalComponent', () => {
  let component: SelectScorecardsModalComponent;
  let fixture: ComponentFixture<SelectScorecardsModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectScorecardsModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectScorecardsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
