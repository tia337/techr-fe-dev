import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministrationMenuComponent } from './administration-menu.component';

describe('AdministrationMenuComponent', () => {
  let component: AdministrationMenuComponent;
  let fixture: ComponentFixture<AdministrationMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdministrationMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdministrationMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
