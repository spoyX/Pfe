import { Component } from '@angular/core';
import { TestamonialComponent } from '../testamonial/testamonial.component';
import {HomefooterComponent} from '../../../shared/layout/homefooter/homefooter.component'

import {HomenavbarComponent} from '../../../shared/layout/homenavbar/homenavbar.component'
@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [TestamonialComponent,HomenavbarComponent,HomefooterComponent],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})
export class HomepageComponent {

}
