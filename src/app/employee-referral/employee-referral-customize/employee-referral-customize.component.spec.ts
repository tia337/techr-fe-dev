import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeReferralCustomizeComponent } from './employee-referral-customize.component';

describe('EmployeeReferralCustomizeComponent', () => {
  let component: EmployeeReferralCustomizeComponent;
  let fixture: ComponentFixture<EmployeeReferralCustomizeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeReferralCustomizeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeReferralCustomizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
