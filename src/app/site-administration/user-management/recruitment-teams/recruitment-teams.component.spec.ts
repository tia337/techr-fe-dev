import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecruitmentTeamsComponent } from './recruitment-teams.component';

describe('RecruitmentTeamsComponent', () => {
  let component: RecruitmentTeamsComponent;
  let fixture: ComponentFixture<RecruitmentTeamsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecruitmentTeamsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecruitmentTeamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
