import { Component } from '@angular/core';
import { UserService } from '../../../../core/services/users/user.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MembershipService } from '../../../../core/services/memberships/membership.service';
import { PaymentService } from '../../../../core/services/payment/payment.service';

@Component({
  selector: 'app-profile-view',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './profile-view.component.html',
  styleUrl: './profile-view.component.css'
})
export class ProfileViewComponent {

  
  id: any;
  data: any; // User data
  datamembership: any; // Membership data
  payments: any[] = []; // Payment history (initialize as an empty array)

  // Flags to indicate if data was found
  userFound: boolean = false;
  membershipFound: boolean = false;
  paymentsFound: boolean = false;

  membershipPendingValidation: boolean = false;

  constructor(
    private _user: UserService,
    private _act: ActivatedRoute,
    private _membership: MembershipService,
    private _payment: PaymentService
  ) { }

  ngOnInit() {
    this.id = this._act.snapshot.paramMap.get('id');
 

    this.loadUserData();
    this.loadPaymentHistory();
    this.loadMembershipData();
   
  }

  loadUserData() {
    this._user.byid(this.id).subscribe({
      next: (res: any) => {
        this.data = res;
        console.log(this.data.profileImage)
        this.userFound = true; // Set userFound to true if data is received
        console.log("User data received:", res);
      },
      error: (err: any) => {
        this.userFound = false; // Set userFound to false in case of an error (user not found)
        console.log("User data error:", err);
     
      }
    });
  }
  addDaysToDate(dateString: string | Date, days: number): Date {
    const date = new Date(dateString);
    date.setDate(date.getDate() + days);
    return date;
  }
  loadMembershipData() {
    this._membership.getById(this.id).subscribe({
      next: (res: any) => {
        this.datamembership = res;
        this.membershipFound = true;

        console.log("Membership data received:", res);
      },
      error: (err: any) => {
        this.membershipFound = false;
        this.membershipPendingValidation = this.paymentsFound && !this.membershipFound;
        console.log("Membership data error:", err);
        console.log("membershipPendingValidation value:", this.membershipPendingValidation);
      }
    });
  }

  loadPaymentHistory() {
    this._payment.paymentHistory(this.id).subscribe({
      next: (res: any) => {
        this.payments = res;
        this.paymentsFound = res && res.length > 0; 
        console.log("Payment history:", res);
      },
      error: (err: any) => {
        this.paymentsFound = false;
        console.log("Payment error:", err);
      }
    });
  }
  delete(id:any){
    this._user.deleteUser(id).subscribe({
      next:(res:any)=>{
        console.log(res);
        this.loadUserData();
      },
      error:(err:any)=>{
        console.log(err);
      }
    })

  }
}