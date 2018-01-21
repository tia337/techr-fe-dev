import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrossPlatformComponent } from './cross-platform.component';

describe('CrossPlatformComponent', () => {
  let component: CrossPlatformComponent;
  let fixture: ComponentFixture<CrossPlatformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrossPlatformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrossPlatformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
