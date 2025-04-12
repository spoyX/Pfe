import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PaymentService } from '../../../core/services/payment/payment.service';
import { AuthentificationService } from '../../../core/auth/authentification.service';

@Component({
  selector: 'app-subscription-renew',
  standalone: true,
  imports: [],
  templateUrl: './subscription-renew.component.html',
  styleUrl: './subscription-renew.component.css'
})
export class SubscriptionRenewComponent {
  selectedPlan: 'monthly' | '3months' | '6months' | null = null;
  planPrices: { [key: string]: number } = {
    'monthly': 9,
    '3months': 24,
    '6months': 42
  };
  idUser:any

  constructor(private router: Router, private paymentService: PaymentService,private _auth:AuthentificationService) {}

  selectPlan(plan: 'monthly' | '3months' | '6months'): void {
    this.selectedPlan = plan;
    this.upgradePlan();
  }
  ngOnInit(){
 this.idUser=this._auth.getDataFromToken()._id
  }

  upgradePlan(): void {
    if (!this.selectedPlan) {
      alert('Please select a plan first.');
      return;
    }

    // Calculate the amount in cents
    const amountInDollars = this.planPrices[this.selectedPlan];
    const amountInCents = amountInDollars * 100;

    // Get the userId from local storage
    const userId = this.idUser
    if (!userId) {
      alert('User ID not found. Please log in.');
      this.router.navigate(['/login']);
      return;
    }

    // Call your payment service to create a checkout session
    this.paymentService.checkoutRenew(userId, amountInCents).subscribe({
      next: (res: any) => {
        if (res.url) {
          // Redirect to Stripe checkout
          window.location.href = res.url;
        } else {
          console.error('No checkout URL returned.');
          alert('Failed to create checkout session.');
        }
      },
      error: (err: any) => {
        console.error('Payment error:', err);
        alert('An error occurred during payment processing.');
      }
    });
  }
}


