import { Component } from '@angular/core';
import {AuthReviewCarouselComponent} from '../../../shared/layout/auth-review-carousel/auth-review-carousel.component' 

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [AuthReviewCarouselComponent],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent {

}
