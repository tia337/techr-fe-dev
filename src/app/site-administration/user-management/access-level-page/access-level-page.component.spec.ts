import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessLevelPageComponent } from './access-level-page.component';

describe('AccessLevelPageComponent', () => {
  let component: AccessLevelPageComponent;
  let fixture: ComponentFixture<AccessLevelPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccessLevelPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccessLevelPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
