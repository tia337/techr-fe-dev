import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppIntegrationsComponent } from './app-integrations.component';

describe('AppIntegrationsComponent', () => {
  let component: AppIntegrationsComponent;
  let fixture: ComponentFixture<AppIntegrationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppIntegrationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppIntegrationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
