import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionplanNotcompletedComponent } from './subscriptionplan-notcompleted.component';

describe('SubscriptionplanNotcompletedComponent', () => {
  let component: SubscriptionplanNotcompletedComponent;
  let fixture: ComponentFixture<SubscriptionplanNotcompletedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubscriptionplanNotcompletedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SubscriptionplanNotcompletedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
