import { Component } from '@angular/core';
import {AuthReviewCarouselComponent} from '../../../shared/layout/auth-review-carousel/auth-review-carousel.component' 
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-forget-password',
  standalone: true,
  imports: [AuthReviewCarouselComponent,RouterModule],
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.css'
})
export class ForgetPasswordComponent {

}
