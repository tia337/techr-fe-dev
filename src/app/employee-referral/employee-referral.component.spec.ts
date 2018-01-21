import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeReferralComponent } from './employee-referral.component';

describe('EmployeeReferralComponent', () => {
  let component: EmployeeReferralComponent;
  let fixture: ComponentFixture<EmployeeReferralComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeReferralComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeReferralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
