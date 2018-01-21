import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataDrivenRecruitmentComponent } from './data-driven-recruitment.component';

describe('DataDrivenRecruitmentComponent', () => {
  let component: DataDrivenRecruitmentComponent;
  let fixture: ComponentFixture<DataDrivenRecruitmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataDrivenRecruitmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataDrivenRecruitmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
