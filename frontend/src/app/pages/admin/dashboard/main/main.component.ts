import { Component } from '@angular/core';
import { AuthentificationService } from '../../../../core/auth/authentification.service';
import { UserService } from '../../../../core/services/users/user.service';
import { RouterLink } from '@angular/router';
import { PaymentService } from '../../../../core/services/payment/payment.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-main',
  standalone: true,
  imports: [RouterLink,CommonModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {
  id:any
  data:any
  payments:any
  totalAmount: number = 0;
  paymentCount: number = 0;
  
 constructor(private _auth :AuthentificationService , private _user:UserService,private _payment:PaymentService){
   

 }
 ngOnInit(){
   this.id=this._auth.getDataFromToken()._id
   this._user.byid(this.id).subscribe({
     next: (res: any)=>{
       this.data=res
   
     
     }
   })
   this._payment.getPayment().subscribe({
    next:(res:any)=>{
      this.payments=res
      console.log(this.payments);
      this.calculatePaymentStats();

    },
    error:(err)=>{
      console.log(err);
      
    }
   })
 }

 calculatePaymentStats() {
  if (this.payments) {
    this.paymentCount = this.payments.length;
    this.totalAmount = this.payments.reduce((sum: number, payment: any) => sum + payment.amount, 0);
  }
}
 

}
