import { Component, ViewEncapsulation } from '@angular/core';
import { TestamonialComponent } from '../testamonial/testamonial.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [TestamonialComponent,FooterComponent],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css',
  
})
export class HomepageComponent {

}
