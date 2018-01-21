import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteAdministrationComponent } from './site-administration.component';

describe('SiteAdministrationComponent', () => {
  let component: SiteAdministrationComponent;
  let fixture: ComponentFixture<SiteAdministrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SiteAdministrationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SiteAdministrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
