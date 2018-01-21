import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReachAndManageCandidatesComponent } from './reach-and-manage-candidates.component';

describe('ReachAndManageCandidatesComponent', () => {
  let component: ReachAndManageCandidatesComponent;
  let fixture: ComponentFixture<ReachAndManageCandidatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReachAndManageCandidatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReachAndManageCandidatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
