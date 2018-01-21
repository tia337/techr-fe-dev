import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReedAuthComponent } from './reed-auth.component';

describe('ReedAuthComponent', () => {
  let component: ReedAuthComponent;
  let fixture: ComponentFixture<ReedAuthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReedAuthComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReedAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
