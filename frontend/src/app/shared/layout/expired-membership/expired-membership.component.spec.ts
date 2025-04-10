import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpiredMembershipComponent } from './expired-membership.component';

describe('ExpiredMembershipComponent', () => {
  let component: ExpiredMembershipComponent;
  let fixture: ComponentFixture<ExpiredMembershipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpiredMembershipComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExpiredMembershipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
