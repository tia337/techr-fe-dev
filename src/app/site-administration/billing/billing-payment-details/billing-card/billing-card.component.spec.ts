import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingCardComponent } from './billing-card.component';

describe('BillingCardComponent', () => {
  let component: BillingCardComponent;
  let fixture: ComponentFixture<BillingCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillingCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillingCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
