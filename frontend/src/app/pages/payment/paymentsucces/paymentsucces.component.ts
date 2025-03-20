import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentService } from '../../../core/services/payment/payment.service';


@Component({
  selector: 'app-paymentsucces',
  standalone: true,
  imports: [],
  templateUrl: './paymentsucces.component.html',
  styleUrl: './paymentsucces.component.css'
})
export class PaymentsuccesComponent {
  sessionId:any
  constructor(
    private route: ActivatedRoute,
    private paymentService: PaymentService,
    private router: Router
  ) {}

  ngOnInit() {
    this.sessionId = this.route.snapshot.queryParamMap.get('session_id');
    console.log(this.sessionId)

    if (this.sessionId) {
      this.paymentService.confirmPayment(this.sessionId).subscribe({
        next: () => {
          alert("Payment successful! Your account is under review.");
          this.router.navigate(['/']); // Redirect to home
        },
        error: (err:any) => {
          console.error("Payment verification failed:", err);
        }
      });
    }
  }
}


