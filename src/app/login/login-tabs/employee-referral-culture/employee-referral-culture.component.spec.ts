import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeReferralCultureComponent } from './employee-referral-culture.component';

describe('EmployeeReferralCultureComponent', () => {
  let component: EmployeeReferralCultureComponent;
  let fixture: ComponentFixture<EmployeeReferralCultureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeReferralCultureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeReferralCultureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
