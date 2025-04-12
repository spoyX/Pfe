import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentService } from '../../../core/services/payment/payment.service';
import { AuthentificationService } from '../../../core/auth/authentification.service';

@Component({
  selector: 'app-subscription-succes',
  standalone: true,
  imports: [],
  templateUrl: './subscription-succes.component.html',
  styleUrl: './subscription-succes.component.css'
})
export class SubscriptionSuccesComponent {
  sessionId:any

  constructor(
    private route: ActivatedRoute,
    private paymentService: PaymentService,
    private router: Router,
    private _auth:AuthentificationService
  ) {}

  ngOnInit() {
    this.sessionId = this.route.snapshot.queryParamMap.get('session_id');
  

    if (this.sessionId) {
      this.paymentService.confirmRenew(this.sessionId).subscribe({
        next: () => {
          
    
        },
        error: (err:any) => {
          console.error("Payment verification failed:", err);
        }
      });

    }
  
  }
}




