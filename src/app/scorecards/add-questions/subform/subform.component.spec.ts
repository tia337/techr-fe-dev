import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubformComponent } from './subform.component';

describe('SubformComponent', () => {
  let component: SubformComponent;
  let fixture: ComponentFixture<SubformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
