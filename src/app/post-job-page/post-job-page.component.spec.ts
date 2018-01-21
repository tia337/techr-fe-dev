import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostJobPageComponent } from './post-job-page.component';

describe('PostJobPageComponent', () => {
  let component: PostJobPageComponent;
  let fixture: ComponentFixture<PostJobPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostJobPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostJobPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
