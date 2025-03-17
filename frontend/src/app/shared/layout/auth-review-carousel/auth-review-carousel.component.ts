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
      quote: '" Fantastic theme with a ton of options. If you just want the HTML to integrate with your project, then this is the package. You can find the files in the \'dist\' folder...no need to install git and all the other stuff the documentation talks about. "',
      author: 'Abs1981',
      title: 'Skote User'
    },
    {
      quote: '" If Every Vendor on Envato are as supportive as Themesbrand, Development with be a nice experience. You guys are Wonderful. Keep up the good work. "',
      author: 'nezerious',
      title: 'Skote User'
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

