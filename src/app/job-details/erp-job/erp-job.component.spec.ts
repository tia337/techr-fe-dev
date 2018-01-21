/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ErpJobComponent } from './erp-job.component';

describe('ErpJobComponent', () => {
  let component: ErpJobComponent;
  let fixture: ComponentFixture<ErpJobComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ErpJobComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ErpJobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
