import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TalentbaseComponent } from './talentbase.component';

describe('TalentbaseComponent', () => {
  let component: TalentbaseComponent;
  let fixture: ComponentFixture<TalentbaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TalentbaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TalentbaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
