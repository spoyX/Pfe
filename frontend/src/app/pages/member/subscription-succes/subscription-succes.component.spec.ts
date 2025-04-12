import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionSuccesComponent } from './subscription-succes.component';

describe('SubscriptionSuccesComponent', () => {
  let component: SubscriptionSuccesComponent;
  let fixture: ComponentFixture<SubscriptionSuccesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubscriptionSuccesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SubscriptionSuccesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
