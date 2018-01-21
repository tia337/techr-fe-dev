import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobsSettingsComponent } from './jobs-settings.component';

describe('JobsSettingsComponent', () => {
  let component: JobsSettingsComponent;
  let fixture: ComponentFixture<JobsSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobsSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobsSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
