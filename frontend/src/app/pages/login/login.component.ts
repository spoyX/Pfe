import { Component } from '@angular/core';
import {AuthReviewCarouselComponent} from '../../shared/layout/auth-review-carousel/auth-review-carousel.component' 
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [AuthReviewCarouselComponent,RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

}
