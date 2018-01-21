import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionsUpgradeComponent } from './subscriptions-upgrade.component';

describe('SubscriptionsUpgradeComponent', () => {
  let component: SubscriptionsUpgradeComponent;
  let fixture: ComponentFixture<SubscriptionsUpgradeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubscriptionsUpgradeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriptionsUpgradeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
