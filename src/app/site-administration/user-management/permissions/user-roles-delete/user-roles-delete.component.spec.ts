import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRolesDeleteComponent } from './user-roles-delete.component';

describe('UserRoleDeleteComponent', () => {
  let component: UserRolesDeleteComponent;
  let fixture: ComponentFixture<UserRolesDeleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserRolesDeleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserRolesDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
