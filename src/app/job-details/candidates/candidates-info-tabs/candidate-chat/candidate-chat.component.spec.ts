import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateChatComponent } from './candidate-chat.component';

describe('CandidateChatComponent', () => {
  let component: CandidateChatComponent;
  let fixture: ComponentFixture<CandidateChatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CandidateChatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
