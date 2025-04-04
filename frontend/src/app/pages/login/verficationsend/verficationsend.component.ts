import { Component } from '@angular/core';
import {AuthReviewCarouselComponent} from '../../../shared/layout/auth-review-carousel/auth-review-carousel.component' 
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-verficationsend',
  standalone: true,
  imports: [AuthReviewCarouselComponent,RouterLink],
  templateUrl: './verficationsend.component.html',
  styleUrl: './verficationsend.component.css'
})
export class VerficationsendComponent {
 email:any
  constructor(){

  }
  ngOnInit(){
   this.email=localStorage.getItem('email')   
  }
  


}
