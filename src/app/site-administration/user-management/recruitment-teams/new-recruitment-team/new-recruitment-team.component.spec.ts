import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewRecruitmentTeamComponent } from './new-recruitment-team.component';

describe('NewRecruitmentTeamComponent', () => {
  let component: NewRecruitmentTeamComponent;
  let fixture: ComponentFixture<NewRecruitmentTeamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewRecruitmentTeamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewRecruitmentTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
