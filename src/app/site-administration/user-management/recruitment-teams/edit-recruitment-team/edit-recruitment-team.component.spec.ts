import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditRecruitmentTeamComponent } from './edit-recruitment-team.component';

describe('EditRecruitmentTeamComponent', () => {
  let component: EditRecruitmentTeamComponent;
  let fixture: ComponentFixture<EditRecruitmentTeamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditRecruitmentTeamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditRecruitmentTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
