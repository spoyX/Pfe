import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthReviewCarouselComponent } from './auth-review-carousel.component';

describe('AuthReviewCarouselComponent', () => {
  let component: AuthReviewCarouselComponent;
  let fixture: ComponentFixture<AuthReviewCarouselComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthReviewCarouselComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AuthReviewCarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
