import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreadGmailComponent } from './thread-gmail.component';

describe('ThreadGmailComponent', () => {
  let component: ThreadGmailComponent;
  let fixture: ComponentFixture<ThreadGmailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThreadGmailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThreadGmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
