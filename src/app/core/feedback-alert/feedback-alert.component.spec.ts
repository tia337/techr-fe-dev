import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackAlertComponent } from './feedback-alert.component';

describe('FeedbackAlertComponent', () => {
  let component: FeedbackAlertComponent;
  let fixture: ComponentFixture<FeedbackAlertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeedbackAlertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedbackAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
