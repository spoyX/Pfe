import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionRenewComponent } from './subscription-renew.component';

describe('SubscriptionRenewComponent', () => {
  let component: SubscriptionRenewComponent;
  let fixture: ComponentFixture<SubscriptionRenewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubscriptionRenewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SubscriptionRenewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
