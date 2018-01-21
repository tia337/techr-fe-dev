import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateDetailsCustomComponent } from './template-details-custom.component';

describe('TemplateDetailsCustomComponent', () => {
  let component: TemplateDetailsCustomComponent;
  let fixture: ComponentFixture<TemplateDetailsCustomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemplateDetailsCustomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplateDetailsCustomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
