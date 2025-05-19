import { Component } from '@angular/core';
import { HomefooterComponent } from "../homefooter/homefooter.component";
import { HomenavbarComponent } from "../homenavbar/homenavbar.component";
import { PaymentService } from '../../../core/services/payment/payment.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-subscriptionplan-notcompleted',
  standalone: true,
  imports: [CommonModule,HomefooterComponent, HomenavbarComponent],
  templateUrl: './subscriptionplan-notcompleted.component.html',
  styleUrl: './subscriptionplan-notcompleted.component.css'
})
export class SubscriptionplanNotcompletedComponent {
 selectedPlan: 'monthly' | '3months' | '6months' | null = null;
  planPrices: { [key: string]: number } = {
    'monthly': 9,
    '3months': 24,
    '6months': 42
  };
  userId:any

  constructor(private router: Router, private paymentService: PaymentService,private _act:ActivatedRoute) {}



  ngOnInit(){
     this.userId=this._act.snapshot.params['id'];
  }
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
   
    if (!this.userId) {
      alert('User ID not found. Please log in.');
      this.router.navigate(['/login']);
      return;
    }

    // Call your payment service to create a checkout session
    this.paymentService.createCheckoutSession(this.userId, amountInCents).subscribe({
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

