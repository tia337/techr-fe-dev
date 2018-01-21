import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditScorecardComponent } from './edit-scorecard.component';

describe('EditScorecardComponent', () => {
  let component: EditScorecardComponent;
  let fixture: ComponentFixture<EditScorecardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditScorecardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditScorecardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
