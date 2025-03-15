import { Component } from '@angular/core';

@Component({
  selector: 'app-testamonial',
  standalone: true,
  imports: [],
  templateUrl: './testamonial.component.html',
  styleUrl: './testamonial.component.css'
})
export class TestamonialComponent {

  currentIndex = 0;

  goToSlide(index: number) {
    this.currentIndex = index;
  }
}
