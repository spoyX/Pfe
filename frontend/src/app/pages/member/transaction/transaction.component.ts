import { Component } from '@angular/core';
import { PaymentService } from '../../../core/services/payment/payment.service';
import { UserService } from '../../../core/services/users/user.service';
import { AuthentificationService } from '../../../core/auth/authentification.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-transaction',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './transaction.component.html',
  styleUrl: './transaction.component.css'
})
export class TransactionComponent {
  id:any
  data:any
  history:any
  firstPayment:any
 constructor(private _auth :AuthentificationService , private _user:UserService,private _payment:PaymentService){
   

 }
 ngOnInit(){
   this.id=this._auth.getDataFromToken()._id
   this._user.byid(this.id).subscribe({
     next: (res: any)=>{
       this.data=res
   
     
     }
   })
   this.id=this._auth.getDataFromToken()._id

   this._payment.paymentHistory(this.id).subscribe({
    next:(res:any)=>{
      this.history=res
      if (this.history && this.history.length > 0) {
        this.firstPayment = this.history[0];
      }
      

    },
    error:(err:any)=>{ 
      console.log(err);
      

    }

   })


 }
}