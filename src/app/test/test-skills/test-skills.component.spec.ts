import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestSkillsComponent } from './test-skills.component';

describe('TestSkillsComponent', () => {
  let component: TestSkillsComponent;
  let fixture: ComponentFixture<TestSkillsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestSkillsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestSkillsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
