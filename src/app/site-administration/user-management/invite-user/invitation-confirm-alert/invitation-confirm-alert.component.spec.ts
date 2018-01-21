import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvitationConfirmAlertComponent } from './invitation-confirm-alert.component';

describe('InvitationConfirmAlertComponent', () => {
  let component: InvitationConfirmAlertComponent;
  let fixture: ComponentFixture<InvitationConfirmAlertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvitationConfirmAlertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvitationConfirmAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
