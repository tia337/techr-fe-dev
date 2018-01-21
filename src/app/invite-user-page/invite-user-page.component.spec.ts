import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InviteUserPageComponent } from './invite-user-page.component';

describe('InviteUserPageComponent', () => {
  let component: InviteUserPageComponent;
  let fixture: ComponentFixture<InviteUserPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InviteUserPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InviteUserPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
