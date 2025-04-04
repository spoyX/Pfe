import { Component } from '@angular/core';
import { HomefooterComponent } from '../../../shared/layout/homefooter/homefooter.component';
import { HomenavbarComponent } from '../../../shared/layout/homenavbar/homenavbar.component';
@Component({
  selector: 'app-payment-fail',
  standalone: true,
  imports: [HomenavbarComponent,HomefooterComponent],
  templateUrl: './payment-fail.component.html',
  styleUrl: './payment-fail.component.css'
})
export class PaymentFailComponent {

}
