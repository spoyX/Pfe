import { Component } from '@angular/core';
import { HomenavbarComponent } from "../homenavbar/homenavbar.component";
import { HomefooterComponent } from "../homefooter/homefooter.component";

@Component({
  selector: 'app-aboutus',
  standalone: true,
  imports: [HomenavbarComponent, HomefooterComponent],
  templateUrl: './aboutus.component.html',
  styleUrl: './aboutus.component.css'
})
export class AboutusComponent {

}
