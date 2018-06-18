import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectModalComponent } from './reject-modal.component';

describe('RejectModalComponent', () => {
  let component: RejectModalComponent;
  let fixture: ComponentFixture<RejectModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RejectModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RejectModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
