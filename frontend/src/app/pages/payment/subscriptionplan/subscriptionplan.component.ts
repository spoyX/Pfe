import { Component } from '@angular/core';
import { PaymentService } from '../../../core/services/payment/payment.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HomefooterComponent } from '../../../shared/layout/homefooter/homefooter.component';
import { HomenavbarComponent } from '../../../shared/layout/homenavbar/homenavbar.component';

@Component({
  selector: 'app-subscriptionplan',
  standalone: true,
  imports: [CommonModule,HomenavbarComponent,HomefooterComponent],
  templateUrl: './subscriptionplan.component.html',
  styleUrl: './subscriptionplan.component.css'
})
export class SubscriptionplanComponent {
  selectedPlan: 'monthly' | '3months' | '6months' | null = null;
  planPrices: { [key: string]: number } = {
    'monthly': 9,
    '3months': 24,
    '6months': 42
  };

  constructor(private router: Router, private paymentService: PaymentService) {}

  selectPlan(plan: 'monthly' | '3months' | '6months'): void {
    this.selectedPlan = plan;
    this.upgradePlan();
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
    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert('User ID not found. Please log in.');
      this.router.navigate(['/login']);
      return;
    }

    // Call your payment service to create a checkout session
    this.paymentService.createCheckoutSession(userId, amountInCents).subscribe({
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