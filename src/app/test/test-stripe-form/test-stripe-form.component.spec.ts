import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestStripeFormComponent } from './test-stripe-form.component';

describe('TestStripeFormComponent', () => {
  let component: TestStripeFormComponent;
  let fixture: ComponentFixture<TestStripeFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestStripeFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestStripeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
