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
  selectedPlan: 'monthly' | 'annual' = 'monthly';
  monthlyPrice: number = 9; // Price per month in dollars
  annualPrice: number = 90; // Price per year in dollars

  constructor(private router: Router, private paymentService: PaymentService) {}

  selectPlan(plan: 'monthly' | 'annual'): void {
    this.selectedPlan = plan;
  }

  upgradePlan(): void {
    // Calculate the amount in cents
    const amount = this.selectedPlan === 'monthly' ? this.monthlyPrice * 100 : this.annualPrice * 100;
    // Get the userId from local storage (ensure it's stored without extra spaces)
    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert('User ID not found. Please log in.');
      return;
    }
    // Call your payment service to create a checkout session
    this.paymentService.createCheckoutSession(userId, amount).subscribe({
      next: (res: any) => {
        if (res.url) {
          // Redirect to Stripe checkout
          window.location.href = res.url;
        } else {
          console.error('No checkout URL returned.');
        }
      },
      error: (err: any) => {
        console.error('Payment error:', err);
      }
    });
  }
}