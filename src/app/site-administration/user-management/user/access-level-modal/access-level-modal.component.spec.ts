import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessLevelModalComponent } from './access-level-modal.component';

describe('AccessLevelModalComponent', () => {
  let component: AccessLevelModalComponent;
  let fixture: ComponentFixture<AccessLevelModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccessLevelModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccessLevelModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
