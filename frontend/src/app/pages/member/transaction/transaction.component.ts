import { Component } from '@angular/core';
import { PaymentService } from '../../../core/services/payment/payment.service';
import { UserService } from '../../../core/services/users/user.service';
import { AuthentificationService } from '../../../core/auth/authentification.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-transaction',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './transaction.component.html',
  styleUrl: './transaction.component.css'
})
export class TransactionComponent {
  id:any
  data:any
  history:any
  firstPayment:any
  totalAmount:any
 constructor(private _auth :AuthentificationService , private _user:UserService,private _payment:PaymentService){
   

 }
 ngOnInit(){
   this.id=this._auth.getDataFromToken()._id
   this._user.byid(this.id).subscribe({
     next: (res: any)=>{
       this.data=res
   
     
     }
   })
 

   this._payment.paymentHistory(this.id).subscribe({
    next:(res:any)=>{
      this.history=res
      if (this.history && this.history.length > 0) {
        this.firstPayment = this.history[0];
        this.totalAmount = this.history.reduce((sum: number, history: any) => sum + history.amount, 0);
      }
      

    },
    error:(err:any)=>{ 
      console.log(err);
      

    }

   })


 }
}