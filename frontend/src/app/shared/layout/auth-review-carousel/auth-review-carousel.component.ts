import { Component } from '@angular/core';

@Component({
  selector: 'app-auth-review-carousel',
  standalone: true,
  imports: [],
  templateUrl: './auth-review-carousel.component.html',
  styleUrl: './auth-review-carousel.component.css'
})
export class AuthReviewCarouselComponent {
  testimonials = [
    {
      quote: '"The CCCT platform helped us connect with Canadian partners faster than ever. A real game-changer for cross-border collaboration."',
      author: 'Amira B.',
      title: 'Tunisian Entrepreneur'
    },
    {
      quote: '"Managing memberships and events has become seamless. The dashboard is intuitive and powerful. Great work!"',
      author: 'Karim D.',
      title: 'CCCT Admin'
    },
    {
      quote: '"Thanks to CCCT’s online system, we were able to register and join the network from abroad without any hassle."',
      author: 'Julie C.',
      title: 'New Member from Montreal'
    },
    {
      quote: '"I really appreciate the payment integration and reminders. Everything is automated and efficient!"',
      author: 'Mehdi R.',
      title: 'Business Consultant'
    },
    {
      quote: '"The calendar and event system keeps us informed and involved. I never miss an opportunity anymore."',
      author: 'Lina S.',
      title: 'Active Member'
    }
  ];

  currentTestimonialIndex = 0;
  slideInterval: any;

  constructor() { }

  ngOnInit(): void {
    this.startAutoSlide();
  }

  ngOnDestroy(): void {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
  }

  prevSlide(): void {
    this.currentTestimonialIndex = (this.currentTestimonialIndex - 1 + this.testimonials.length) % this.testimonials.length;
  }

  nextSlide(): void {
    this.currentTestimonialIndex = (this.currentTestimonialIndex + 1) % this.testimonials.length;
  }

  startAutoSlide(): void {
    this.slideInterval = setInterval(() => {
      this.nextSlide();
    }, 8000); // Slide every 8 seconds
  }
}

