import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentsuccesComponent } from './paymentsucces.component';

describe('PaymentsuccesComponent', () => {
  let component: PaymentsuccesComponent;
  let fixture: ComponentFixture<PaymentsuccesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentsuccesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PaymentsuccesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
