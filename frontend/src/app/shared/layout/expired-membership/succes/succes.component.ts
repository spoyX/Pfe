import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PaymentService } from '../../../../core/services/payment/payment.service';
@Component({
  selector: 'app-succes',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './succes.component.html',
  styleUrl: './succes.component.css'
})
export class SuccesComponent {
  sessionId:any
  constructor(
    private route: ActivatedRoute,
    private paymentService: PaymentService,
    private router: Router
  ) {}

  ngOnInit() {
    this.sessionId = this.route.snapshot.queryParamMap.get('session_id');
  

    if (this.sessionId) {
      this.paymentService.confirm(this.sessionId).subscribe({
        next: () => {
          
    
        },
        error: (err:any) => {
          console.error("Payment verification failed:", err);
        }
      });
    }
  }
}

