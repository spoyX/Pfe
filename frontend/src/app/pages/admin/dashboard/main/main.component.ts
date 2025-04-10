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
      

    },
    error:(err)=>{
      console.log(err);
      
    }
   })
 }
 

}
